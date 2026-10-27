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
    <div ref={rowRef} className={`grid grid-cols-12 gap-1 px-1 md:px-4 py-2 items-center border-b-2 border-slate-100 last:border-b-0 text-xs transition-all relative ${!isActive ? 'opacity-40 grayscale bg-slate-50' : ''} ${isChecked ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}>
      
      {/* Toggle Active/Inactive */}
      <div className="col-span-1 flex justify-center">
        <button 
          onClick={() => onItemChange(item.id, 'active', !isActive)}
          className={`p-1.5 rounded-full transition-colors ${isActive ? 'bg-red-600 text-white' : 'bg-slate-300 text-slate-700'}`}
          title={isActive ? "Desligar" : "Ligar"}
        >
          <Power size={14} />
        </button>
      </div>

      {/* Product Name (compacted) */}
      <div className={`col-span-3 font-black text-slate-900 truncate ${isChecked ? 'line-through text-slate-400' : ''}`}>
        <input
          type="text"
          value={localItem.name}
          onChange={(e) => setLocalItem({...localItem, name: e.target.value})}
          onBlur={() => handleBlur('name', localItem.name)}
          className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs font-black text-slate-900 uppercase"
          disabled={!isActive}
        />
      </div>

      {/* Current Quantity Stepper (compacted) */}
      <div className="col-span-2 flex items-center justify-center gap-0.5">
        <button
          onClick={() => {
            const newQty = Math.max(0, localItem.quantity - 1);
            setLocalItem({...localItem, quantity: newQty});
            onItemChange(item.id, 'quantity', newQty);
          }}
          disabled={!isActive}
          className="w-6 h-6 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-black rounded flex items-center justify-center text-xs transition-transform active:scale-95"
          title="Diminuir"
        >
          -
        </button>
        <span className="w-5 text-center font-black text-xs text-slate-900">
          {localItem.quantity}
        </span>
        <button
          onClick={() => {
            const newQty = localItem.quantity + 1;
            setLocalItem({...localItem, quantity: newQty});
            onItemChange(item.id, 'quantity', newQty);
          }}
          disabled={!isActive}
          className="w-6 h-6 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black rounded flex items-center justify-center text-xs transition-transform active:scale-95"
          title="Aumentar"
        >
          +
        </button>
      </div>

      {/* Unit Price (compacted) */}
      <div className="col-span-3">
        <input
          type="text"
          inputMode="decimal"
          data-type="price"
          value={localItem.price.toString().replace('.', ',')}
          onChange={(e) => {
            const val = e.target.value.replace('.', ',');
            // Only allow digits and one comma
            if (/^\d*,?\d*$/.test(val)) {
                // If it starts with 0 and is more than one digit (and not just "0,"), remove the leading 0
                const sanitized = val.length > 1 && val.startsWith('0') && !val.startsWith('0,') ? val.substring(1) : val;
                setLocalItem({...localItem, price: parseFloat(sanitized.replace(',', '.') || '0')});
            }
          }}
          onBlur={() => handleBlur('price', localItem.price)}
          onKeyDown={handleKeyDown}
          className={`block w-full rounded border border-slate-300 px-1 py-1 text-xs font-black focus:border-red-500 focus:ring-red-500 text-right ${bestDeal && localItem.price > bestDeal.price ? 'text-red-600' : 'text-slate-900'}`}
          disabled={!isActive}
        />
      </div>

      {/* Subtotal */}
      <div className="col-span-2 text-right font-black text-slate-900 text-xs truncate">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
      </div>

      {/* Actions */}
      <div className="col-span-1 text-right">
        <button
          onClick={() => onDeleteItem(item.id)}
          className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
