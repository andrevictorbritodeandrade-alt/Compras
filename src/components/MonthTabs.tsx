import React from 'react';

interface MonthTabsProps {
  activeMonth: string;
  onMonthChange: (month: string) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Translate month names for display
const PT_BR_MONTHS_ABBR: { [key: string]: string } = {
  "January": "JAN", "February": "FEV", "March": "MAR", "April": "ABR",
  "May": "MAI", "June": "JUN", "July": "JUL", "August": "AGO",
  "September": "SET", "October": "OUT", "November": "NOV", "December": "DEZ"
};

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onMonthChange }) => {
  const firstHalf = MONTHS.slice(0, 6);
  const secondHalf = MONTHS.slice(6, 12);

  const renderMonth = (month: string) => {
    const isActive = activeMonth === month;
    return (
      <button
        key={month}
        onClick={() => onMonthChange(month)}
        className={`flex-1 min-w-[60px] whitespace-nowrap py-2 px-2 rounded-lg font-black text-sm md:text-base transition-transform active:scale-95 uppercase tracking-wider
          ${isActive
            ? 'bg-yellow-400 text-black shadow-md border-2 border-yellow-500'
            : 'bg-red-600 text-white hover:bg-red-500 border-2 border-transparent'
          }`}
      >
        {PT_BR_MONTHS_ABBR[month]}
      </button>
    );
  };

  return (
    <div className="bg-red-700 border-b-4 border-red-800">
      <nav className="container mx-auto px-2 py-2 flex flex-col gap-2" aria-label="Tabs">
        <div className="flex justify-between gap-1">
          {firstHalf.map(renderMonth)}
        </div>
        <div className="flex justify-between gap-1">
          {secondHalf.map(renderMonth)}
        </div>
      </nav>
    </div>
  );
};
