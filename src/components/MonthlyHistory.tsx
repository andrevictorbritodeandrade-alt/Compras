import React from 'react';
import { TrendingUp, Calendar, DollarSign, ArrowRight, ShoppingBag } from 'lucide-react';
import { MonthlyHistory as MonthlyHistoryType, Purchase } from '../types';

interface MonthlyHistoryProps {
  history: MonthlyHistoryType[];
  purchases?: Purchase[];
}

export const MonthlyHistory: React.FC<MonthlyHistoryProps> = ({ history, purchases = [] }) => {
  const averageSpending = history.length > 0 
    ? history.reduce((acc, curr) => acc + curr.total, 0) / history.length 
    : 0;

  const sortedHistory = [...history].sort((a, b) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  const sortedPurchases = [...purchases].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-200 flex items-center gap-4">
          <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Média Mensal</p>
            <p className="text-3xl font-black text-slate-900">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageSpending)}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-200 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600">
            <Calendar size={32} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Meses Registrados</p>
            <p className="text-3xl font-black text-slate-900">{history.length}</p>
          </div>
        </div>
      </div>

      {sortedPurchases.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden">
          <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Compras Finalizadas (Este Mês)</h3>
            <ShoppingBag className="text-red-600" size={24} />
          </div>
          
          <div className="divide-y-2 divide-slate-100">
            {sortedPurchases.map((purchase) => (
              <div key={purchase.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center font-black text-red-600">
                    {new Date(purchase.date).getDate()}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase">
                      {new Date(purchase.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-sm font-bold text-slate-500">{purchase.itemCount} itens comprados</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-black text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.total)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden">
        <div className="p-6 border-b-2 border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Histórico de Gastos (Geral)</h3>
          <DollarSign className="text-blue-600" size={24} />
        </div>
        
        <div className="divide-y-2 divide-slate-100">
          {sortedHistory.length === 0 ? (
            <div className="p-12 text-center font-bold text-slate-400">
              <p>Nenhum histórico disponível ainda.</p>
            </div>
          ) : (
            sortedHistory.map((item) => (
              <div key={item.month} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-600">
                    {item.month.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 uppercase">{item.month}</p>
                    <p className="text-sm font-bold text-slate-500">Total gasto no mês</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-black text-slate-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
