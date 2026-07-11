import { useState, useCallback, useRef, type KeyboardEvent } from 'react';
import { Button } from './Button';

export interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onBulkImport: (text: string) => void;
  placeholder?: string;
}

function TagInput({ label, tags, onAdd, onRemove, onBulkImport, placeholder = 'Add member' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim();
      if (value) {
        onAdd(value);
        setInputValue('');
      }
    }
  }, [inputValue, onAdd]);

  const handleBulkSubmit = useCallback(() => {
    if (bulkText.trim()) {
      onBulkImport(bulkText);
      setBulkText('');
      setShowBulkImport(false);
    }
  }, [bulkText, onBulkImport]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-body-sm font-medium text-neutral-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowBulkImport(!showBulkImport)}
          className="text-caption text-primary-600 hover:text-primary-700 font-medium transition-colors duration-fast"
          aria-label={showBulkImport ? 'Hide bulk import' : 'Bulk import members'}
        >
          {showBulkImport ? 'Cancel' : 'Bulk Import'}
        </button>
      </div>

      {showBulkImport ? (
        <div className="space-y-2">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Paste names separated by commas or newlines..."
            className="block w-full rounded-md border border-neutral-300 px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 min-h-[80px] resize-y"
            aria-label="Bulk member import textarea"
          />
          <Button type="button" variant="secondary" size="small" onClick={handleBulkSubmit}>
            Import Members
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-body-sm text-neutral-900 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500"
              aria-label={`Add ${label.toLowerCase()}`}
            />
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => {
                const value = inputValue.trim();
                if (value) { onAdd(value); setInputValue(''); }
                inputRef.current?.focus();
              }}
              aria-label="Add member"
            >
              Add
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="list" aria-label={`${label} list`}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  role="listitem"
                  className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-caption text-neutral-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="ml-0.5 text-neutral-400 hover:text-neutral-600 transition-colors duration-fast rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </>
      )}

      {tags.length > 0 && (
        <p className="text-caption text-neutral-400">{tags.length} member{tags.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
}

export { TagInput };
