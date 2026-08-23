import React from 'react';

interface RazorpayLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge' | 'white';
  height?: number;
}

export const RazorpayLogo: React.FC<RazorpayLogoProps> = ({
  className = '',
  variant = 'full',
  height = 24,
}) => {
  if (variant === 'icon') {
    return (
      <svg
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M38.8 12.5L16.2 87.5H36.3L50.5 40.5L62.7 87.5H83.8L57.2 12.5H38.8Z"
          fill="#0C83FF"
        />
        <path
          d="M57.2 12.5L47.5 47.8L71.8 47.8L81.5 12.5H57.2Z"
          fill="#002970"
        />
      </svg>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#02042b] border border-[#0c83ff]/30 text-white shadow-sm ${className}`}>
        <svg
          height={height || 16}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          <path
            d="M38.8 12.5L16.2 87.5H36.3L50.5 40.5L62.7 87.5H83.8L57.2 12.5H38.8Z"
            fill="#0C83FF"
          />
          <path
            d="M57.2 12.5L47.5 47.8L71.8 47.8L81.5 12.5H57.2Z"
            fill="#3395FF"
          />
        </svg>
        <span className="text-[11px] font-bold tracking-tight text-white flex items-center space-x-1">
          <span>Secured by</span>
          <span className="font-extrabold text-[#38bdf8]">Razorpay</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${className}`}>
      <svg
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M38.8 12.5L16.2 87.5H36.3L50.5 40.5L62.7 87.5H83.8L57.2 12.5H38.8Z"
          fill="#0C83FF"
        />
        <path
          d="M57.2 12.5L47.5 47.8L71.8 47.8L81.5 12.5H57.2Z"
          fill="#3395FF"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-sm font-extrabold tracking-tight text-white flex items-center">
          Razorpay
          <span className="ml-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-[#0c83ff]/20 text-[#38bdf8] border border-[#0c83ff]/30">
            TEST
          </span>
        </span>
      </div>
    </div>
  );
};
