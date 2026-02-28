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
        <div className="space-y-8">
          {Object.keys(dealsByMarket).map((marketName) => {
            const marketDeals = dealsByMarket[marketName];
            return (
            <div key={marketName} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                <Store className="text-violet-600" size={24} />
                <h3 className="text-xl font-bold text-slate-800">{marketName}</h3>
                <span className="text-sm text-slate-500 ml-auto">{marketDeals.length} ofertas</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketDeals.map((deal) => {
                  const inList = isItemInList(deal.itemName);
                  return (
                    <div key={deal.id} className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow relative group ${inList ? 'border-green-200 ring-1 ring-green-100' : 'border-slate-100'}`}>
                      <button
                        onClick={() => onDeleteDeal(deal.id)}
                        className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Excluir oferta"
                      >
                        <Trash2 size={16} />
                      </button>
                      
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-slate-800 capitalize pr-6">{deal.itemName}</h4>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="bg-green-100 text-green-800 text-lg font-bold px-3 py-1 rounded-full">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deal.price)}
                        </span>
                        
                        {inList ? (
                          <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100" title="Item na sua lista de compras">
                            <CheckCircle size={12} className="mr-1" />
                            Na Lista
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100" title="Item não está na lista">
                            <AlertCircle size={12} className="mr-1" />
                            Extra
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-slate-400 mt-3 pt-2 border-t border-slate-50">
                        <Calendar size={12} className="mr-1.5" />
                        {new Date(deal.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
          })}
        </div>
      )}
    </div>
  );
};
