import React from 'react';
import type { Category, ShoppingItem, Deal } from '../types';
import { ShoppingItemRow } from './ShoppingItemRow';

interface ShoppingListProps {
  categories: Category[];
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number) => void;
  onDeleteItem: (itemId: number) => void;
  estimations: Map<string, { quantity: number; unit: string }>;
  meatEstimateKg: number;
  bestDeals: Map<string, Deal>;
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

export const ShoppingList: React.FC<ShoppingListProps> = ({ categories, onItemChange, onDeleteItem, estimations, meatEstimateKg, bestDeals }) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-white rounded-xl shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sua lista de compras está vazia</h3>
          <p className="mt-1 text-sm text-gray-500">Adicione itens usando o formulário acima.</p>
      </div>
    );
  }

  return (
    <div>
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-t-lg border-b">
            <div className="col-span-4">Produto</div>
            <div className="col-span-2 text-center">Qtd. Atual</div>
            <div className="col-span-2 text-center">Qtd. Estimada</div>
            <div className="col-span-2 text-center">Preço Unit.</div>
            <div className="col-span-1 text-center">Subtotal</div>
            <div className="col-span-1 text-right">Ações</div>
        </div>
        {/* Mobile Header */}
        <div className="grid md:hidden grid-cols-12 gap-x-1 px-2 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 rounded-t-lg border-b">
            <div className="col-span-3 text-left">Produto</div>
            <div className="col-span-2">Qtd. Atual</div>
            <div className="col-span-2">Qtd. Estimada</div>
            <div className="col-span-2">Preço</div>
            <div className="col-span-2">Subtotal</div>
            <div className="col-span-1"></div>
        </div>

        {categories.map((category, index) => {
            let categoryInfo = null;
            if (category.name.toLowerCase() === 'carnes' && estimations.size > 0) {
                const totalOnList = category.items.reduce((sum, item) => sum + Number(item.quantity), 0);
                categoryInfo = (
                    <span className="ml-4 text-sm font-normal normal-case text-gray-600">
                        (Adicionado: {totalOnList.toFixed(1)}kg de {meatEstimateKg.toFixed(1)}kg estimados)
                    </span>
                );
            }

            return (
                <div key={category.id} className="mb-2 border-t first:border-t-0">
                <div className={`flex items-center p-3 ${categoryColors[index % categoryColors.length].bg} ${categoryColors[index % categoryColors.length].border}`}>
                    <CategoryIcon categoryName={category.name} className={categoryColors[index % categoryColors.length].icon} />
                    <h2 className={`text-xl font-bold ${categoryColors[index % categoryColors.length].text}`}>{category.name}</h2>
                    {categoryInfo}
                </div>
                <div className="bg-white rounded-b-lg shadow-sm">
                    {category.items.map(item => (
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
                </div>
            );
        })}
    </div>
  );
};
