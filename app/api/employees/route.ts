import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (department) {
      query = query.eq('department', department);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const adminClient = await createAdminClient();
    const body = await request.json();

    console.log('Attempting to insert employee:', body);

    // Step 1: Create auth user with employee email (requires admin client)
    const temporaryPassword = `Temp${Math.random().toString(36).slice(-8)}!`;
    
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: body.email,
      password: temporaryPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: body.first_name,
        last_name: body.last_name,
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    console.log('Auth user created:', authData.user.id);

    // Step 2: Create profile with specified role
    const { error: profileError} = await adminClient
      .from('profiles')
      // @ts-ignore - Type inference issue with placeholder Database type
      .insert({
        id: authData.user.id,
        email: body.email,
        full_name: `${body.first_name} ${body.last_name}`,
        role: body.role || 'employee',
        department: body.department,
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw - continue with employee creation
    }

    // Step 3: Create employee record linked to auth user
    const employeeData = {
      ...body,
      user_id: authData.user.id, // Link to auth user
    };

    const { data, error } = await supabase
      .from('employees')
      .insert(employeeData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Employee created successfully:', data);

    // Step 4: Create audit log
    const { data: { user } } = await supabase.auth.getUser();
    if (user && data) {
      // @ts-ignore - Type inference issue with placeholder Database type
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'CREATE',
        entity_type: 'employee',
        entity_id: (data as any).id,
        changes: body,
      });
    }

    // Return success with temporary password
    return NextResponse.json({ 
      data,
      auth: {
        email: body.email,
        temporary_password: temporaryPassword,
        message: 'Employee can login with this temporary password. They should change it on first login.'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/employees error:', error);
    
    // For Supabase errors, return more details
    const errorObj = error as any;
    return NextResponse.json(
      { 
        error: errorObj?.message || (error instanceof Error ? error.message : 'An error occurred'),
        code: errorObj?.code || null,
        details: errorObj?.details || null,
        hint: errorObj?.hint || null,
      },
      { status: 500 }
    );
  }
}

