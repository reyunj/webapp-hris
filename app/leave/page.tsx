'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import { FileLeaveDialog } from '@/components/leave/file-leave-dialog';
import { ViewLeaveDialog } from '@/components/leave/view-leave-dialog';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  reason: string;
  employees?: {
    first_name: string;
    last_name: string;
  };
}

export default function LeavePage() {
  const [isFileLeaveOpen, setIsFileLeaveOpen] = useState(false);
  const [isViewLeaveOpen, setIsViewLeaveOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [leaveBalance, setLeaveBalance] = useState([
    { type: 'Vacation', total: 0, used: 0, remaining: 0 },
    { type: 'Sick Leave', total: 0, used: 0, remaining: 0 },
    { type: 'Emergency', total: 0, used: 0, remaining: 0 },
  ]);

  // Fetch leave balances
  const fetchLeaveBalances = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: employee, error: empError } = await supabase
          .from('employees')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (empError) {
          console.error('Error fetching employee:', empError);
          return;
        }
        
        if (employee) {
          const { data: balances, error: balError } = await supabase
            .from('leave_balances')
            .select('*')
            .eq('employee_id', (employee as any).id)
            .eq('year', new Date().getFullYear());
          
          if (balError) {
            console.error('Error fetching balances:', balError);
            return;
          }
          
          if (balances && balances.length > 0) {
            const formattedBalances = balances.map((b: any) => ({
              type: b.leave_type.charAt(0).toUpperCase() + b.leave_type.slice(1),
              total: b.total_days,
              used: b.used_days,
              remaining: b.remaining_days,
            }));
            setLeaveBalance(formattedBalances);
          } else {
            // No balances found, keep default values
            console.log('No leave balances found for employee');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    }
  };

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/leave/requests');
      const result = await response.json();
      
      if (response.ok && result.data) {
        setLeaveRequests(result.data);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserRole((profile as any).role);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
    fetchLeaveBalances();
    fetchLeaveRequests();
  }, []);

  const handleViewLeave = (request: LeaveRequest) => {
    setSelectedLeaveRequest(request);
    setIsViewLeaveOpen(true);
  };

  const handleActionComplete = () => {
    fetchLeaveRequests();
    fetchLeaveBalances();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'warning' | 'success' | 'destructive' | 'secondary'> = {
      pending: 'warning',
      approved: 'success',
      rejected: 'destructive',
      cancelled: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
            <p className="text-zinc-500 ">
              Track and manage employee leave requests
            </p>
          </div>
          <Button onClick={() => setIsFileLeaveOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {leaveBalance.map((balance) => (
            <Card key={balance.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {balance.type}
                </CardTitle>
                <Calendar className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{balance.remaining} days</div>
                <p className="text-xs text-zinc-500 ">
                  {balance.used} used of {balance.total} total
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 ">
                  <div
                    className="h-full bg-zinc-900 "
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-zinc-500">Loading leave requests...</p>
              </div>
            </div>
          ) : leaveRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {request.employees 
                        ? `${request.employees.first_name} ${request.employees.last_name}`
                        : 'Unknown Employee'}
                    </TableCell>
                    <TableCell className="capitalize">{request.leave_type.replace('_', ' ')}</TableCell>
                    <TableCell>{new Date(request.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{request.days_requested}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewLeave(request)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="h-16 w-16 text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leave requests</h3>
              <p className="text-sm text-zinc-500 mb-4">
                Leave requests will appear here when submitted
              </p>
            </div>
          )}
        </div>
      </div>

      <FileLeaveDialog
        open={isFileLeaveOpen}
        onOpenChange={(open) => {
          setIsFileLeaveOpen(open);
          if (!open) {
            // Refresh leave requests when dialog closes
            fetchLeaveRequests();
          }
        }}
      />

      <ViewLeaveDialog
        open={isViewLeaveOpen}
        onOpenChange={setIsViewLeaveOpen}
        leaveRequest={selectedLeaveRequest}
        userRole={userRole}
        onActionComplete={handleActionComplete}
      />
    </DashboardLayout>
  );
}

