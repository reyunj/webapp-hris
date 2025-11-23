import { createClient } from '@/lib/supabase/server';
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
    const body = await request.json();

    const { data, error } = await supabase
      .from('employees')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    // Create audit log
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

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
