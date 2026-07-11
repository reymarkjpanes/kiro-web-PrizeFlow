import React from 'react';

export interface SectionHeadingProps {
  children: React.ReactNode;
  as?: 'h2' | 'h3';
}

function SectionHeading({ children, as: Element = 'h2' }: SectionHeadingProps) {
  return (
    <Element className="text-h3 font-semibold text-neutral-800">
      {children}
    </Element>
  );
}

export { SectionHeading };
