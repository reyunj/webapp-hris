# HRIS System - Human Resource Information System

A modern, comprehensive HRIS platform built with Next.js, TypeScript, Supabase, and Tailwind CSS. This system provides complete HR management capabilities including employee management, payroll processing, leave tracking, performance reviews, and more.

## Features

### Core Modules
- **Employee Management** - Complete employee directory with profiles, documents, and organizational hierarchy
- **Leave & Attendance** - Track time off, manage leave requests, and monitor attendance
- **Payroll Processing** - Automated payroll calculations, tax management, and digital payslips
- **Performance Management** - Goal setting, OKRs, 360° reviews, and performance tracking
- **Analytics & Reporting** - Real-time dashboards and custom report generation
- **Audit Logging** - Complete audit trail for compliance and security

### Technical Features
- **Authentication** - Supabase Auth with OAuth2 support (Google, Microsoft)
- **Role-Based Access Control (RBAC)** - Admin, HR Manager, Manager, and Employee roles
- **Real-time Updates** - Live data synchronization using Supabase real-time
- **Progressive Web App (PWA)** - Mobile-first design with offline support
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Type Safety** - Full TypeScript implementation with strict typing
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS v4

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with Lucide icons
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Testing**: Jest, Cypress

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webapp-hris
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Run the database schema:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase/schema.sql`
   - Execute the SQL to create all tables, indexes, and RLS policies
   
   c. Enable authentication providers:
   - Go to Authentication > Providers
   - Enable Email and any OAuth providers you want (Google, Microsoft, etc.)

4. **Configure environment variables**
   
   Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Generate TypeScript types from Supabase** (Optional but recommended)
   ```bash
   npx supabase gen types typescript --project-id your-project-id > types/database.ts
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
webapp-hris/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── employees/        # Employee management endpoints
│   │   └── leave/            # Leave management endpoints
│   ├── dashboard/            # Dashboard page
│   ├── employees/            # Employee management pages
│   ├── leave/                # Leave management pages
│   ├── payroll/              # Payroll pages
│   ├── performance/          # Performance management pages
│   ├── login/                # Authentication pages
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   └── layout/               # Layout components
├── lib/                      # Utility functions and configurations
│   ├── supabase/             # Supabase client configurations
│   └── utils.ts              # Helper functions
├── types/                    # TypeScript type definitions
│   └── database.ts           # Supabase database types
├── supabase/                 # Supabase configurations
│   └── schema.sql            # Database schema
└── public/                   # Static assets
```

## Database Schema

The system uses the following main tables:

- `profiles` - User profiles with role information
- `employees` - Employee records and details
- `leave_requests` - Leave request tracking
- `leave_balances` - Employee leave balances
- `attendance` - Daily attendance records
- `payroll` - Payroll processing records
- `performance_reviews` - Performance review data
- `goals` - Employee goals and OKRs
- `audit_logs` - System audit trail

See `supabase/schema.sql` for complete schema details.

## Authentication & Authorization

The system implements role-based access control with four roles:

- **Admin** - Full system access
- **HR Manager** - Manage employees, payroll, and reviews
- **Manager** - Manage team members and approve requests
- **Employee** - View own data and submit requests

Row-level security (RLS) policies ensure users can only access authorized data.

## Development

### Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```

### Linting

```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## Security Considerations

- All sensitive data is encrypted in transit (SSL/TLS)
- Row-level security (RLS) enforces data access policies
- Audit logging tracks all critical operations
- Environment variables protect API keys and secrets
- GDPR-compliant with data export and deletion capabilities

## Performance Optimization

- Server-side rendering (SSR) for initial page loads
- Static generation for public pages
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Caching strategies for frequently accessed data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.
