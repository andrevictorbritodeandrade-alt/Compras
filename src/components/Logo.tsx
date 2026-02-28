import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 4.5H5.5L8 14.5H18.5L20.5 7.5H6.5"/>
      <circle cx="9" cy="19" r="1.5"/>
      <circle cx="17" cy="19" r="1.5"/>
    </svg>
  );
};
