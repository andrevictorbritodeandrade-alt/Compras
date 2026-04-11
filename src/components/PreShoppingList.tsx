import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Power, PowerOff, Plus } from 'lucide-react';
import { EXTRACTED_ITEMS, MARKET_PRICES, INITIAL_CATEGORIES } from '../constants';
import { Category, ShoppingItem } from '../types';

interface PreShoppingListProps {
  onSyncAIList?: () => void;
  currentShoppingList: Category[];
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number | boolean) => void;
  onAddItemsToList: (items: { name: string; category: string }[]) => void;
  masterList: string[];
}

export const PreShoppingList: React.FC<PreShoppingListProps> = ({ onSyncAIList, currentShoppingList, onItemChange, onAddItemsToList, masterList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<'Todos' | 'Atacadão' | 'Supermarket' | 'Dom Atacadista' | 'Guanabara'>('Todos');
  const [localMarketPrices, setLocalMarketPrices] = useState<Record<string, { [market: string]: number | null }>>(MARKET_PRICES);

  const allItems = useMemo(() => {
    const combined = new Set([...EXTRACTED_ITEMS, ...masterList.map(i => i.charAt(0).toUpperCase() + i.slice(1))]);
    return Array.from(combined);
  }, [masterList]);

  const getCheapestMarket = (itemName: string) => {
    const prices = localMarketPrices[itemName];
    if (!prices) return null;
    const validPrices = Object.entries(prices).filter(([_, p]) => p !== null) as [string, number][];
    if (validPrices.length === 0) return null;
    const minPrice = Math.min(...validPrices.map(([_, p]) => p));
    return validPrices.filter(([_, p]) => p === minPrice).map(([m, _]) => m);
  };

  const filteredItems = useMemo(() => {
    let items = allItems.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedMarket !== 'Todos') {
      items = items.filter(item => {
        const cheapestMarkets = getCheapestMarket(item);
        return cheapestMarkets?.includes(selectedMarket);
      });
    }

    return items.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [searchTerm, allItems, selectedMarket, localMarketPrices]);

  const autosumCheapest = useMemo(() => {
    let total = 0;
    // We only sum items that are ACTIVE in the current shopping list
    currentShoppingList.forEach(cat => {
      cat.items.forEach(item => {
        if (item.active !== false) {
          const prices = localMarketPrices[item.name];
          if (prices) {
            const validPrices = Object.values(prices).filter(p => p !== null) as number[];
            if (validPrices.length > 0) {
              total += Math.min(...validPrices) * item.quantity;
            }
          }
        }
      });
    });
    return total;
  }, [currentShoppingList, localMarketPrices]);

  const handlePriceChange = (itemName: string, market: string, value: number | null) => {
    setLocalMarketPrices(prev => ({
      ...prev,
      [itemName]: {
        ...(prev[itemName] || { "Atacadão": null, "Supermarket": null, "Dom Atacadista": null, "Guanabara": null }),
        [market]: value
      }
    }));
  };

  const handleAddNewItem = () => {
    if (!searchTerm) return;
    const newItemName = searchTerm.trim();
    if (!allItems.some(i => i.toLowerCase() === newItemName.toLowerCase())) {
        onAddItemsToList([{ name: newItemName, category: 'Outros' }]);
        setSearchTerm('');
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return '—';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const getPriceColorClass = (itemName: string, market: string) => {
    const prices = localMarketPrices[itemName];
    if (!prices || prices[market] === null || prices[market] === undefined) return '';

    const validPrices = Object.values(prices).filter(p => p !== null) as number[];
    if (validPrices.length === 0) return '';

    const minPrice = Math.min(...validPrices);
    const maxPrice = Math.max(...validPrices);

    if (prices[market] === minPrice && validPrices.length > 1) {
      return 'bg-green-100 text-green-800 font-black border-2 border-green-500';
    }
    if (prices[market] === maxPrice && validPrices.length > 1) {
      return 'bg-red-50 text-red-800 border border-red-200';
    }
    return '';
  };

  const getItemInList = (itemName: string) => {
    for (const cat of currentShoppingList) {
      const item = cat.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (item) return item;
    }
    return null;
  };

  const handleToggleItem = (itemName: string) => {
    const itemInList = getItemInList(itemName);
    if (itemInList) {
      onItemChange(itemInList.id, 'active', !(itemInList.active !== false));
    } else {
      // Find category for this item
      let categoryName = 'Outros';
      for (const cat of INITIAL_CATEGORIES) {
        if (cat.items.some(i => i.name.toLowerCase() === itemName.toLowerCase())) {
          categoryName = cat.name;
          break;
        }
      }
      onAddItemsToList([{ name: itemName, category: categoryName }]);
    }
  };

  const handleTurnAllOn = () => {
    const itemsToAdd: { name: string; category: string }[] = [];
    
    filteredItems.forEach(itemName => {
      let categoryName = 'Outros';
      for (const cat of INITIAL_CATEGORIES) {
        if (cat.items.some(i => i.name.toLowerCase() === itemName.toLowerCase())) {
          categoryName = cat.name;
          break;
        }
      }
      itemsToAdd.push({ name: itemName, category: categoryName });
    });

    if (itemsToAdd.length > 0) {
      onAddItemsToList(itemsToAdd);
    }
  };

  const getMarketCount = (market: 'Todos' | 'Atacadão' | 'Supermarket' | 'Dom Atacadista' | 'Guanabara') => {
    if (market === 'Todos') return allItems.length;
    return allItems.filter(item => {
      const cheapestMarkets = getCheapestMarket(item);
      return cheapestMarkets?.includes(market);
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Faltando em casa</h2>
        <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
          <button
            onClick={handleTurnAllOn}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-black hover:bg-green-600 transition-transform active:scale-95 uppercase shadow-md"
          >
            <Power size={20} />
            <span className="hidden sm:inline">Ligar Todos</span>
            <span className="sm:hidden">Ligar Todos</span>
          </button>
          {onSyncAIList && (
            <button
              onClick={onSyncAIList}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-black hover:bg-yellow-500 transition-transform active:scale-95 uppercase border-2 border-yellow-500 shadow-md"
            >
              <Sparkles size={20} />
              <span className="hidden sm:inline">Sincronizar Lista da IA</span>
              <span className="sm:hidden">Sincronizar IA</span>
            </button>
          )}
          <div className="relative flex-1 md:w-64 flex gap-2">
            <div className="relative flex-1">
                <input
                type="text"
                placeholder="Buscar ou adicionar item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-full focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-bold"
                />
                <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
            </div>
            {searchTerm && !allItems.some(i => i.toLowerCase() === searchTerm.toLowerCase()) && (
                <button
                    onClick={handleAddNewItem}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-black uppercase text-xs hover:bg-blue-700 transition-transform active:scale-95 flex items-center gap-1"
                >
                    <Plus size={16} />
                    Add
                </button>
            )}
          </div>
        </div>
      </div>

      {/* Autosum and Market Tabs */}
      <div className="bg-slate-100 p-4 rounded-2xl border-4 border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="block text-sm font-black text-slate-500 uppercase tracking-widest">Total Estimado (Melhores Preços)</span>
            <span className="text-4xl font-black text-green-600">{formatPrice(autosumCheapest)}</span>
            <p className="text-xs font-bold text-slate-400 uppercase mt-1">* Soma apenas itens ativos na lista</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {(['Todos', 'Atacadão', 'Supermarket', 'Dom Atacadista', 'Guanabara'] as const).map(market => (
              <button
                key={market}
                onClick={() => setSelectedMarket(market)}
                className={`px-4 py-3 rounded-full font-black text-xs md:text-sm uppercase transition-all flex items-center gap-2 ${
                  selectedMarket === market 
                  ? 'bg-blue-600 text-white shadow-md scale-105' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                }`}
              >
                {market}
                <span className={`px-2 py-1 rounded-full text-xs ${selectedMarket === market ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {getMarketCount(market)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border-4 border-slate-200">
        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b-4 border-slate-200">
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Status</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base">Item</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Qtd</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Atacadão</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Supermarket</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Dom Atacadista</th>
                <th className="p-4 font-black text-slate-800 uppercase tracking-widest text-base text-center">Guanabara</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {filteredItems.map((item, index) => {
                const prices = MARKET_PRICES[item] || { "Atacadão": null, "Supermarket": null, "Dom Atacadista": null, "Guanabara": null };
                const itemInList = getItemInList(item);
                const isActive = itemInList ? (itemInList.active !== false) : false;

                return (
                  <tr key={index} className={`hover:bg-slate-50 transition-colors ${!isActive ? 'opacity-60 bg-slate-50' : ''}`}>
                    <td className="p-4 text-center border-r-2 border-slate-100">
                      <button 
                        onClick={() => handleToggleItem(item)}
                        className={`p-2 rounded-full transition-colors ${isActive ? 'text-blue-600 hover:bg-blue-100' : 'text-slate-400 hover:bg-slate-200'}`}
                        title={isActive ? "Desligar (Não comprar agora)" : "Ligar (Comprar agora)"}
                      >
                        {isActive ? <Power size={24} /> : <PowerOff size={24} />}
                      </button>
                    </td>
                    <td className="p-4 font-black text-slate-900 uppercase text-base md:text-lg border-r-2 border-slate-100">{item}</td>
                    <td className="p-2 text-center border-r-2 border-slate-100">
                      {itemInList ? (
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onItemChange(itemInList.id, 'quantity', Math.max(0, (itemInList.quantity || 1) - 1)); }}
                            className="p-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700"
                          >-</button>
                          <span className="font-black w-6 text-center text-base md:text-lg">{itemInList.quantity || 1}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onItemChange(itemInList.id, 'quantity', (itemInList.quantity || 1) + 1); }}
                            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
                          >+</button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                    <td className={`p-2 text-center border-r-2 border-slate-100 ${selectedMarket === 'Atacadão' ? 'bg-blue-50/50' : ''}`}>
                      <input 
                        type="number"
                        step="0.01"
                        value={prices['Atacadão'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Atacadão', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-1 rounded font-bold text-base bg-transparent border-none focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Atacadão')}`}
                      />
                    </td>
                    <td className={`p-2 text-center border-r-2 border-slate-100 ${selectedMarket === 'Supermarket' ? 'bg-blue-50/50' : ''}`}>
                      <input 
                        type="number"
                        step="0.01"
                        value={prices['Supermarket'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Supermarket', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-1 rounded font-bold text-base bg-transparent border-none focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Supermarket')}`}
                      />
                    </td>
                    <td className={`p-2 text-center border-r-2 border-slate-100 ${selectedMarket === 'Dom Atacadista' ? 'bg-blue-50/50' : ''}`}>
                      <input 
                        type="number"
                        step="0.01"
                        value={prices['Dom Atacadista'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Dom Atacadista', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-1 rounded font-bold text-base bg-transparent border-none focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Dom Atacadista')}`}
                      />
                    </td>
                    <td className={`p-2 text-center ${selectedMarket === 'Guanabara' ? 'bg-blue-50/50' : ''}`}>
                      <input 
                        type="number"
                        step="0.01"
                        value={prices['Guanabara'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Guanabara', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-1 rounded font-bold text-base bg-transparent border-none focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Guanabara')}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card-based List (No horizontal scroll) */}
        <div className="md:hidden divide-y-4 divide-slate-200">
          {filteredItems.map((item, index) => {
            const prices = MARKET_PRICES[item] || { "Atacadão": null, "Supermarket": null, "Dom Atacadista": null, "Guanabara": null };
            const itemInList = getItemInList(item);
            const isActive = itemInList ? (itemInList.active !== false) : false;

            return (
              <div key={index} className={`p-4 space-y-3 ${!isActive ? 'opacity-60 bg-slate-50' : 'bg-white'}`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-black text-slate-900 uppercase text-lg md:text-xl leading-tight">{item}</h3>
                  </div>
                  <button 
                    onClick={() => handleToggleItem(item)}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-100'}`}
                  >
                    {isActive ? <Power size={20} /> : <PowerOff size={20} />}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
                  <span className="text-base font-black text-slate-500 uppercase">Quantidade:</span>
                  {itemInList ? (
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => onItemChange(itemInList.id, 'quantity', Math.max(0, (itemInList.quantity || 1) - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-black text-xl"
                      >-</button>
                      <span className="font-black text-xl">{itemInList.quantity || 1}</span>
                      <button 
                        onClick={() => onItemChange(itemInList.id, 'quantity', (itemInList.quantity || 1) + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-black text-xl"
                      >+</button>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-bold text-sm">Não adicionado</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`text-center space-y-1 p-2 rounded-lg ${selectedMarket === 'Atacadão' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    <span className="block text-sm font-black text-slate-400 uppercase">Atacadão</span>
                    <input 
                        type="number"
                        step="0.01"
                        value={prices['Atacadão'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Atacadão', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-2 rounded font-bold text-base bg-white border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Atacadão')}`}
                    />
                  </div>
                  <div className={`text-center space-y-1 p-2 rounded-lg ${selectedMarket === 'Supermarket' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    <span className="block text-sm font-black text-slate-400 uppercase">Supermarket</span>
                    <input 
                        type="number"
                        step="0.01"
                        value={prices['Supermarket'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Supermarket', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-2 rounded font-bold text-base bg-white border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Supermarket')}`}
                    />
                  </div>
                  <div className={`text-center space-y-1 p-2 rounded-lg ${selectedMarket === 'Dom Atacadista' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    <span className="block text-sm font-black text-slate-400 uppercase">Dom Atacadista</span>
                    <input 
                        type="number"
                        step="0.01"
                        value={prices['Dom Atacadista'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Dom Atacadista', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-2 rounded font-bold text-base bg-white border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Dom Atacadista')}`}
                    />
                  </div>
                  <div className={`text-center space-y-1 p-2 rounded-lg ${selectedMarket === 'Guanabara' ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 border-2 border-slate-100'}`}>
                    <span className="block text-sm font-black text-slate-400 uppercase">Guanabara</span>
                    <input 
                        type="number"
                        step="0.01"
                        value={prices['Guanabara'] || ''}
                        placeholder="—"
                        onChange={(e) => handlePriceChange(item, 'Guanabara', e.target.value ? parseFloat(e.target.value) : null)}
                        className={`w-full text-center p-2 rounded font-bold text-base bg-white border-2 border-slate-200 focus:ring-2 focus:ring-blue-500 ${getPriceColorClass(item, 'Guanabara')}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
