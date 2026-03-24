import React, { useState, useMemo } from 'react';
import { Deal, Category } from '../types';
import { Trash2, Plus, Calendar, Store, Tag, CheckCircle, AlertCircle } from 'lucide-react';

interface EncartesProps {
  deals: Deal[];
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
  onDeleteDeal: (dealId: string) => void;
  existingItemNames: string[];
  shoppingList: Category[];
}

export const Encartes: React.FC<EncartesProps> = ({ deals, onAddDeal, onDeleteDeal, existingItemNames, shoppingList }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [market, setMarket] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !price || !market || !date) return;

    onAddDeal({
      itemName,
      price: Number(price),
      market,
      date,
    });

    setItemName('');
    setPrice('');
    setMarket('');
    setIsFormOpen(false);
  };

  const filteredDeals = useMemo(() => {
    return deals
      .filter(deal => deal.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || deal.market.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [deals, searchTerm]);

  const dealsByMarket = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    filteredDeals.forEach(deal => {
      const marketName = deal.market || 'Outros';
      if (!grouped[marketName]) {
        grouped[marketName] = [];
      }
      grouped[marketName].push(deal);
    });
    return grouped;
  }, [filteredDeals]);

  const uniqueItemNames = useMemo(() => {
     return Array.from(new Set([...existingItemNames, ...deals.map(d => d.itemName)])).sort();
  }, [existingItemNames, deals]);

  const isItemInList = (itemName: string) => {
    return shoppingList.some(cat => cat.items.some(item => item.name.toLowerCase() === itemName.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Encartes e Ofertas</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-violet-600 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-md"
        >
          <Plus size={20} />
          Nova Oferta
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-violet-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Adicionar Oferta</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Produto</label>
              <input
                list="item-names"
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ex: Leite Integral"
                required
              />
              <datalist id="item-names">
                {uniqueItemNames.map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mercado</label>
              <input
                type="text"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Ex: Supermercado X"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data da Oferta</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >
                Salvar Oferta
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative">
        <input
            type="text"
            placeholder="Buscar ofertas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
        <div className="absolute left-3 top-2.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>

      {Object.keys(dealsByMarket).length === 0 ? (
        <div className="text-center py-10 text-slate-500 bg-white rounded-xl border border-slate-100">
          <Tag className="mx-auto h-12 w-12 text-slate-300 mb-2" />
          <p>Nenhuma oferta encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.keys(dealsByMarket).map((marketName) => {
            const marketDeals = dealsByMarket[marketName];
            return (
              <div key={marketName} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="text-violet-600" size={20} />
                    <h3 className="text-lg font-bold text-slate-800">{marketName}</h3>
                  </div>
                  <span className="text-xs font-medium bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                    {marketDeals.length} ofertas
                  </span>
                </div>
                
                <div className="p-0 flex-grow">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2">Produto</th>
                        <th className="px-4 py-2 text-right">Preço</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {marketDeals.map((deal) => {
                        const inList = isItemInList(deal.itemName);
                        return (
                          <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-3 font-medium text-slate-700">{deal.itemName}</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-900">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.price)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {inList ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full" title="Na Lista">
                                  <CheckCircle size={14} />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-100 text-slate-400 rounded-full" title="Extra">
                                  <AlertCircle size={14} />
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => onDeleteDeal(deal.id)}
                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                title="Excluir"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-50 p-3 text-xs text-slate-400 text-center border-t border-slate-100">
                  Ofertas válidas até {new Date(marketDeals[0].date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
