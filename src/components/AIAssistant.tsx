import React, { useState, useEffect } from 'react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
  estimations: [string, { quantity: number; unit: string }][];
  isLoading: boolean;
  onAddItems: (items: { name: string; quantity: number }[]) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onGenerate, estimations, isLoading, onAddItems }) => {
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (estimations.length > 0) {
      const newQuantities = new Map<string, number>();
      estimations.forEach(([name, details]) => {
        newQuantities.set(name, details.quantity);
      });
      setQuantities(newQuantities);
    }
  }, [estimations]);

  const handleQuantityChange = (name: string, value: string) => {
    const newQuantities = new Map(quantities);
    const numValue = parseInt(value, 10);
    newQuantities.set(name, isNaN(numValue) ? 0 : numValue);
    setQuantities(newQuantities);
  };

  const handleAddClick = () => {
    const itemsToAdd = Array.from(quantities.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .filter(item => item.quantity > 0);
    
    onAddItems(itemsToAdd);
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            Assistente de Compras IA
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">A IA está calculando sua lista ideal... Isso pode levar alguns segundos.</p>
            </div>
          ) : estimations.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Ajuste as quantidades conforme necessário e adicione os itens à sua lista de compras.
              </p>
              <div className="max-h-80 overflow-y-auto pr-2 border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estimativa IA</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Adicionar à Lista</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {estimations.map(([name, details]) => (
                        <tr key={name}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{details.quantity} {details.unit}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <input
                                    type="number"
                                    value={quantities.get(name) || 0}
                                    onChange={(e) => handleQuantityChange(name, e.target.value)}
                                    className="w-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-center"
                                    min="0"
                                />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="text-center">
                <p className="text-gray-700 mb-4">
                    Receba uma estimativa personalizada de quanto comprar de cada item para o mês, com base nos hábitos de consumo da sua família.
                </p>
                <button
                    onClick={onGenerate}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    Gerar Estimativa Mensal
                </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fechar
          </button>
          {estimations.length > 0 && !isLoading && (
             <button
                onClick={handleAddClick}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             >
                Adicionar Itens à Lista
             </button>
          )}
        </div>
      </div>
    </div>
  );
};
