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
import { useState, useEffect } from 'react';

// Define navigation items with role-based access
const navigationItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor', 'employee']
  },
  { 
    name: 'Employees', 
    href: '/employees', 
    icon: Users,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor']
  },
  { 
    name: 'Leave Management', 
    href: '/leave', 
    icon: Calendar,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee']
  },
  { 
    name: 'Attendance', 
    href: '/attendance', 
    icon: Clock,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor']
  },
  { 
    name: 'Payroll', 
    href: '/payroll', 
    icon: DollarSign,
    roles: ['super_admin', 'admin', 'hr_manager']
  },
  { 
    name: 'Performance', 
    href: '/performance', 
    icon: Target,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee']
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: FileText,
    roles: ['super_admin', 'admin', 'hr_manager', 'manager']
  },
  { 
    name: 'Departments', 
    href: '/departments', 
    icon: Settings,
    roles: ['super_admin']
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    roles: ['super_admin', 'admin']
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [navigation, setNavigation] = useState<typeof navigationItems>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user role on mount
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
            const role = (profile as any).role;
            setUserRole(role);
            // Filter navigation based on role
            const filteredNav = navigationItems.filter(item => 
              item.roles.includes(role)
            );
            setNavigation(filteredNav);
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

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
      <div className="flex h-16 flex-col items-center justify-center border-b border-zinc-800">
        <h1 className="text-xl font-bold">HRIS System</h1>
        {userRole && (
          <span className="text-xs text-zinc-400 capitalize">
            {userRole.replace('_', ' ')}
          </span>
        )}
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2 text-xs text-zinc-500">Loading menu...</p>
          </div>
        ) : (
          navigation.map((item) => {
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
          })
        )}
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

