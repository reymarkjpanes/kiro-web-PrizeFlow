import { useState } from 'react';
import { Prize, Recipient } from '../types';
import { generateId } from '../utils/storage';
import ConfirmDialog from '../components/ConfirmDialog';

interface PrizesProps {
  prizes: Prize[];
  recipients: Recipient[];
  updatePrizes: (prizes: Prize[]) => void;
}

function Prizes({ prizes, recipients, updatePrizes }: PrizesProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formRecipientId, setFormRecipientId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<Prize | null>(null);

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormRecipientId('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingId) {
      const updated = prizes.map((p) =>
        p.id === editingId
          ? {
              ...p,
              name: formName.trim(),
              description: formDescription.trim(),
              recipientId: formRecipientId || null,
            }
          : p
      );
      updatePrizes(updated);
    } else {
      const newPrize: Prize = {
        id: generateId(),
        name: formName.trim(),
        description: formDescription.trim(),
        recipientId: formRecipientId || null,
        claimed: false,
        claimDate: null,
      };
      updatePrizes([...prizes, newPrize]);
    }
    resetForm();
  };

  const handleEdit = (prize: Prize) => {
    setEditingId(prize.id);
    setFormName(prize.name);
    setFormDescription(prize.description);
    setFormRecipientId(prize.recipientId || '');
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    updatePrizes(prizes.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleToggleClaim = (prize: Prize) => {
    const updated = prizes.map((p) => {
      if (p.id !== prize.id) return p;
      if (p.claimed) {
        return { ...p, claimed: false, claimDate: null };
      } else {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        return { ...p, claimed: true, claimDate: today };
      }
    });
    updatePrizes(updated);
  };

  const handleAssign = (prizeId: string, recipientId: string) => {
    const updated = prizes.map((p) =>
      p.id === prizeId ? { ...p, recipientId: recipientId || null } : p
    );
    updatePrizes(updated);
  };

  return (
    <div id="panel-prizes" role="tabpanel" aria-labelledby="tab-prizes">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Prizes</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Prize
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Prize' : 'Add New Prize'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="prize-name" className="block text-sm font-medium text-gray-700 mb-1">
                Prize Name <span className="text-red-500">*</span>
              </label>
              <input
                id="prize-name"
                type="text"
                className="input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter prize name"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="prize-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                id="prize-description"
                type="text"
                className="input"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter prize description (optional)"
              />
            </div>
            <div>
              <label htmlFor="prize-recipient" className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Recipient
              </label>
              <select
                id="prize-recipient"
                className="input"
                value={formRecipientId}
                onChange={(e) => setFormRecipientId(e.target.value)}
              >
                <option value="">— Unassigned —</option>
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Prize
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prizes List */}
      {prizes.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">No prizes added yet. Click "Add Prize" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Prize</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Recipient</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Claim Date</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prizes.map((prize) => (
                <tr key={prize.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{prize.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{prize.description || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <select
                      className="input text-xs py-1 px-2 w-36"
                      value={prize.recipientId || ''}
                      onChange={(e) => handleAssign(prize.id, e.target.value)}
                      aria-label={`Assign recipient for ${prize.name}`}
                    >
                      <option value="">— Unassigned —</option>
                      {recipients.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        prize.claimed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {prize.claimed ? 'Claimed' : 'Unclaimed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {prize.claimDate || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <button
                        className={prize.claimed ? 'btn-secondary text-xs px-3 py-1' : 'btn-success text-xs px-3 py-1'}
                        onClick={() => handleToggleClaim(prize)}
                        aria-label={prize.claimed ? `Mark ${prize.name} as unclaimed` : `Mark ${prize.name} as claimed`}
                      >
                        {prize.claimed ? 'Unclaim' : 'Claim'}
                      </button>
                      <button
                        className="btn-secondary text-xs px-3 py-1"
                        onClick={() => handleEdit(prize)}
                        aria-label={`Edit ${prize.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger text-xs px-3 py-1"
                        onClick={() => setDeleteTarget(prize)}
                        aria-label={`Delete ${prize.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Prize"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Prizes;
