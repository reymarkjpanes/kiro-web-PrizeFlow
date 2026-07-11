import { Card } from '@/shared/components';

export interface DashboardCardProps {
  label: string;
  value: number | string;
  variant?: 'default' | 'success' | 'warning';
  size?: 'default' | 'large';
}

const variantBorderClasses: Record<NonNullable<DashboardCardProps['variant']>, string> = {
  default: 'border-l-4 border-l-primary-500',
  success: 'border-l-4 border-l-success-500',
  warning: 'border-l-4 border-l-warning-500',
};

const sizeClasses = {
  default: {
    card: 'p-4',
    value: 'text-display text-neutral-900',
    label: 'text-body-sm text-neutral-500',
    gap: 'gap-1',
  },
  large: {
    card: 'p-6',
    value: 'text-display text-neutral-900 text-4xl',
    label: 'text-body text-neutral-600',
    gap: 'gap-2',
  },
};

function DashboardCard({ label, value, variant = 'default', size = 'default' }: DashboardCardProps) {
  const classes = sizeClasses[size] || sizeClasses.default;

  return (
    <Card className={`${variantBorderClasses[variant]} ${classes.card}`}>
      <div className={`flex flex-col ${classes.gap}`}>
        <span
          aria-live="polite"
          className={classes.value}
        >
          {value}
        </span>
        <span className={classes.label}>
          {label}
        </span>
      </div>
    </Card>
  );
}

export { DashboardCard };
