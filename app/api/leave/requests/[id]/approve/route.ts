import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get employee record for approved_by
    const { data: approver } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    // Get the leave request
    const { data: leaveRequest, error: fetchError } = await supabase
      .from('leave_requests')
      .select('employee_id, leave_type, days_requested')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      throw fetchError;
    }

    // Update leave request status
    // @ts-ignore - Type inference issue
    const { data, error } = await supabase
      .from('leave_requests')
      // @ts-ignore
      .update({
        status: 'approved',
        approved_by: approver ? (approver as any).id : null,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }

    // Update leave balance - only update used_days, remaining_days is auto-calculated
    const currentYear = new Date().getFullYear();
    const { data: balance, error: balanceError } = await supabase
      .from('leave_balances')
      .select('*')
      .eq('employee_id', (leaveRequest as any).employee_id)
      .eq('leave_type', (leaveRequest as any).leave_type)
      .eq('year', currentYear)
      .maybeSingle();

    if (balanceError) {
      console.error('Balance fetch error:', balanceError);
    }

    if (balance) {
      const newUsedDays = (balance as any).used_days + (leaveRequest as any).days_requested;
      
      // @ts-ignore
      const { error: updateBalanceError } = await supabase
        .from('leave_balances')
        // @ts-ignore
        .update({
          used_days: newUsedDays,
        })
        .eq('id', (balance as any).id);
      
      if (updateBalanceError) {
        console.error('Balance update error:', updateBalanceError);
      }
    }

    return NextResponse.json({ data, message: 'Leave request approved successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
