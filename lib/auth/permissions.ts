// Role-based permissions configuration
export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'manager' | 'supervisor' | 'employee';

export interface RoutePermission {
  path: string;
  allowedRoles: UserRole[];
}

// Define which roles can access which routes
export const routePermissions: RoutePermission[] = [
  {
    path: '/dashboard',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor', 'employee']
  },
  {
    path: '/employees',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor']
  },
  {
    path: '/leave',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee']
  },
  {
    path: '/attendance',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor']
  },
  {
    path: '/payroll',
    allowedRoles: ['super_admin', 'admin', 'hr_manager']
  },
  {
    path: '/performance',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'employee']
  },
  {
    path: '/reports',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager']
  },
  {
    path: '/settings',
    allowedRoles: ['super_admin', 'admin']
  },
  {
    path: '/departments',
    allowedRoles: ['super_admin', 'admin', 'hr_manager', 'manager', 'supervisor', 'employee']
  },
];

// Check if a user's role has access to a specific path
export function hasAccess(userRole: UserRole | null, path: string): boolean {
  if (!userRole) return false;

  // Find the route permission
  const permission = routePermissions.find(p => path.startsWith(p.path));
  
  // If no specific permission found, deny access
  if (!permission) return false;

  // Check if user's role is in the allowed roles
  return permission.allowedRoles.includes(userRole);
}

// Get default redirect based on role
export function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/dashboard';
    case 'hr_manager':
      return '/employees';
    case 'manager':
      return '/dashboard';
    case 'supervisor':
      return '/dashboard';
    case 'employee':
      return '/leave';
    default:
      return '/dashboard';
  }
}

