import React, { useEffect, useRef } from 'react';
import { useFocusTrap } from '@/shared/hooks';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

function Dialog({ open, onClose, title, children, triggerRef }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useFocusTrap(dialogRef, open);

  // Escape key dismissal
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus restoration on close
  useEffect(() => {
    if (!open && triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [open, triggerRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="relative z-10 bg-white rounded-xl shadow-lg border border-neutral-200 p-6 w-full max-w-md mx-4 animate-fade-in"
      >
        <h2
          id="dialog-title"
          className="text-h4 text-neutral-900 mb-4"
        >
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

export { Dialog };
