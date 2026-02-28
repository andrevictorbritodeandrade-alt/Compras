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
  "January": "Jan", "February": "Fev", "March": "Mar", "April": "Abr",
  "May": "Mai", "June": "Jun", "July": "Jul", "August": "Ago",
  "September": "Set", "October": "Out", "November": "Nov", "December": "Dez"
};

export const MonthTabs: React.FC<MonthTabsProps> = ({ activeMonth, onMonthChange }) => {
  const currentMonthIndex = new Date().getMonth();
  // Show current month and next 5 months for simplicity
  const displayMonths = Array.from({ length: 12 }, (_, i) => MONTHS[(currentMonthIndex + i) % 12]);

  return (
    <div className="border-b border-violet-200">
      <nav className="container mx-auto px-4 py-2 -mb-px flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Tabs">
        {MONTHS.map(month => {
          const isActive = activeMonth === month;
          return (
            <button
              key={month}
              onClick={() => onMonthChange(month)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                ${isActive
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-gray-500 hover:text-violet-700 hover:border-violet-300'
                }`}
            >
              {PT_BR_MONTHS_ABBR[month]}
            </button>
          )
        })}
      </nav>
    </div>
  );
};
