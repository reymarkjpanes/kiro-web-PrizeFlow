import { Card } from '@/shared/components';

export interface ClaimProgressBarProps {
  claimed: number;
  unclaimed: number;
  claimRate: number;
}

function ClaimProgressBar({ claimed, unclaimed, claimRate }: ClaimProgressBarProps) {
  return (
    <Card className="p-5">
      <div className="space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-body font-medium text-neutral-700">Claim Progress</span>
          <span className="text-h3 font-semibold text-primary-700">
            {Math.round(claimRate)}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(claimRate)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Prize claim completion"
        >
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-slow"
            style={{ width: `${claimRate}%` }}
          />
        </div>

        {/* Contextual counts */}
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-success-700 font-medium">{claimed} claimed</span>
          <span className="text-warning-700 font-medium">{unclaimed} unclaimed</span>
        </div>
      </div>
    </Card>
  );
}

export { ClaimProgressBar };
