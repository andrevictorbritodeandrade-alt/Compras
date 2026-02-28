import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ShoppingList } from './components/ShoppingList';
import { MonthTabs } from './components/MonthTabs';
import { SummaryBar } from './components/SummaryBar';
import { AddItemForm } from './components/AddItemForm';
import { Encartes } from './components/Encartes';
import { INITIAL_CATEGORIES } from './constants';
import type { Category, ShoppingItem, Estimation, Deal } from './types';
import { db } from './firebase/config';
import { doc, onSnapshot, setDoc, updateDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { Logo } from './components/Logo';
import { GoogleGenAI } from '@google/genai';
import { AIAssistant } from './components/AIAssistant';
import { ShoppingCart, Tag } from 'lucide-react';
import { INITIAL_DEALS } from './data/initialDeals';

// Define a type for the BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const App: React.FC = () => {
  const [activeMonth, setActiveMonth] = useState<string>('November');

  // Seed initial deals
  useEffect(() => {
    const seedDeals = async () => {
      try {
        const dealsRef = collection(db, 'encartes');
        const snapshot = await getDocs(dealsRef);
        
        if (snapshot.empty) {
          console.log('Seeding initial deals...');
          const batch = writeBatch(db);
          
          INITIAL_DEALS.forEach(deal => {
            const docRef = doc(dealsRef);
            // Remove the id from the deal object as Firestore generates a new one, 
            // or use the provided id as the doc id. Let's use the provided ID for consistency if possible,
            // but the Deal type has an ID.
            // Let's just add them.
            const { id, ...dealData } = deal;
            batch.set(docRef, dealData);
          });
          
          await batch.commit();
          console.log('Initial deals seeded successfully.');
        }
      } catch (error) {
        console.error('Error seeding deals:', error);
      }
    };
    
    seedDeals();
  }, []);
  const [currentShoppingList, setCurrentShoppingList] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAddItemFormVisible, setIsAddItemFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'encartes'>('list');

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [estimations, setEstimations] = useState<Map<string, { quantity: number; unit: string }>>(new Map());
  const [isEstimating, setIsEstimating] = useState(false);
  
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('Service Worker registered: ', registration))
          .catch(registrationError => console.log('Service Worker registration failed: ', registrationError));
      });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPromptEvent(null);
      });
    } else {
      alert('A instalação do aplicativo não está disponível neste navegador ou o aplicativo já foi instalado.');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const docRef = doc(db, 'shoppingLists', activeMonth);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const categoriesFromDb = data.categories as Category[];
        const dealsFromDb = (data.deals as Deal[]) || [];
        
        // Sort items within each category for consistent display
        const sortedCategories = categoriesFromDb.map(category => ({
          ...category,
          items: [...category.items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
        }));
        setCurrentShoppingList(sortedCategories);
        setDeals(dealsFromDb);
      } else {
        console.log(`No document for ${activeMonth}, creating one.`);
        setDoc(docRef, { categories: INITIAL_CATEGORIES, deals: [] });
        setCurrentShoppingList(INITIAL_CATEGORIES);
        setDeals([]);
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching document:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [activeMonth]);

  const handleMonthChange = useCallback((month: string) => {
    setActiveMonth(month);
  }, []);
  
  const handleItemChange = useCallback(async (itemId: number, field: keyof ShoppingItem, value: string | number) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newCategories = JSON.parse(JSON.stringify(currentShoppingList));
    
    let itemFound = false;
    for (const category of newCategories) {
        for (const item of category.items) {
            if (item.id === itemId) {
                (item as any)[field] = value;
                if (field === 'quantity' || field === 'price') {
                    item.quantity = Number(isNaN(parseFloat(String(item.quantity))) ? 0 : item.quantity);
                    item.price = Number(isNaN(parseFloat(String(item.price))) ? 0 : item.price);
                }
                itemFound = true;
                break;
            }
        }
        if (itemFound) break;
    }
    
    await updateDoc(docRef, { categories: newCategories });
  }, [activeMonth, currentShoppingList]);

  const handleDeleteItem = useCallback(async (itemId: number) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    
    const newCategories = currentShoppingList.map(category => ({
        ...category,
        items: category.items.filter(item => item.id !== itemId)
    })).filter(category => category.items.length > 0);

    await updateDoc(docRef, { categories: newCategories });
  }, [activeMonth, currentShoppingList]);
  
  const handleAddItem = useCallback(async (newItem: Omit<ShoppingItem, 'id'>, categoryName: string) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newCategories = JSON.parse(JSON.stringify(currentShoppingList));
    
    const categoryIndex = newCategories.findIndex((cat: Category) => cat.name.toLowerCase() === categoryName.toLowerCase());
      
    const itemToAdd: ShoppingItem = {
      ...newItem,
      id: Date.now(),
    };

    if (categoryIndex > -1) {
      newCategories[categoryIndex].items.push(itemToAdd);
      // Re-sort the items list to maintain alphabetical order
      newCategories[categoryIndex].items.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    } else {
      newCategories.push({
        id: Date.now() + 1,
        name: categoryName,
        items: [itemToAdd]
      });
    }

    await updateDoc(docRef, { categories: newCategories });
    setIsAddItemFormVisible(false); // Close form after adding
  }, [activeMonth, currentShoppingList]);

  const handleAddDeal = useCallback(async (newDeal: Omit<Deal, 'id'>) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const dealToAdd: Deal = {
      ...newDeal,
      id: Date.now().toString(),
    };
    const newDeals = [...deals, dealToAdd];
    await updateDoc(docRef, { deals: newDeals });
  }, [activeMonth, deals]);

  const handleDeleteDeal = useCallback(async (dealId: string) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newDeals = deals.filter(d => d.id !== dealId);
    await updateDoc(docRef, { deals: newDeals });
  }, [activeMonth, deals]);

  const handleGenerateEstimations = async () => {
    setIsEstimating(true);
    setEstimations(new Map());
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const allItemNames = INITIAL_CATEGORIES.flatMap(cat => cat.items.map(item => `"${item.name}"`)).join(', ');
        
        const prompt = `
            Você é um assistente de IA para um aplicativo de lista de compras. Sua tarefa é estimar a quantidade mensal (para um período de 31 dias) necessária para vários itens de supermercado para uma família específica, com base nos hábitos de consumo e no conhecimento geral dos costumes de consumo brasileiros.

            Perfil da Família:
            - Adultos: 2
            - Considerações alimentares especiais: Um adulto é bariátrico e come porções menores.

            Hábitos de Consumo Detalhado:
            - Refeições com carne (almoço e jantar): 2 por dia.
            - Porção de carne do adulto bariátrico por refeição: 100g.
            - Porção de carne do outro adulto por refeição: 200g.
            - Consumo de açúcar: aproximadamente 1kg por mês.
            - Consumo de café: aproximadamente 1kg por mês.

            Com base nessas informações, estime a quantidade necessária para os seguintes itens durante 31 dias. Forneça a quantidade e a unidade apropriada (ex: kg, L, un, pacote, dúzia).

            Lista de Itens para Estimar:
            ${allItemNames}

            Responda APENAS com um objeto JSON válido com a seguinte estrutura:
            {
              "estimations": [
                {
                  "name": "Nome do Item",
                  "estimatedQuantity": 1,
                  "unit": "kg"
                }
              ]
            }
        `;

        const response = await ai.models.generateContent({ 
            model: 'gemini-2.5-flash', 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const result = JSON.parse(response.text);
        const newEstimations = new Map<string, { quantity: number; unit: string }>();
        if (result.estimations) {
            result.estimations.forEach((e: Estimation) => {
                newEstimations.set(e.name.toLowerCase(), { quantity: e.estimatedQuantity, unit: e.unit });
            });
        }
        setEstimations(newEstimations);
    } catch (error) {
        console.error("Error generating estimations:", error);
        alert("Ocorreu um erro ao gerar as estimativas com a IA. Verifique o console para mais detalhes.");
    } finally {
        setIsEstimating(false);
    }
  };

  const itemToCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    INITIAL_CATEGORIES.forEach(category => {
      category.items.forEach(item => {
        map.set(item.name.toLowerCase(), category.name);
      });
    });
    return map;
  }, []);

  const handleAddItemsFromAI = useCallback(async (itemsToAdd: { name: string; quantity: number }[]) => {
    const docRef = doc(db, 'shoppingLists', activeMonth);
    const newCategories = JSON.parse(JSON.stringify(currentShoppingList));

    itemsToAdd.forEach((itemToAdd, index) => {
      if (itemToAdd.quantity <= 0) return;

      const categoryName = itemToCategoryMap.get(itemToAdd.name.toLowerCase());
      if (!categoryName) {
        console.warn(`Category not found for item: ${itemToAdd.name}`);
        return;
      }

      let category = newCategories.find((cat: Category) => cat.name === categoryName);

      if (!category) {
        const initialCategory = INITIAL_CATEGORIES.find(c => c.name === categoryName);
        category = {
          id: initialCategory ? initialCategory.id : Date.now() + index,
          name: categoryName,
          items: []
        };
        newCategories.push(category);
      }

      let item = category.items.find((i: ShoppingItem) => i.name.toLowerCase() === itemToAdd.name.toLowerCase());

      if (item) {
        item.quantity = itemToAdd.quantity;
      } else {
        const newItem: ShoppingItem = {
          id: Date.now() + 1000 + index,
          name: itemToAdd.name,
          quantity: itemToAdd.quantity,
          price: 0
        };
        category.items.push(newItem);
        category.items.sort((a: ShoppingItem, b: ShoppingItem) => a.name.localeCompare(b.name, 'pt-BR'));
      }
    });

    await updateDoc(docRef, { categories: newCategories });
    setIsAIAssistantOpen(false);

  }, [activeMonth, currentShoppingList, itemToCategoryMap]);


  const totalCost = useMemo(() => {
    if (!currentShoppingList) return 0;
    return currentShoppingList.reduce((total, category) => {
      return total + category.items.reduce((categoryTotal, item) => {
        return categoryTotal + (Number(item.quantity) * Number(item.price));
      }, 0);
    }, 0);
  }, [currentShoppingList]);

  const allCategories = useMemo(() => {
    if (!currentShoppingList) return [];
    return [...new Set(currentShoppingList.map(cat => cat.name))];
  }, [currentShoppingList]);

  const allItemNames = useMemo(() => {
    if (!currentShoppingList) return [];
    return currentShoppingList.flatMap(cat => cat.items.map(item => item.name));
  }, [currentShoppingList]);

  // (100g bariatric + 200g other) * 2 meals/day * 31 days
  const meatEstimateKg = useMemo(() => (0.3 * 2 * 31), []);

  const bestDeals = useMemo(() => {
    const best = new Map<string, Deal>();
    deals.forEach(deal => {
        const key = deal.itemName.toLowerCase();
        const currentBest = best.get(key);
        if (!currentBest || deal.price < currentBest.price) {
            best.set(key, deal);
        }
    });
    return best;
  }, [deals]);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-violet-400 to-white">
      <header className="bg-transparent text-slate-800">
        <div className="container mx-auto px-4 pt-8 pb-4 flex flex-col items-center">
            <Logo className="h-16 w-16 mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">Compras do Mês</h1>
            <div className="flex items-center gap-4">
                <p className="text-violet-700 mt-2">Seu assistente pessoal de orçamento de compras</p>
            </div>
            <div className="flex gap-4 mt-4">
                 <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Instalar App
                  </button>
                <button
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    Estimar com IA
                </button>
            </div>
        </div>
         <MonthTabs activeMonth={activeMonth} onMonthChange={handleMonthChange} />
      </header>
      
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onGenerate={handleGenerateEstimations}
        estimations={Array.from(estimations.entries())}
        isLoading={isEstimating}
        onAddItems={handleAddItemsFromAI}
      />
      
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-center space-x-4">
            <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === 'list' 
                    ? 'bg-white text-violet-700 shadow-md' 
                    : 'bg-white/30 text-slate-700 hover:bg-white/50'
                }`}
            >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Lista de Compras
            </button>
            <button
                onClick={() => setActiveTab('encartes')}
                className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === 'encartes' 
                    ? 'bg-white text-violet-700 shadow-md' 
                    : 'bg-white/30 text-slate-700 hover:bg-white/50'
                }`}
            >
                <Tag className="w-5 h-5 mr-2" />
                Encartes
            </button>
        </div>
      </div>

      <main className="container mx-auto p-4 pb-24">
        {isLoading ? (
             <div className="text-center py-10">
                <p className="text-lg text-gray-400">Carregando...</p>
             </div>
        ) : (
            <>
                {activeTab === 'list' && (
                    <>
                         <div className={`sticky top-0 z-20 transition-all duration-300 mb-6 ${isAddItemFormVisible ? 'bg-slate-50 shadow-sm' : 'bg-transparent'}`}>
                            <AddItemForm 
                                onAddItem={handleAddItem} 
                                existingCategories={allCategories}
                                isVisible={isAddItemFormVisible}
                                setIsVisible={setIsAddItemFormVisible} 
                            />
                        </div>
                        <ShoppingList 
                            categories={currentShoppingList} 
                            onItemChange={handleItemChange}
                            onDeleteItem={handleDeleteItem}
                            estimations={estimations}
                            meatEstimateKg={meatEstimateKg}
                            bestDeals={bestDeals}
                        />
                    </>
                )}
                {activeTab === 'encartes' && (
                    <Encartes 
                        deals={deals} 
                        onAddDeal={handleAddDeal} 
                        onDeleteDeal={handleDeleteDeal}
                        existingItemNames={allItemNames}
                        shoppingList={currentShoppingList}
                    />
                )}
            </>
        )}
      </main>
      
      {activeTab === 'list' && <SummaryBar total={totalCost} />}
    </div>
  );
};

export default App;
