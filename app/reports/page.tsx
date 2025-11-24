'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const reports = [
    {
      id: 1,
      title: 'Employee Directory Report',
      description: 'Complete list of all employees with contact information',
      icon: Users,
      category: 'HR',
    },
    {
      id: 2,
      title: 'Payroll Summary Report',
      description: 'Monthly payroll breakdown by department and position',
      icon: DollarSign,
      category: 'Finance',
    },
    {
      id: 3,
      title: 'Leave Balance Report',
      description: 'Employee leave balances and utilization statistics',
      icon: Calendar,
      category: 'HR',
    },
    {
      id: 4,
      title: 'Performance Analytics',
      description: 'Performance review scores and trends over time',
      icon: TrendingUp,
      category: 'Performance',
    },
    {
      id: 5,
      title: 'Attendance Report',
      description: 'Daily, weekly, and monthly attendance statistics',
      icon: FileText,
      category: 'Operations',
    },
    {
      id: 6,
      title: 'Headcount Report',
      description: 'Employee count by department, position, and status',
      icon: Users,
      category: 'HR',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-zinc-500">
              Generate and download various HR reports
            </p>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-zinc-100 p-2">
                      <report.icon className="h-5 w-5 text-zinc-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.title}</CardTitle>
                      <span className="text-xs text-zinc-500">{report.category}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {report.description}
                </CardDescription>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Builder</CardTitle>
            <CardDescription>
              Create custom reports with specific data fields and filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Build Custom Report
            </Button>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder page. Report generation functionality 
            will be implemented to export data in PDF, Excel, and CSV formats.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
