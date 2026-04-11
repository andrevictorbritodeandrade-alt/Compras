import React, { useState } from 'react';
import type { Category, ShoppingItem, Deal } from '../types';
import { ShoppingItemRow } from './ShoppingItemRow';
import { Search, Plus, Sparkles } from 'lucide-react';

interface ShoppingListProps {
  categories: Category[];
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number) => void;
  onDeleteItem: (itemId: number) => void;
  estimations: Map<string, { quantity: number; unit: string }>;
  meatEstimateKg: number;
  bestDeals: Map<string, Deal>;
  masterList: string[];
  onAddItems: (items: { name: string; category: string }[]) => void;
}

const categoryColors = [
    { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', icon: 'text-violet-600' },
    { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800', icon: 'text-sky-600' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: 'text-emerald-600' },
    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-600' },
    { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', icon: 'text-rose-600' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', icon: 'text-cyan-600' },
    { bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-800', icon: 'text-fuchsia-600' },
];

interface CategoryIconProps {
  categoryName: string;
  className: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryName, className }) => {
    const iconClasses = `w-6 h-6 mr-3 ${className}`;
    if (categoryName.toLowerCase().includes('grãos') || categoryName.toLowerCase().includes('derivados')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm4 0h-2v-2h2v2zm0-4h-2v-2h2v2zm-4 0H9v-2h2v2z" /></svg>;
    }
    if (categoryName.toLowerCase().includes('limpeza')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /></svg>;
    }
    if (categoryName.toLowerCase().includes('carnes') || categoryName.toLowerCase().includes('ovos')) {
        return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20.25c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75V15c0-1.105-.895-2-2-2h-1.5c-1.105 0-2 .895-2 2v5.25zM12 8.25c0 .414.336.75.75.75h3.5a.75.75 0 00.75-.75V3c0-1.105-.895-2-2-2h-1.5C12.895 1 12 1.895 12 3v5.25z" /></svg>;
    }
     return <svg xmlns="http://www.w3.org/2000/svg" className={iconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
};

export const ShoppingList: React.FC<ShoppingListProps> = ({ categories, onItemChange, onDeleteItem, estimations, meatEstimateKg, bestDeals, masterList, onAddItems }) => {
  const [quickAddSearch, setQuickAddSearch] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const filteredMasterList = masterList.filter(item => 
    item.toLowerCase().includes(quickAddSearch.toLowerCase()) &&
    !categories.some(cat => cat.items.some(i => i.name.toLowerCase() === item.toLowerCase() && i.active !== false))
  ).slice(0, 5);

  const handleQuickAdd = (itemName: string) => {
    onAddItems([{ name: itemName, category: 'Outros' }]);
    setQuickAddSearch('');
    setShowQuickAdd(false);
  };

  const activeCategories = categories.filter(cat => cat.items.some(i => i.active !== false));

  if (activeCategories.length === 0 && !showQuickAdd) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-xl shadow-md border-4 border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-black text-slate-900 uppercase">Sua lista de compras está vazia</h3>
          <p className="mt-1 text-sm text-slate-500 font-bold">Adicione itens ou use "//" para buscar na lista padrão.</p>
          <button 
            onClick={() => setShowQuickAdd(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full font-black uppercase hover:bg-blue-700 transition-transform active:scale-95"
          >
            Buscar na Lista Padrão (//)
          </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {/* Quick Add Bar */}
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Digite // para buscar na lista padrão..."
                        value={quickAddSearch}
                        onChange={(e) => {
                            setQuickAddSearch(e.target.value);
                            if (e.target.value.startsWith('//')) {
                                setShowQuickAdd(true);
                            }
                        }}
                        className="w-full pl-10 pr-4 py-3 border-4 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 font-black uppercase text-sm"
                    />
                    <Search className="absolute left-3 top-3.5 text-slate-400" size={20} />
                </div>
                {showQuickAdd && (
                    <button 
                        onClick={() => { setShowQuickAdd(false); setQuickAddSearch(''); }}
                        className="bg-slate-200 text-slate-600 px-4 py-2 rounded-xl font-black uppercase text-xs hover:bg-slate-300"
                    >
                        Fechar
                    </button>
                )}
            </div>

            {showQuickAdd && quickAddSearch.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border-4 border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-slate-50 border-b-2 border-slate-100 flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sugestões da Lista Padrão</span>
                    </div>
                    {filteredMasterList.length > 0 ? (
                        <div className="divide-y-2 divide-slate-100">
                            {filteredMasterList.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuickAdd(item)}
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center justify-between group transition-colors"
                                >
                                    <span className="font-black text-slate-800 uppercase text-sm">{item}</span>
                                    <Plus size={18} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-400 font-bold text-sm italic">
                            Nenhum item encontrado na lista padrão.
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-left text-sm md:text-base font-black text-slate-500 uppercase tracking-widest bg-slate-100 rounded-t-lg border-b-4 border-slate-200">
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-center">Check</div>
            <div className="col-span-3">Produto</div>
            <div className="col-span-1 text-center">Qtd.</div>
            <div className="col-span-1 text-center">Estim.</div>
            <div className="col-span-2 text-center">Preço Unit.</div>
            <div className="col-span-1 text-center">Subtotal</div>
            <div className="col-span-1 text-right">Ações</div>
        </div>
        {/* Mobile Header */}
        <div className="grid md:hidden grid-cols-12 gap-x-1 px-2 py-2 text-center text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 rounded-t-lg border-b-4 border-slate-200">
            <div className="col-span-1">St.</div>
            <div className="col-span-1">Ck.</div>
            <div className="col-span-3 text-left">Produto</div>
            <div className="col-span-1">Qtd</div>
            <div className="col-span-2">Preço</div>
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-1"></div>
        </div>

        {activeCategories.map((category, index) => {
            let categoryInfo = null;
            if (category.name.toLowerCase() === 'carnes' && estimations.size > 0) {
                const totalOnList = category.items.reduce((sum, item) => sum + Number(item.quantity), 0);
                categoryInfo = (
                    <span className="ml-4 text-sm font-bold normal-case text-slate-600">
                        (Adicionado: {totalOnList.toFixed(1)}kg de {meatEstimateKg.toFixed(1)}kg estimados)
                    </span>
                );
            }

            return (
                <div key={category.id} className="mb-4 border-4 border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className={`flex items-center p-4 bg-slate-100 border-b-4 border-slate-200`}>
                    <CategoryIcon categoryName={category.name} className="text-blue-600" />
                    <h2 className={`text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight`}>{category.name}</h2>
                    {categoryInfo}
                </div>
                <div className="bg-white">
                    {(() => {
                        const items = category.items.filter(i => i.active !== false);
                        const markets = ['Atacadão', 'Supermarket', 'Dom Atacadista', 'Guanabara', ''];
                        return markets.map(market => {
                            const marketItems = items.filter(i => (i.market || '') === market);
                            if (marketItems.length === 0) return null;
                            return (
                                <div key={market}>
                                    {market && (
                                        <div className="bg-slate-100 px-4 py-2 font-black text-slate-800 uppercase text-sm border-b-2 border-slate-300 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {market}
                                        </div>
                                    )}
                                    {marketItems.map(item => (
                                        <ShoppingItemRow 
                                            key={item.id} 
                                            item={item} 
                                            onItemChange={onItemChange}
                                            onDeleteItem={onDeleteItem}
                                            estimation={estimations.get(item.name.toLowerCase())}
                                            bestDeal={bestDeals.get(item.name.toLowerCase())}
                                        />
                                    ))}
                                </div>
                            );
                        });
                    })()}
                </div>
                </div>
            );
        })}
    </div>
  );
};
