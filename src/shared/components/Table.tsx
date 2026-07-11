import React from 'react';

// Main Table wrapper
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

function TableRoot({ className = '', children, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200">
      <table className={`min-w-full divide-y divide-neutral-200 ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

// Sub-components
function Head({ children }: { children: React.ReactNode }) {
  return <thead className="bg-neutral-50">{children}</thead>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-neutral-200 bg-white">{children}</tbody>;
}

function Row({ children, highlighted }: { children: React.ReactNode; highlighted?: boolean }) {
  return (
    <tr className={`${highlighted ? 'bg-primary-50' : 'even:bg-neutral-50'} transition-colors duration-fast`}>
      {children}
    </tr>
  );
}

function HeaderCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-caption font-medium text-neutral-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

function Cell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 text-body-sm text-neutral-700 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}

// Compose compound component
const Table = Object.assign(TableRoot, {
  Head,
  Body,
  Row,
  HeaderCell,
  Cell,
});

export { Table };
