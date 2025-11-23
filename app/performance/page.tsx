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
import { Plus, Target, TrendingUp } from 'lucide-react';

export default function PerformancePage() {
  const performanceStats = [
    { title: 'Avg Rating', value: '0/5', change: '+0' },
    { title: 'Reviews Completed', value: '0', change: '0%' },
    { title: 'Goals Achieved', value: '0%', change: '+0%' },
    { title: 'Pending Reviews', value: '0', change: '0' },
  ];

  const reviews: Array<{
    id: string;
    employee: string;
    reviewer: string;
    period: string;
    rating: number;
    goalsAchieved: number;
    status: string;
  }> = [];

  const goals: Array<{
    id: string;
    title: string;
    employee: string;
    category: string;
    progress: number;
    deadline: string;
    status: string;
  }> = [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'secondary'> = {
      completed: 'success',
      in_progress: 'warning',
      draft: 'secondary',
      not_started: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>;
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Track employee performance, reviews, and goals
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Review
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performanceStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-zinc-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">
                  {stat.change} from last quarter
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="p-6">
              <h2 className="text-lg font-semibold">Performance Reviews</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.employee}</TableCell>
                    <TableCell>{review.period}</TableCell>
                    <TableCell>
                      {review.rating > 0 ? (
                        <span className="text-yellow-500">
                          {getRatingStars(review.rating)}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {review.goalsAchieved > 0 ? `${review.goalsAchieved}%` : '-'}
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between p-6">
              <h2 className="text-lg font-semibold">Goals & OKRs</h2>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
            <div className="space-y-4 p-6 pt-0">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{goal.title}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {goal.employee} • {goal.category}
                      </p>
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-50"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-zinc-500">
                    <Target className="mr-1 h-3 w-3" />
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
