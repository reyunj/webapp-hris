'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Download, Filter, Search } from 'lucide-react';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Placeholder data - will be replaced with real data from API
  const attendanceRecords = [
    {
      id: '1',
      employeeName: 'John Doe',
      department: 'Engineering',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'present',
      workHours: '9.0',
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      department: 'HR',
      checkIn: '08:45 AM',
      checkOut: '05:30 PM',
      status: 'present',
      workHours: '8.75',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      department: 'Sales',
      checkIn: '-',
      checkOut: '-',
      status: 'absent',
      workHours: '0',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'success' | 'secondary' | 'warning'; label: string }> = {
      present: { variant: 'success', label: 'Present' },
      absent: { variant: 'secondary', label: 'Absent' },
      late: { variant: 'warning', label: 'Late' },
    };
    const config = variants[status] || variants.absent;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-zinc-500">
              Track employee attendance and working hours
            </p>
          </div>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Total Employees</p>
                <p className="text-2xl font-bold">150</p>
              </div>
              <Clock className="h-8 w-8 text-zinc-400" />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Present Today</p>
                <p className="text-2xl font-bold text-green-600">142</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Absent Today</p>
                <p className="text-2xl font-bold text-red-600">5</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 font-bold">✕</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">On Leave</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search employees..."
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Attendance Table */}
        <div className="rounded-lg border border-zinc-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Work Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>{record.workHours} hrs</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Note */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder page with sample data. 
            Attendance tracking will be integrated with your time clock system or biometric devices.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
