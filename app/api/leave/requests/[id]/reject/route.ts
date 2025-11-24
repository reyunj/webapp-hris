import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { reason } = body;

    // Get employee record for approved_by
    const { data: approver } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // Update leave request status to rejected
    // @ts-ignore
    const { data, error } = await supabase
      .from('leave_requests')
      // @ts-ignore
      .update({
        status: 'rejected',
        approved_by: approver ? (approver as any).id : null,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || 'No reason provided',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Reject error:', error);
      throw error;
    }

    return NextResponse.json({ data, message: 'Leave request rejected' });
  } catch (error) {
    console.error('Reject API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
