export const COLORS = {
  sidebar: {
    bg: '#1E0A3C',
    active: '#6B3FA0',
    hover: '#2D1B69',
  },
  primary: '#7C3AED',
  chartPrimary: '#6B3FA0',
  chartSecondary: '#C4B5D4',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F8F9FA',
} as const;

export const ROLES = ['CEO', 'Sales Manager', 'COO', 'Project Manager'] as const;
export type Role = typeof ROLES[number];

export const NAV_ITEMS = [
  { label: 'Sales Performance', href: '/dashboard', icon: 'TrendingUp' },
  { label: 'Funding Health', href: '/dashboard/funding-health', icon: 'DollarSign' },
  { label: 'Performance Benchmarks', href: '/dashboard/benchmarks', icon: 'BarChart3' },
  { label: 'Project Health', href: '/dashboard/project-health', icon: 'Activity' },
  { label: 'Customer Satisfaction', href: '/dashboard/customer-satisfaction', icon: 'Heart' },
] as const;

export const DEMO_USER = {
  name: 'John',
  email: 'john@evergreenclimate.com',
  role: 'Sales Manager' as const,
  company: 'EverGreen Climate',
};

export const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const MONTH_NAMES_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;
