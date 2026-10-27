import React, { useState, useEffect, useRef } from 'react';
import { ShoppingItem, Category } from '../types';
import { Trash2, TrendingDown, Power, PowerOff, CheckCircle2, Circle } from 'lucide-react';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number | boolean) => void;
  onDeleteItem: (itemId: number) => void;
  estimation?: { quantity: number; unit: string };
  bestDeal?: { price: number; market: string; date: string };
  categories: Category[];
  onCategoryChange: (itemId: number, newCategoryName: string) => void;
}

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
  item,
  onItemChange,
  onDeleteItem,
  estimation,
  bestDeal,
  categories,
  onCategoryChange,
}) => {
  const [localItem, setLocalItem] = useState(item);
  const [localCategory, setLocalCategory] = useState(categories.find(c => c.items.some(i => i.id === item.id))?.name || '');
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFocusedInside = rowRef.current && rowRef.current.contains(document.activeElement);
    if (!isFocusedInside) {
      setLocalItem(item);
      setLocalCategory(categories.find(c => c.items.some(i => i.id === item.id))?.name || '');
    }
  }, [item, categories]);

  const subtotal = localItem.quantity * localItem.price;
  const isActive = localItem.active !== false; // Default to true
  const isChecked = localItem.checked === true;

  const handleBlur = (field: keyof ShoppingItem, value: string | number | boolean) => {
    if (value !== item[field]) {
      onItemChange(item.id, field, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onItemChange(item.id, 'checked', true);
      
      // Find all price inputs and focus the next one
      const priceInputs = Array.from(document.querySelectorAll('input[data-type="price"]')) as HTMLInputElement[];
      const currentIndex = priceInputs.indexOf(e.currentTarget);
      if (currentIndex > -1 && currentIndex < priceInputs.length - 1) {
        priceInputs[currentIndex + 1].focus();
        priceInputs[currentIndex + 1].select();
      }
    }
  };

  return (
    <div ref={rowRef} className={`grid grid-cols-12 gap-2 px-2 md:px-4 py-4 items-center border-b-2 border-slate-100 last:border-b-0 text-sm transition-all relative ${!isActive ? 'opacity-40 grayscale bg-slate-50' : ''} ${isChecked ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}>
      
      {/* Toggle Active/Inactive (Ligar/Desligar) */}
      <div className="col-span-1 flex justify-center">
        <button 
          onClick={() => onItemChange(item.id, 'active', !isActive)}
          className={`p-2 rounded-full transition-colors ${isActive ? 'text-blue-600 hover:bg-blue-100' : 'text-slate-400 hover:bg-slate-200'}`}
          title={isActive ? "Desligar (Não comprar agora)" : "Ligar (Comprar agora)"}
        >
          {isActive ? <Power size={20} /> : <PowerOff size={20} />}
        </button>
      </div>

      {/* Checkbox (only if active) */}
      <div className="col-span-1 flex justify-center">
        {isActive && (
          <button 
            onClick={() => onItemChange(item.id, 'checked', !isChecked)}
            className={`transition-colors ${isChecked ? 'text-green-600' : 'text-slate-300 hover:text-green-500'}`}
          >
            {isChecked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </button>
        )}
      </div>

      {/* Product Name and Category */}
      <div className={`col-span-3 md:col-span-3 font-black text-slate-900 truncate ${isChecked ? 'line-through text-slate-400' : ''}`}>
        <input
          type="text"
          value={localItem.name}
          onChange={(e) => setLocalItem({...localItem, name: e.target.value})}
          onBlur={() => handleBlur('name', localItem.name)}
          className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg md:text-xl font-black text-slate-900 uppercase"
          disabled={!isActive}
        />
        <select
          value={localCategory}
          onChange={(e) => onCategoryChange(item.id, e.target.value)}
          className="w-full text-xs bg-slate-100 rounded p-1 mt-1 font-bold text-slate-600"
          disabled={!isActive}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <select
          value={localItem.market || ''}
          onChange={(e) => {
            setLocalItem({...localItem, market: e.target.value});
            onItemChange(item.id, 'market', e.target.value);
          }}
          className="w-full text-xs bg-slate-100 rounded p-1 mt-1 font-bold text-slate-600"
          disabled={!isActive}
        >
          <option value="">Local de compra</option>
          <option value="Atacadão">Atacadão</option>
          <option value="Supermarket">Supermarket</option>
          <option value="Dom Atacadista">Dom Atacadista</option>
          <option value="Guanabara">Guanabara</option>
        </select>
        {bestDeal && isActive && (
          <div className="flex flex-col mt-1">
            <div className="flex items-center text-xs md:text-sm text-green-600 font-black animate-pulse uppercase">
                <TrendingDown size={14} className="mr-1" />
                Melhor Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bestDeal.price)}
            </div>
            <div className="text-xs md:text-sm text-blue-600 font-black uppercase tracking-tighter">
                Loja: {bestDeal.market}
            </div>
          </div>
        )}
      </div>

      {/* Current Quantity Stepper */}
      <div className="col-span-2 md:col-span-2 flex items-center justify-center gap-1">
        <button
          onClick={() => {
            const newQty = Math.max(0, localItem.quantity - 1);
            setLocalItem({...localItem, quantity: newQty});
            onItemChange(item.id, 'quantity', newQty);
          }}
          disabled={!isActive}
          className="w-7 h-7 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-black rounded-lg flex items-center justify-center text-sm transition-transform active:scale-95 shadow-sm"
          title="Diminuir"
        >
          -
        </button>
        <span className="w-8 text-center font-black text-base md:text-lg text-slate-900">
          {localItem.quantity}
        </span>
        <button
          onClick={() => {
            const newQty = localItem.quantity + 1;
            setLocalItem({...localItem, quantity: newQty});
            onItemChange(item.id, 'quantity', newQty);
          }}
          disabled={!isActive}
          className="w-7 h-7 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-lg flex items-center justify-center text-sm transition-transform active:scale-95 shadow-sm"
          title="Aumentar"
        >
          +
        </button>
      </div>

      {/* Estimated Quantity */}
      <div className="col-span-1 text-center text-slate-500 text-sm md:text-base font-bold hidden md:block">
        {estimation ? (
          <span>{estimation.quantity} {estimation.unit}</span>
        ) : (
          <span className="text-slate-300">-</span>
        )}
      </div>

      {/* Unit Price */}
      <div className="col-span-2 text-center">
        <div className="relative rounded-lg shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <span className="text-slate-500 text-sm md:text-base font-black">R$</span>
          </div>
          <input
            type="number"
            data-type="price"
            value={localItem.price}
            onChange={(e) => setLocalItem({...localItem, price: Number(e.target.value)})}
            onBlur={() => handleBlur('price', localItem.price)}
            onKeyDown={handleKeyDown}
            className={`block w-full rounded-lg border-2 border-slate-300 pl-7 pr-2 py-1 text-base md:text-lg font-black focus:border-blue-500 focus:ring-blue-500 text-right ${bestDeal && localItem.price > bestDeal.price ? 'text-red-600' : 'text-slate-900'}`}
            min="0"
            step="0.01"
            disabled={!isActive}
          />
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-2 md:col-span-1 text-center font-black text-slate-900 text-base md:text-lg">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
      </div>

      {/* Actions */}
      <div className="col-span-1 text-right">
        <button
          onClick={() => onDeleteItem(item.id)}
          className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
