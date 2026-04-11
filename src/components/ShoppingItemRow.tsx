import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2, TrendingDown, Power, PowerOff, CheckCircle2, Circle } from 'lucide-react';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number | boolean) => void;
  onDeleteItem: (itemId: number) => void;
  estimation?: { quantity: number; unit: string };
  bestDeal?: { price: number; market: string; date: string };
}

export const ShoppingItemRow: React.FC<ShoppingItemRowProps> = ({
  item,
  onItemChange,
  onDeleteItem,
  estimation,
  bestDeal,
}) => {
  const subtotal = item.quantity * item.price;
  const isActive = item.active !== false; // Default to true
  const isChecked = item.checked === true;

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
    <div className={`grid grid-cols-12 gap-2 px-2 md:px-4 py-4 items-center border-b-2 border-slate-100 last:border-b-0 text-sm transition-all relative ${!isActive ? 'opacity-40 grayscale bg-slate-50' : ''} ${isChecked ? 'bg-green-50/50' : 'hover:bg-slate-50'}`}>
      
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

      {/* Product Name */}
      <div className={`col-span-3 md:col-span-3 font-black text-slate-900 truncate ${isChecked ? 'line-through text-slate-400' : ''}`}>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg md:text-xl font-black text-slate-900 uppercase"
          disabled={!isActive}
        />
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

      {/* Current Quantity */}
      <div className="col-span-1 text-center">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onItemChange(item.id, 'quantity', Number(e.target.value))}
          className="w-full text-center bg-slate-100 border-2 border-slate-300 rounded-lg py-1 px-1 text-base md:text-lg font-black focus:ring-blue-500 focus:border-blue-500"
          min="0"
          disabled={!isActive}
        />
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
            value={item.price}
            onChange={(e) => onItemChange(item.id, 'price', Number(e.target.value))}
            onKeyDown={handleKeyDown}
            className={`block w-full rounded-lg border-2 border-slate-300 pl-7 pr-2 py-1 text-base md:text-lg font-black focus:border-blue-500 focus:ring-blue-500 text-right ${bestDeal && item.price > bestDeal.price ? 'text-red-600' : 'text-slate-900'}`}
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
