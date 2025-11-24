export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'hr_manager' | 'manager' | 'employee'
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'hr_manager' | 'manager' | 'employee'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'hr_manager' | 'manager' | 'employee'
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          user_id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          date_of_birth: string | null
          hire_date: string
          department: string
          position: string
          manager_id: string | null
          employment_type: 'full_time' | 'part_time' | 'contract' | 'intern'
          status: 'active' | 'inactive' | 'on_leave' | 'terminated'
          address: Json | null
          emergency_contact: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          employee_number: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          date_of_birth?: string | null
          hire_date: string
          department: string
          position: string
          manager_id?: string | null
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated'
          address?: Json | null
          emergency_contact?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          employee_number?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          date_of_birth?: string | null
          hire_date?: string
          department?: string
          position?: string
          manager_id?: string | null
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated'
          address?: Json | null
          emergency_contact?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      leave_requests: {
        Row: {
          id: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          start_date: string
          end_date: string
          days_requested: number
          reason: string | null
          status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by: string | null
          approved_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          start_date: string
          end_date: string
          days_requested: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          leave_type?: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          start_date?: string
          end_date?: string
          days_requested?: number
          reason?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          approved_by?: string | null
          approved_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leave_balances: {
        Row: {
          id: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          total_days: number
          used_days: number
          remaining_days: number
          year: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          total_days: number
          used_days?: number
          remaining_days: number
          year: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          leave_type?: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid'
          total_days?: number
          used_days?: number
          remaining_days?: number
          year?: number
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          employee_id: string
          date: string
          clock_in: string | null
          clock_out: string | null
          break_duration: number | null
          total_hours: number | null
          status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          date: string
          clock_in?: string | null
          clock_out?: string | null
          break_duration?: number | null
          total_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          date?: string
          clock_in?: string | null
          clock_out?: string | null
          break_duration?: number | null
          total_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payroll: {
        Row: {
          id: string
          employee_id: string
          period_start: string
          period_end: string
          base_salary: number
          bonuses: number
          deductions: number
          tax: number
          net_salary: number
          status: 'draft' | 'processed' | 'paid'
          payment_date: string | null
          payment_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          period_start: string
          period_end: string
          base_salary: number
          bonuses?: number
          deductions?: number
          tax: number
          net_salary: number
          status?: 'draft' | 'processed' | 'paid'
          payment_date?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          period_start?: string
          period_end?: string
          base_salary?: number
          bonuses?: number
          deductions?: number
          tax?: number
          net_salary?: number
          status?: 'draft' | 'processed' | 'paid'
          payment_date?: string | null
          payment_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      performance_reviews: {
        Row: {
          id: string
          employee_id: string
          reviewer_id: string
          review_period_start: string
          review_period_end: string
          overall_rating: number
          goals_achievement: number | null
          competencies: Json | null
          strengths: string | null
          areas_for_improvement: string | null
          comments: string | null
          status: 'draft' | 'submitted' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          reviewer_id: string
          review_period_start: string
          review_period_end: string
          overall_rating: number
          goals_achievement?: number | null
          competencies?: Json | null
          strengths?: string | null
          areas_for_improvement?: string | null
          comments?: string | null
          status?: 'draft' | 'submitted' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          reviewer_id?: string
          review_period_start?: string
          review_period_end?: string
          overall_rating?: number
          goals_achievement?: number | null
          competencies?: Json | null
          strengths?: string | null
          areas_for_improvement?: string | null
          comments?: string | null
          status?: 'draft' | 'submitted' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          employee_id: string
          title: string
          description: string | null
          category: 'okr' | 'kpi' | 'personal' | 'team'
          target_value: number | null
          current_value: number | null
          unit: string | null
          start_date: string
          end_date: string
          status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          title: string
          description?: string | null
          category?: 'okr' | 'kpi' | 'personal' | 'team'
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          start_date: string
          end_date: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          title?: string
          description?: string | null
          category?: 'okr' | 'kpi' | 'personal' | 'team'
          target_value?: number | null
          current_value?: number | null
          unit?: string | null
          start_date?: string
          end_date?: string
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          changes: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          changes?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never;
    };
    Functions: {
      update_leave_balance: {
        Args: {
          p_employee_id: string;
          p_leave_type: string;
          p_days: number;
          p_year: number;
        };
        Returns: void;
      };
    };
    Enums: {
      user_role: 'admin' | 'hr_manager' | 'manager' | 'employee';
      employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
      employee_status: 'active' | 'inactive' | 'on_leave' | 'terminated';
      leave_type: 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'unpaid';
      request_status: 'pending' | 'approved' | 'rejected' | 'cancelled';
      attendance_status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
      payroll_status: 'draft' | 'processed' | 'paid';
      review_status: 'draft' | 'submitted' | 'completed';
      goal_category: 'okr' | 'kpi' | 'personal' | 'team';
      goal_status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
    };
  };
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

