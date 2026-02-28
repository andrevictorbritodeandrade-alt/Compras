import React from 'react';
import { ShoppingItem } from '../types';
import { Trash2, TrendingDown } from 'lucide-react';

interface ShoppingItemRowProps {
  item: ShoppingItem;
  onItemChange: (itemId: number, field: keyof ShoppingItem, value: string | number) => void;
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

  return (
    <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center border-b last:border-b-0 text-sm hover:bg-gray-50 transition-colors relative">
      {/* Product Name */}
      <div className="col-span-3 md:col-span-4 font-medium text-gray-900 truncate">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-gray-900"
        />
        {bestDeal && (
          <div className="flex items-center text-xs text-green-600 mt-1 font-medium animate-pulse">
            <TrendingDown size={12} className="mr-1" />
            Melhor: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bestDeal.price)} ({bestDeal.market})
          </div>
        )}
      </div>

      {/* Current Quantity */}
      <div className="col-span-2 text-center">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => onItemChange(item.id, 'quantity', Number(e.target.value))}
          className="w-full text-center bg-gray-50 border border-gray-300 rounded-md py-1 px-2 text-xs focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
        />
      </div>

      {/* Estimated Quantity */}
      <div className="col-span-2 text-center text-gray-500 text-xs">
        {estimation ? (
          <span>{estimation.quantity} {estimation.unit}</span>
        ) : (
          <span className="text-gray-300">-</span>
        )}
      </div>

      {/* Unit Price */}
      <div className="col-span-2 text-center">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-1">
            <span className="text-gray-500 sm:text-xs">R$</span>
          </div>
          <input
            type="number"
            value={item.price}
            onChange={(e) => onItemChange(item.id, 'price', Number(e.target.value))}
            className={`block w-full rounded-md border-gray-300 pl-5 pr-1 py-1 text-xs focus:border-indigo-500 focus:ring-indigo-500 text-right ${bestDeal && item.price > bestDeal.price ? 'text-red-500 font-medium' : ''}`}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-2 md:col-span-1 text-center font-medium text-gray-900">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
      </div>

      {/* Actions */}
      <div className="col-span-1 text-right">
        <button
          onClick={() => onDeleteItem(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
