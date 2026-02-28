import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { ShoppingItem } from '../types';

interface AddItemFormProps {
  onAddItem: (item: Omit<ShoppingItem, 'id'>, category: string) => void;
  existingCategories: string[];
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, existingCategories, isVisible, setIsVisible }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categoryInputContainerRef = useRef<HTMLDivElement>(null);

  const filteredCategories = useMemo(() => {
    if (!category.trim()) {
      return existingCategories;
    }
    return existingCategories.filter(cat =>
      cat.toLowerCase().includes(category.toLowerCase())
    );
  }, [category, existingCategories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryInputContainerRef.current && !categoryInputContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      alert("Por favor, preencha o nome do produto e a categoria.");
      return;
    }
    onAddItem({ name, quantity, price }, category);
    // Reset local form state, parent will handle closing the form
    setName('');
    setQuantity(1);
    setPrice(0);
    setCategory('');
    setIsDropdownOpen(false);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    if (!isDropdownOpen) {
        setIsDropdownOpen(true);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setIsDropdownOpen(false);
  };

  if (!isVisible) {
      return (
        <div className="container mx-auto px-4">
            <div className="text-center py-4">
                <button
                    onClick={() => setIsVisible(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar Novo Item
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4">
        <div className="bg-white p-4 md:p-6 rounded-b-xl shadow-md">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Adicionar Novo Item à Lista</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Leite Integral"
                required
              />
            </div>
            <div className="relative" ref={categoryInputContainerRef}>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={handleCategoryChange}
                onFocus={() => setIsDropdownOpen(true)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ex: Laticínios"
                required
                autoComplete="off"
              />
               {isDropdownOpen && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat, index) => (
                      <li 
                        key={index} 
                        className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-indigo-50 hover:text-indigo-900"
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {cat}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-gray-500 italic">
                      Digite para criar uma nova categoria.
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex gap-4">
                <button type="submit" className="flex-1 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Adicionar
                </button>
                <button type="button" onClick={() => setIsVisible(false)} className="flex-1 justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Cancelar
                </button>
            </div>
          </form>
        </div>
    </div>
  );
};
