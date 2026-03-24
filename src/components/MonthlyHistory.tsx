import React from 'react';
import { TrendingUp, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { MonthlyHistory as MonthlyHistoryType } from '../types';

interface MonthlyHistoryProps {
  history: MonthlyHistoryType[];
}

export const MonthlyHistory: React.FC<MonthlyHistoryProps> = ({ history }) => {
  const averageSpending = history.length > 0 
    ? history.reduce((acc, curr) => acc + curr.total, 0) / history.length 
    : 0;

  const sortedHistory = [...history].sort((a, b) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months.indexOf(a.month) - months.indexOf(b.month);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-violet-100 p-4 rounded-2xl text-violet-600">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Média Mensal</p>
            <p className="text-3xl font-black text-slate-800">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(averageSpending)}
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-green-100 p-4 rounded-2xl text-green-600">
            <Calendar size={32} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meses Registrados</p>
            <p className="text-3xl font-black text-slate-800">{history.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Histórico de Gastos</h3>
          <DollarSign className="text-violet-600" size={24} />
        </div>
        
        <div className="divide-y divide-slate-50">
          {sortedHistory.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p>Nenhum histórico disponível ainda.</p>
            </div>
          ) : (
            sortedHistory.map((item) => (
              <div key={item.month} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-600">
                    {item.month.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{item.month}</p>
                    <p className="text-xs text-slate-400">Total gasto no mês</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xl font-black text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                  </p>
                  <ArrowRight className="text-slate-300" size={20} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
