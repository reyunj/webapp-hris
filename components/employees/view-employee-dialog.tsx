'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Employee {
  id: string;
  user_id?: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  hire_date: string;
  department: string;
  position: string;
  manager_id?: string;
  employment_type: string;
  status: string;
  address?: any;
  emergency_contact?: any;
  created_at: string;
  updated_at: string;
}

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onEdit?: (employee: Employee) => void;
}

export function ViewEmployeeDialog({ open, onOpenChange, employee, onEdit }: ViewEmployeeDialogProps) {
  if (!employee) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      active: 'success',
      on_leave: 'warning',
      inactive: 'secondary',
      terminated: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Employee Details</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Employee Number</label>
                <p className="text-sm font-semibold">{employee.employee_number}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Status</label>
                <div className="mt-1">{getStatusBadge(employee.status)}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">First Name</label>
                <p className="text-sm">{employee.first_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Last Name</label>
                <p className="text-sm">{employee.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Email</label>
                <p className="text-sm">{employee.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Phone</label>
                <p className="text-sm">{employee.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Date of Birth</label>
                <p className="text-sm">
                  {employee.date_of_birth ? formatDate(employee.date_of_birth) : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Employment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Department</label>
                <p className="text-sm">{employee.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Position</label>
                <p className="text-sm">{employee.position}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Employment Type</label>
                <p className="text-sm capitalize">{employee.employment_type.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Hire Date</label>
                <p className="text-sm">{formatDate(employee.hire_date)}</p>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">System Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-500">Employee ID</label>
                <p className="text-xs font-mono">{employee.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">User ID</label>
                <p className="text-xs font-mono">{employee.user_id || 'Not linked'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Created At</label>
                <p className="text-sm">{formatDate(employee.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-500">Last Updated</label>
                <p className="text-sm">{formatDate(employee.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (onEdit) {
                onEdit(employee);
                onOpenChange(false);
              }
            }}>
              Edit Employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
