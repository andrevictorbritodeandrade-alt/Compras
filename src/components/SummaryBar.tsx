import React, { useState } from 'react';
import { Calculator, TrendingUp, ShoppingBag, CreditCard, CalendarCheck, Edit3, Check } from 'lucide-react';

interface SummaryBarProps {
  total: number;
  itemCount: number;
  activeItemCount: number;
  paymentMethod?: string;
  dueDate?: string;
  onUpdatePaymentInfo?: (paymentMethod: string, dueDate: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const SummaryBar: React.FC<SummaryBarProps> = ({ 
  total, 
  itemCount, 
  activeItemCount,
  paymentMethod = "Cartão do Iago",
  dueDate = "07 de Setembro",
  onUpdatePaymentInfo
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(paymentMethod);
  const [currentDueDate, setCurrentDueDate] = useState(dueDate);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdatePaymentInfo) {
      onUpdatePaymentInfo(currentPaymentMethod, currentDueDate);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b-4 border-slate-200 shadow-md transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col gap-3">
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

          {/* Payment Details Banner (Cartão do Iago & Vencimento em 07 de Setembro) */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 rounded-2xl shadow-md border-2 border-blue-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <CreditCard size={24} className="text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">Forma de Pagamento</span>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="text-blue-200 hover:text-white transition-colors"
                      title="Editar cartão e vencimento"
                    >
                      <Edit3 size={12} />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={currentPaymentMethod}
                    onChange={(e) => setCurrentPaymentMethod(e.target.value)}
                    className="bg-white/20 text-white font-black text-sm px-2 py-0.5 rounded border border-white/40 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                    placeholder="Ex: Cartão do Iago"
                  />
                ) : (
                  <p className="text-base font-black tracking-tight">{currentPaymentMethod}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                <CalendarCheck size={24} className="text-green-300" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-200">Pagar em (Vencimento)</span>
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentDueDate}
                      onChange={(e) => setCurrentDueDate(e.target.value)}
                      className="bg-white/20 text-white font-black text-sm px-2 py-0.5 rounded border border-white/40 focus:outline-none focus:ring-1 focus:ring-yellow-300"
                      placeholder="Ex: 07 de Setembro"
                    />
                    <button 
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white p-1 rounded font-black transition-colors"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <p className="text-base font-black tracking-tight text-yellow-300">{currentDueDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Total Card (Full Width) */}
          <div className="flex items-center justify-between bg-green-600 text-white px-6 py-4 rounded-2xl shadow-lg border-4 border-green-700 w-full">
            <div className="flex items-center">
                <Calculator size={32} className="mr-3 text-yellow-300" />
                <div>
                  <span className="text-xs uppercase font-black tracking-widest text-green-100 block">Total Estimado</span>
                  <span className="text-[11px] font-black text-yellow-200">Fatura {currentDueDate}</span>
                </div>
            </div>
            <span className="text-4xl font-black tracking-tighter">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
