'use client';

import { useState } from 'react';
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

export default function LeavePage() {
  const [isFileLeaveOpen, setIsFileLeaveOpen] = useState(false);
  const leaveBalance = [
    { type: 'Vacation', total: 0, used: 0, remaining: 0 },
    { type: 'Sick Leave', total: 0, used: 0, remaining: 0 },
    { type: 'Personal', total: 0, used: 0, remaining: 0 },
  ];

  const leaveRequests: Array<{
    id: string;
    employee: string;
    type: string;
    startDate: string;
    endDate: string;
    days: number;
    status: string;
  }> = [];

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

        <div className="rounded-lg border border-zinc-200 bg-white  ">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>
          {leaveRequests.length > 0 ? (
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
                    <TableCell className="font-medium">{request.employee}</TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{new Date(request.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(request.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      {request.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            Reject
                          </Button>
                        </div>
                      )}
                      {request.status !== 'pending' && (
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="h-16 w-16 text-zinc-300  mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leave requests</h3>
              <p className="text-sm text-zinc-500  mb-4">
                Leave requests will appear here when submitted
              </p>
            </div>
          )}
        </div>
      </div>

      <FileLeaveDialog
        open={isFileLeaveOpen}
        onOpenChange={setIsFileLeaveOpen}
      />
    </DashboardLayout>
  );
}

