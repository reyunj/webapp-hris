import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Calendar, DollarSign, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Comprehensive employee directory with profiles, documents, and organizational hierarchy.',
    },
    {
      icon: Calendar,
      title: 'Leave & Attendance',
      description: 'Track time off, manage leave requests, and monitor employee attendance seamlessly.',
    },
    {
      icon: DollarSign,
      title: 'Payroll Processing',
      description: 'Automated payroll calculations, tax management, and digital payslip generation.',
    },
    {
      icon: Target,
      title: 'Performance Reviews',
      description: 'Set goals, track OKRs, conduct 360° reviews, and measure employee performance.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 ">
      <header className="border-b border-zinc-200 bg-white  ">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">HRIS System</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern HR Management
            <br />
            <span className="text-zinc-600 ">Made Simple</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 ">
            Streamline your HR operations with our comprehensive HRIS platform. Manage employees,
            process payroll, track performance, and more—all in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white py-24  ">
          <div className="container mx-auto px-4">
            <h3 className="mb-12 text-center text-3xl font-bold">Key Features</h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 ">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
                  <p className="text-sm text-zinc-600 ">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white py-8  ">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-600 ">
          © {new Date().getFullYear()} HRIS System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

