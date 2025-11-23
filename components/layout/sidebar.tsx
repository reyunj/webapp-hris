'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Target,
  FileText,
  Settings,
  LogOut,
  Clock,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Leave Management', href: '/leave', icon: Calendar },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Payroll', href: '/payroll', icon: DollarSign },
  { name: 'Performance', href: '/performance', icon: Target },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-zinc-900 text-zinc-50">
      <div className="flex h-16 items-center justify-center border-b border-zinc-800">
        <h1 className="text-xl font-bold">HRIS System</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <button 
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
