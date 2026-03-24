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
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-violet-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Side: Stats */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-600">
              <ShoppingBag size={18} className="mr-2 text-violet-500" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Itens Ativos</span>
                <span className="text-sm font-bold">{activeItemCount} de {itemCount}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center text-slate-600">
              <TrendingUp size={18} className="mr-2 text-emerald-500" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Média/Item</span>
                <span className="text-sm font-bold">{formatCurrency(activeItemCount > 0 ? total / activeItemCount : 0)}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Total (The "Calculator" result) */}
          <div className="flex items-center bg-violet-600 text-white px-6 py-2 rounded-2xl shadow-lg shadow-violet-200">
            <Calculator size={24} className="mr-3 opacity-80" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Total Estimado</span>
              <span className="text-2xl font-black tracking-tight">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
