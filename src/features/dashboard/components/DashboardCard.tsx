import { Card } from '@/shared/components';

export interface DashboardCardProps {
  label: string;
  value: number;
  variant?: 'default' | 'success' | 'warning';
}

const variantBorderClasses: Record<NonNullable<DashboardCardProps['variant']>, string> = {
  default: 'border-l-4 border-l-primary-500',
  success: 'border-l-4 border-l-success-500',
  warning: 'border-l-4 border-l-warning-500',
};

function DashboardCard({ label, value, variant = 'default' }: DashboardCardProps) {
  return (
    <Card className={variantBorderClasses[variant]}>
      <div className="flex flex-col gap-1">
        <span
          aria-live="polite"
          className="text-display text-neutral-900"
        >
          {value}
        </span>
        <span className="text-body-sm text-neutral-500">
          {label}
        </span>
      </div>
    </Card>
  );
}

export { DashboardCard };
