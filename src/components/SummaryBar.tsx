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

export const SummaryBar: React.FC<SummaryBarProps> = ({ 
  total, 
  itemCount, 
  activeItemCount,
}) => {

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-1">
        <div className="flex flex-col gap-1">
          {/* Stats Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center text-slate-800">
              <ShoppingBag size={18} className="mr-1 text-red-600" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Itens</span>
                <span className="text-sm font-black">{activeItemCount} de {itemCount}</span>
              </div>
            </div>
            <div className="flex items-center text-slate-800">
              <TrendingUp size={18} className="mr-1 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Média/Item</span>
                <span className="text-sm font-black">{formatCurrency(activeItemCount > 0 ? total / activeItemCount : 0)}</span>
              </div>
            </div>
          </div>

          {/* Total Card (Full Width) */}
          <div className="flex items-center justify-between bg-emerald-600 text-white px-3 py-1 rounded-lg shadow-sm w-full">
            <div className="flex items-center">
                <Calculator size={18} className="mr-2 text-yellow-300 shrink-0" />
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-100">Total</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-yellow-300">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
