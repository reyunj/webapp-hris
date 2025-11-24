'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, Clock, FileText } from 'lucide-react';
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
  approved_at?: string;
  rejection_reason?: string;
}

interface ViewLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: LeaveRequest | null;
  userRole: string | null;
  onActionComplete: () => void;
}

export function ViewLeaveDialog({ 
  open, 
  onOpenChange, 
  leaveRequest,
  userRole,
  onActionComplete 
}: ViewLeaveDialogProps) {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!leaveRequest) return null;

  const canApprove = (userRole === 'super_admin' || userRole === 'admin' || userRole === 'hr_manager' || userRole === 'manager') 
    && leaveRequest.status === 'pending';

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/leave/requests/${leaveRequest.id}/approve`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve leave request');
      }

      toast.success('Leave request approved successfully!');
      onActionComplete();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/leave/requests/${leaveRequest.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject leave request');
      }

      toast.success('Leave request rejected');
      onActionComplete();
      onOpenChange(false);
      setShowRejectForm(false);
      setRejectionReason('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'warning' | 'success' | 'destructive' | 'secondary'; label: string }> = {
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'destructive', label: 'Rejected' },
      cancelled: { variant: 'secondary', label: 'Cancelled' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Leave Request Details</DialogTitle>
          <DialogDescription>
            View and manage leave request information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
            <User className="h-5 w-5 text-zinc-500" />
            <div>
              <p className="font-medium">
                {leaveRequest.employees 
                  ? `${leaveRequest.employees.first_name} ${leaveRequest.employees.last_name}`
                  : 'Unknown Employee'}
              </p>
              <p className="text-sm text-zinc-500">Employee</p>
            </div>
          </div>

          {/* Leave Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-500">Leave Type</Label>
              <p className="font-medium capitalize mt-1">
                {leaveRequest.leave_type.replace('_', ' ')}
              </p>
            </div>
            <div>
              <Label className="text-zinc-500">Status</Label>
              <div className="mt-1">{getStatusBadge(leaveRequest.status)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-zinc-500">Start Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <p className="font-medium">
                  {new Date(leaveRequest.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-zinc-500">End Date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <p className="font-medium">
                  {new Date(leaveRequest.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-zinc-500">Days Requested</Label>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-zinc-400" />
                <p className="font-medium">{leaveRequest.days_requested} days</p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label className="text-zinc-500">Reason</Label>
            <div className="mt-2 p-3 bg-zinc-50 rounded-lg">
              <p className="text-sm">{leaveRequest.reason || 'No reason provided'}</p>
            </div>
          </div>

          {/* Rejection Reason (if rejected) */}
          {leaveRequest.status === 'rejected' && leaveRequest.rejection_reason && (
            <div>
              <Label className="text-zinc-500">Rejection Reason</Label>
              <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">{leaveRequest.rejection_reason}</p>
              </div>
            </div>
          )}

          {/* Approved Date */}
          {leaveRequest.status !== 'pending' && leaveRequest.approved_at && (
            <div>
              <Label className="text-zinc-500">
                {leaveRequest.status === 'approved' ? 'Approved At' : 'Processed At'}
              </Label>
              <p className="text-sm mt-1">
                {new Date(leaveRequest.approved_at).toLocaleString()}
              </p>
            </div>
          )}

          {/* Reject Form */}
          {showRejectForm && (
            <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this leave request..."
                rows={3}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {canApprove && !showRejectForm && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectForm(true)}
                  disabled={loading}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={loading}
                >
                  {loading ? 'Approving...' : 'Approve'}
                </Button>
              </>
            )}

            {showRejectForm && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectionReason('');
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={loading || !rejectionReason.trim()}
                >
                  {loading ? 'Rejecting...' : 'Confirm Rejection'}
                </Button>
              </>
            )}

            {!canApprove && (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
