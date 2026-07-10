import { useState } from 'react';
import { Recipient, Prize } from '../types';
import { generateId } from '../utils/storage';
import ConfirmDialog from '../components/ConfirmDialog';

interface RecipientsProps {
  recipients: Recipient[];
  prizes: Prize[];
  updateRecipients: (recipients: Recipient[]) => void;
  updatePrizes: (prizes: Prize[]) => void;
}

function Recipients({ recipients, prizes, updateRecipients, updatePrizes }: RecipientsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Recipient | null>(null);

  const filteredRecipients = recipients.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormName('');
    setFormContact('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingId) {
      const updated = recipients.map((r) =>
        r.id === editingId ? { ...r, name: formName.trim(), contact: formContact.trim() } : r
      );
      updateRecipients(updated);
    } else {
      const newRecipient: Recipient = {
        id: generateId(),
        name: formName.trim(),
        contact: formContact.trim(),
      };
      updateRecipients([...recipients, newRecipient]);
    }
    resetForm();
  };

  const handleEdit = (recipient: Recipient) => {
    setEditingId(recipient.id);
    setFormName(recipient.name);
    setFormContact(recipient.contact);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    // Remove recipient
    const updatedRecipients = recipients.filter((r) => r.id !== deleteTarget.id);
    updateRecipients(updatedRecipients);
    // Remove prize assignments for this recipient
    const updatedPrizes = prizes.map((p) =>
      p.recipientId === deleteTarget.id
        ? { ...p, recipientId: null, claimed: false, claimDate: null }
        : p
    );
    updatePrizes(updatedPrizes);
    setDeleteTarget(null);
  };

  return (
    <div id="panel-recipients" role="tabpanel" aria-labelledby="tab-recipients">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Recipients</h2>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add Recipient
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label htmlFor="recipient-search" className="sr-only">
          Search recipients
        </label>
        <input
          id="recipient-search"
          type="text"
          className="input max-w-md"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search recipients by name"
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingId ? 'Edit Recipient' : 'Add New Recipient'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="recipient-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="recipient-name"
                type="text"
                className="input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter recipient name"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="recipient-contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information
              </label>
              <input
                id="recipient-contact"
                type="text"
                className="input"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="Email, phone, or other contact info (optional)"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add'} Recipient
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recipients List */}
      {filteredRecipients.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-500">
            {searchQuery
              ? 'No recipients match your search.'
              : 'No recipients added yet. Click "Add Recipient" to get started.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border border-gray-200 shadow-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Contact</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Prizes</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecipients.map((recipient) => {
                const assignedPrizes = prizes.filter((p) => p.recipientId === recipient.id);
                return (
                  <tr key={recipient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{recipient.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{recipient.contact || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{assignedPrizes.length}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="btn-secondary text-xs px-3 py-1"
                          onClick={() => handleEdit(recipient)}
                          aria-label={`Edit ${recipient.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-danger text-xs px-3 py-1"
                          onClick={() => setDeleteTarget(recipient)}
                          aria-label={`Delete ${recipient.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Recipient"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove any prize assignments for this recipient.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

export default Recipients;
