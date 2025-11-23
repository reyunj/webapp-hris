# HRIS System - Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and create

#### Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click **Run**
4. Wait for all tables, indexes, and policies to be created

#### Enable Authentication
1. Go to **Authentication > Providers**
2. Enable **Email** provider
3. (Optional) Enable **Google** and **Microsoft** OAuth

### 3. Configure Environment Variables

Copy the example file:
```bash
cp env.example .env.local
```

Get your Supabase credentials:
1. In Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon public** key
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Generate TypeScript Types (Recommended)

This will eliminate all TypeScript errors:

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Generate types from your database
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

Replace `YOUR_PROJECT_ID` with your actual project ID (found in Supabase dashboard under Settings > General).

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Initial Setup Checklist

- [ ] Dependencies installed
- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Authentication providers enabled
- [ ] Environment variables configured
- [ ] TypeScript types generated (optional but recommended)
- [ ] Development server running

## 🎯 First Steps After Setup

### Create Your First User

1. Go to `http://localhost:3000/login`
2. Click "Sign in with Google" (if enabled) or use email/password
3. After signup, go to Supabase dashboard > **Authentication > Users**
4. Find your user and note the UUID

### Set User Role

In Supabase SQL Editor, run:

```sql
-- Make yourself an admin
INSERT INTO profiles (id, email, role)
VALUES ('your-user-uuid', 'your-email@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### Create Sample Data (Optional)

```sql
-- Create a sample employee
INSERT INTO employees (
  user_id, employee_number, first_name, last_name, 
  email, hire_date, department, position, status
) VALUES (
  'your-user-uuid',
  'EMP001',
  'John',
  'Doe',
  'john.doe@company.com',
  '2024-01-15',
  'Engineering',
  'Software Engineer',
  'active'
);

-- Create leave balance
INSERT INTO leave_balances (
  employee_id, leave_type, total_days, remaining_days, year
) VALUES (
  (SELECT id FROM employees WHERE employee_number = 'EMP001'),
  'vacation',
  20,
  20,
  2024
);
```

## 🔧 Troubleshooting

### TypeScript Errors

**Issue**: Seeing type errors in API routes  
**Solution**: Generate types from Supabase (see step 4 above)

**Temporary Workaround**: The `@ts-ignore` comments will suppress errors. Code will still work.

### Authentication Not Working

**Issue**: Can't sign in  
**Solution**: 
- Check `.env.local` has correct Supabase credentials
- Verify authentication providers are enabled in Supabase
- Check browser console for errors

### Database Connection Issues

**Issue**: API routes returning errors  
**Solution**:
- Verify Supabase project is active
- Check environment variables are loaded (restart dev server)
- Verify RLS policies are created (run schema.sql again)

### Build Errors

**Issue**: `npm run build` fails  
**Solution**:
- Run `npm run lint` to check for issues
- Ensure all environment variables are set
- Check that types are generated or `@ts-ignore` comments are present

## 📚 Next Steps

1. **Explore the Dashboard**: Visit `/dashboard` to see the overview
2. **Manage Employees**: Go to `/employees` to add/edit employee records
3. **Configure Leave Types**: Set up leave balances for employees
4. **Test Workflows**: Submit and approve leave requests
5. **Customize**: Modify components in `components/` directory

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) policies (already configured)
- Regularly update dependencies: `npm update`
- Enable MFA for admin accounts in production

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Need Help?

- Check `TYPESCRIPT_NOTES.md` for type-related issues
- Review `README.md` for detailed project documentation
- Open an issue on GitHub for bugs or questions
