import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Select, CurrencySelector } from '@/shared/components';
import { validatePrizeValue } from '@/shared/utils/financialCalc';
import type { Prize, SupportedCurrency, PrizeType, DistributionStatus } from '@/shared/types';

export interface PrizeFormData {
  name: string;
  description: string;
  prizeValue: number | null;
  currency: SupportedCurrency;
  prizeType: PrizeType;
  fundingSource: string | null;
  sponsor: string | null;
  budgetCategory: string | null;
  distributionStatus: DistributionStatus;
}

export interface PrizeFormProps {
  onSubmit: (data: PrizeFormData) => void;
  onCancel: () => void;
  initialData?: Partial<Prize>;
  isEditMode?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const DISTRIBUTION_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'distributed', label: 'Distributed' },
  { value: 'returned', label: 'Returned' },
];

const PRIZE_TYPE_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'physical', label: 'Physical' },
];

function PrizeForm({ onSubmit, onCancel, initialData, isEditMode = false, triggerRef }: PrizeFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [prizeValueInput, setPrizeValueInput] = useState(
    initialData?.prizeValue != null ? String(initialData.prizeValue) : ''
  );
  const [currency, setCurrency] = useState<SupportedCurrency>(initialData?.currency ?? 'USD');
  const [prizeType, setPrizeType] = useState<PrizeType>(initialData?.prizeType ?? 'physical');
  const [fundingSource, setFundingSource] = useState(initialData?.fundingSource ?? '');
  const [sponsor, setSponsor] = useState(initialData?.sponsor ?? '');
  const [budgetCategory, setBudgetCategory] = useState(initialData?.budgetCategory ?? '');
  const [distributionStatus, setDistributionStatus] = useState<DistributionStatus>(
    initialData?.distributionStatus ?? 'pending'
  );

  const [nameError, setNameError] = useState('');
  const [prizeValueError, setPrizeValueError] = useState('');
  const [showFinancial, setShowFinancial] = useState(
    // Auto-expand if editing and financial data exists
    isEditMode && (initialData?.prizeValue != null || initialData?.fundingSource != null || initialData?.sponsor != null)
  );

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus first input on mount
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Escape key closes form and restores focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        triggerRef?.current?.focus();
      }
    },
    [onCancel, triggerRef]
  );

  const handlePrizeValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrizeValueInput(value);

    // Validate on change
    const result = validatePrizeValue(value);
    setPrizeValueError(result.error ?? '');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedName = name.trim();
      if (!trimmedName) {
        setNameError('Name is required');
        return;
      }

      // Validate prize value before submission
      const validation = validatePrizeValue(prizeValueInput);
      if (!validation.valid) {
        setPrizeValueError(validation.error ?? 'Invalid prize value');
        return;
      }

      // Parse prize value
      let parsedPrizeValue: number | null = null;
      if (prizeValueInput.trim() !== '') {
        parsedPrizeValue = Number(prizeValueInput.trim());
      }

      const formData: PrizeFormData = {
        name: trimmedName,
        description: description.trim(),
        prizeValue: parsedPrizeValue,
        currency,
        prizeType,
        fundingSource: fundingSource.trim() || null,
        sponsor: sponsor.trim() || null,
        budgetCategory: budgetCategory.trim() || null,
        distributionStatus: isEditMode ? distributionStatus : 'pending',
      };

      onSubmit(formData);
    },
    [name, description, prizeValueInput, currency, prizeType, fundingSource, sponsor, budgetCategory, distributionStatus, isEditMode, onSubmit]
  );

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (e.target.value.trim()) {
      setNameError('');
    }
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="animate-slide-down space-y-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
      aria-label={isEditMode ? 'Edit prize' : 'Add prize'}
    >
      <Input
        ref={nameInputRef}
        label="Name"
        required
        value={name}
        onChange={handleNameChange}
        error={nameError}
        placeholder="Prize name"
      />
      <Input
        label="Description"
        value={description}
        onChange={handleDescriptionChange}
        placeholder="Prize description (optional)"
      />

      {/* Financial Details Section */}
      <div className="border-t border-neutral-200 pt-4">
        <button
          type="button"
          className="flex items-center gap-2 text-body-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          onClick={() => setShowFinancial(!showFinancial)}
          aria-expanded={showFinancial}
          aria-controls="financial-details-section"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-150 ${showFinancial ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Financial Details
        </button>

        {showFinancial && (
          <div id="financial-details-section" className="mt-3 space-y-4">
            {/* Prize Value and Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Prize Value"
                type="text"
                inputMode="decimal"
                value={prizeValueInput}
                onChange={handlePrizeValueChange}
                error={prizeValueError}
                placeholder="e.g., 100.00"
                aria-describedby={prizeValueError ? undefined : 'prize-value-hint'}
              />
              <CurrencySelector
                value={currency}
                onChange={setCurrency}
              />
            </div>
            {!prizeValueError && (
              <p id="prize-value-hint" className="text-xs text-neutral-500 -mt-2">
                Acceptable range: 0.01 - 999,999,999.99 (leave empty if not applicable)
              </p>
            )}

            {/* Prize Type */}
            <Select
              label="Prize Type"
              value={prizeType}
              onChange={(val) => setPrizeType(val as PrizeType)}
              options={PRIZE_TYPE_OPTIONS}
            />

            {/* Funding Source */}
            <Input
              label="Funding Source"
              value={fundingSource}
              onChange={(e) => setFundingSource(e.target.value)}
              placeholder="Funding source (optional)"
              maxLength={100}
            />

            {/* Sponsor */}
            <Input
              label="Sponsor"
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              placeholder="Sponsor (optional)"
              maxLength={100}
            />

            {/* Budget Category */}
            <Input
              label="Budget Category"
              value={budgetCategory}
              onChange={(e) => setBudgetCategory(e.target.value)}
              placeholder="Budget category (optional)"
              maxLength={50}
            />

            {/* Distribution Status - only in edit mode */}
            {isEditMode && (
              <Select
                label="Distribution Status"
                value={distributionStatus}
                onChange={(val) => setDistributionStatus(val as DistributionStatus)}
                options={DISTRIBUTION_STATUS_OPTIONS}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" variant="primary" size="small">
          {isEditMode ? 'Save Changes' : 'Add Prize'}
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export { PrizeForm };
