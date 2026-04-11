import React from 'react';
import { Calculator, TrendingUp, ShoppingBag } from 'lucide-react';

interface SummaryBarProps {
  total: number;
  itemCount: number;
  activeItemCount: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const SummaryBar: React.FC<SummaryBarProps> = ({ total, itemCount, activeItemCount }) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b-4 border-slate-200 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-4">
          {/* Stats Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center text-slate-800">
              <ShoppingBag size={24} className="mr-2 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-xs uppercase font-black tracking-widest text-slate-500">Itens Ativos</span>
                <span className="text-lg font-black">{activeItemCount} de {itemCount}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center text-slate-800">
              <TrendingUp size={24} className="mr-2 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-xs uppercase font-black tracking-widest text-slate-500">Média/Item</span>
                <span className="text-lg font-black">{formatCurrency(activeItemCount > 0 ? total / activeItemCount : 0)}</span>
              </div>
            </div>
          </div>

          {/* Total Card (Full Width) */}
          <div className="flex items-center justify-between bg-green-600 text-white px-6 py-4 rounded-2xl shadow-lg border-4 border-green-700 w-full">
            <div className="flex items-center">
                <Calculator size={32} className="mr-3 text-yellow-300" />
                <span className="text-sm uppercase font-black tracking-widest text-green-100">Total Estimado</span>
            </div>
            <span className="text-4xl font-black tracking-tighter">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
