'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Building, Users, Bell, Shield, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-zinc-500">
            Manage your HRIS system configuration
          </p>
        </div>

        <div className="grid gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                <CardTitle>Company Information</CardTitle>
              </div>
              <CardDescription>
                Update your company details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" placeholder="Your Company Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input id="companyEmail" type="email" placeholder="info@company.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Address</Label>
                <Input id="companyAddress" placeholder="123 Business St, City, Country" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>User Management</CardTitle>
              </div>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 mb-4">
                Configure role-based access control and user permissions for the system.
              </p>
              <Button variant="outline">Manage Roles & Permissions</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>
                Configure email and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 mb-4">
                Set up notification preferences for leave requests, payroll, and system alerts.
              </p>
              <Button variant="outline">Configure Notifications</Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>
                Manage authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 mb-4">
                Configure password policies, two-factor authentication, and session management.
              </p>
              <Button variant="outline">Security Settings</Button>
            </CardContent>
          </Card>

          {/* System Configuration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <CardTitle>System Configuration</CardTitle>
              </div>
              <CardDescription>
                Advanced system settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 mb-4">
                Configure database connections, API integrations, and system preferences.
              </p>
              <Button variant="outline">System Settings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Note */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a placeholder settings page. 
            Full configuration functionality will be implemented based on your requirements.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
