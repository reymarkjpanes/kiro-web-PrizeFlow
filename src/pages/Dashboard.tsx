import { Prize } from '../types';

interface DashboardProps {
  prizes: Prize[];
}

function Dashboard({ prizes }: DashboardProps) {
  const totalPrizes = prizes.length;
  const claimedPrizes = prizes.filter((p) => p.claimed).length;
  const unclaimedPrizes = totalPrizes - claimedPrizes;

  const cards = [
    {
      label: 'Total Prizes',
      value: totalPrizes,
      color: 'bg-primary-50 border-primary-200 text-primary-700',
      iconColor: 'text-primary-500',
    },
    {
      label: 'Claimed Prizes',
      value: claimedPrizes,
      color: 'bg-green-50 border-green-200 text-green-700',
      iconColor: 'text-green-500',
    },
    {
      label: 'Unclaimed Prizes',
      value: unclaimedPrizes,
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`card border-2 ${card.color}`}
          >
            <p className="text-sm font-medium opacity-80">{card.label}</p>
            <p className="text-4xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      {totalPrizes === 0 && (
        <div className="mt-8 text-center py-12 card">
          <p className="text-gray-500 text-lg">No prizes yet.</p>
          <p className="text-gray-400 mt-2">
            Get started by adding recipients and prizes using the tabs above.
          </p>
        </div>
      )}

      {totalPrizes > 0 && (
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribution Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${totalPrizes > 0 ? (claimedPrizes / totalPrizes) * 100 : 0}%` }}
              role="progressbar"
              aria-valuenow={claimedPrizes}
              aria-valuemin={0}
              aria-valuemax={totalPrizes}
              aria-label={`${claimedPrizes} of ${totalPrizes} prizes claimed`}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {claimedPrizes} of {totalPrizes} prizes claimed ({totalPrizes > 0 ? Math.round((claimedPrizes / totalPrizes) * 100) : 0}%)
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
