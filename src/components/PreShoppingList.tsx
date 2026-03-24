import React, { useState, useMemo } from 'react';
import { Search, Plus, CheckCircle2, Circle, ShoppingCart, Power, PowerOff } from 'lucide-react';
import { Category, ShoppingItem } from '../types';
import { INITIAL_CATEGORIES } from '../constants';

interface PreShoppingListProps {
  onAddItemsToList: (items: { name: string; category: string }[]) => void;
  currentShoppingList: Category[];
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number | boolean) => void;
}

export const PreShoppingList: React.FC<PreShoppingListProps> = ({ onAddItemsToList, currentShoppingList, onItemChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const allItems = useMemo(() => {
    const items: { name: string; category: string }[] = [];
    INITIAL_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        items.push({ name: item.name, category: cat.name });
      });
    });
    return items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allItems, searchTerm]);

  const toggleItem = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  const handleAddSelected = () => {
    const itemsToAdd = allItems.filter(item => selectedItems.has(item.name));
    onAddItemsToList(itemsToAdd);
    setSelectedItems(new Set());
  };

  const getItemInList = (itemName: string) => {
    for (const cat of currentShoppingList) {
      const item = cat.items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
      if (item) return item;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Lista antes das compras</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => {
                const itemInList = getItemInList(item.name);
                const isSelected = selectedItems.has(item.name);
                const isActive = itemInList ? (itemInList.active !== false) : false;
                
                return (
                  <tr 
                    key={item.name} 
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${isSelected ? 'bg-violet-50' : ''} ${itemInList && !isActive ? 'opacity-60' : ''}`}
                    onClick={() => !itemInList && toggleItem(item.name)}
                  >
                    <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      {itemInList ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${isActive ? 'text-green-600 bg-green-50 border-green-100' : 'text-slate-400 bg-slate-100 border-slate-200'}`}>
                            {isActive ? <CheckCircle2 size={10} className="mr-1" /> : <PowerOff size={10} className="mr-1" />}
                            {isActive ? 'Ativo na Lista' : 'Desativado'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Não adicionado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {itemInList ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onItemChange(itemInList.id, 'active', !isActive);
                          }}
                          className={`p-2 rounded-full transition-colors ${isActive ? 'text-violet-600 hover:bg-violet-100' : 'text-slate-400 hover:bg-slate-200'}`}
                          title={isActive ? "Desligar (Não comprar agora)" : "Ligar (Comprar agora)"}
                        >
                          {isActive ? <Power size={20} /> : <PowerOff size={20} />}
                        </button>
                      ) : (
                        <button className="text-violet-600">
                          {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-slate-300" />}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItems.size > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-40">
          <button 
            onClick={handleAddSelected}
            className="w-full bg-violet-600 text-white p-4 rounded-full flex justify-between items-center shadow-xl hover:bg-violet-700 transition-all transform active:scale-95"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} />
              <span className="font-bold">Adicionar {selectedItems.size} itens à lista</span>
            </div>
            <Plus size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
