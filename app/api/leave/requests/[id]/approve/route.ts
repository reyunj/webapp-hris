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

    // Get the leave request
    const { data: leaveRequest, error: fetchError } = await supabase
      .from('leave_requests')
      .select('*, employees(*)')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Update leave request status
    // @ts-ignore - Type inference issue with placeholder Database type
    const { data, error } = await supabase
      .from('leave_requests')
      // @ts-ignore
      .update({
        status: 'approved' as any,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update leave balance manually
    const currentYear = new Date().getFullYear();
    const { data: balance } = await supabase
      .from('leave_balances')
      .select('*')
      .eq('employee_id', (leaveRequest as any).employee_id)
      .eq('leave_type', (leaveRequest as any).leave_type)
      .eq('year', currentYear)
      .single();

    if (balance) {
      // @ts-ignore - Type inference issue with placeholder Database type
      await supabase
        .from('leave_balances')
        // @ts-ignore
        .update({
          used_days: (balance as any).used_days + (leaveRequest as any).days_requested,
          remaining_days: (balance as any).remaining_days - (leaveRequest as any).days_requested,
        } as any)
        .eq('id', (balance as any).id);
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
