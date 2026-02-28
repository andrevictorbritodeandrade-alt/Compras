import React from 'react';

interface SummaryBarProps {
  total: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const SummaryBar: React.FC<SummaryBarProps> = ({ total }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-700">Total do Mês:</span>
        <span className="text-2xl font-bold text-indigo-600">{formatCurrency(total)}</span>
      </div>
    </div>
  );
};
