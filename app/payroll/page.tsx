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
import { DollarSign, Download, FileText } from 'lucide-react';

export default function PayrollPage() {
  const payrollSummary = [
    { title: 'Total Payroll', value: '$0', change: '+0%' },
    { title: 'Employees Paid', value: '0', change: '0%' },
    { title: 'Avg Salary', value: '$0', change: '+0%' },
    { title: 'Total Deductions', value: '$0', change: '+0%' },
  ];

  const payrollRecords: Array<{
    id: string;
    employee: string;
    period: string;
    baseSalary: number;
    bonuses: number;
    deductions: number;
    tax: number;
    netSalary: number;
    status: string;
  }> = [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      paid: 'success',
      processed: 'warning',
      draft: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Manage employee compensation and payroll processing
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {payrollSummary.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Payroll Records</h2>
          </div>
          {payrollRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Base Salary</TableHead>
                  <TableHead className="text-right">Bonuses</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employee}</TableCell>
                    <TableCell>{record.period}</TableCell>
                    <TableCell className="text-right">${record.baseSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${record.bonuses.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${record.deductions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${record.tax.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold">${record.netSalary.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <DollarSign className="h-16 w-16 text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payroll records</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                Payroll records will appear here after processing
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
