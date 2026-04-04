import React from 'react';

interface ArrowBulletProps {
  children: React.ReactNode;
  className?: string;
}

export const ArrowBullet: React.FC<ArrowBulletProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-start gap-4 ${className}`}>
      <svg
        className="w-6 h-6 mt-1 flex-shrink-0 text-brand"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
      <span className="text-lg text-foreground leading-relaxed">{children}</span>
    </div>
  );
};
