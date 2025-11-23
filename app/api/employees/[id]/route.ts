import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Get current data for audit log
    const { data: currentData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    // @ts-ignore - Type inference issue with placeholder Database type, will resolve with generated types
    const { data, error } = await supabase
      // @ts-ignore
      .from('employees')
      // @ts-ignore
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Create audit log
    const { data: { user } } = await supabase.auth.getUser();
    if (user && currentData && data) {
      // @ts-ignore - Type inference issue with placeholder Database type
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'UPDATE',
        entity_type: 'employee',
        entity_id: id,
        changes: { before: currentData, after: data } as any,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Get current data for audit log
    const { data: currentData } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Create audit log
    const { data: { user } } = await supabase.auth.getUser();
    if (user && currentData) {
      // @ts-ignore - Type inference issue with placeholder Database type
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'DELETE',
        entity_type: 'employee',
        entity_id: id,
        changes: currentData as any,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
