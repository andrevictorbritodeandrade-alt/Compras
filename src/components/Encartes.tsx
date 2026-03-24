import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  ChevronRight, 
  Apple, 
  Beef, 
  Milk, 
  Fish, 
  Beer, 
  Sparkles, 
  LayoutGrid, 
  Store, 
  Info,
  Package,
  X,
  Plus,
  Minus,
  Navigation,
  CheckCircle2,
  Tag,
  Zap,
  ShoppingBag,
  Filter,
  ArrowRight,
  TrendingDown,
  Percent,
  MessageSquare,
  Utensils,
  Bot,
  Send,
  Loader2
} from 'lucide-react';
import { Deal, Category } from '../types';

// --- Gemini API Configuration ---
const apiKey = process.env.GEMINI_API_KEY || "";

async function callGemini(prompt: string, systemInstruction = "") {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar isso agora.";
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

const CATEGORIES = [
  { name: "Tudo", icon: <LayoutGrid size={18} /> },
  { name: "Mercearia", icon: <Package size={18} /> },
  { name: "Açougue", icon: <Beef size={18} /> },
  { name: "Hortifruti", icon: <Apple size={18} /> },
  { name: "Laticínios", icon: <Milk size={18} /> },
  { name: "Pescados", icon: <Fish size={18} /> },
  { name: "Limpeza", icon: <Sparkles size={18} /> },
  { name: "Higiene", icon: <ShoppingBag size={18} /> },
  { name: "Bebidas", icon: <Beer size={18} /> }
];

interface EncartesProps {
  deals: Deal[];
  onAddDeal: (deal: Omit<Deal, 'id'>) => void;
  onDeleteDeal: (dealId: string) => void;
  existingItemNames: string[];
  shoppingList: Category[];
}

export const Encartes: React.FC<EncartesProps> = ({ deals, onAddDeal, onDeleteDeal, existingItemNames, shoppingList }) => {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("Tudo");
  const [activeMarket, setActiveMarket] = useState("Todos");
  
  // Gemini AI States
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState([
    { role: "assistant", content: "Olá! Sou seu assistente de ofertas ✨. Posso te ajudar a comparar preços, sugerir onde é melhor fazer churrasco ou analisar sua economia. Em que posso ajudar hoje?" }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  const filteredItems = useMemo(() => {
    return deals.filter(p => {
      const matchSearch = p.itemName.toLowerCase().includes(search.toLowerCase());
      const matchMarket = activeMarket === "Todos" || p.market === activeMarket;
      // Note: Category is not in the Deal type, but we can infer it or add it if needed.
      // For now, let's just filter by search and market.
      return matchSearch && matchMarket;
    }).sort((a, b) => a.price - b.price);
  }, [search, activeMarket, deals]);

  const handleAssistantSend = async () => {
    if (!assistantInput.trim() || isAssistantLoading) return;
    
    const userMsg = { role: "user", content: assistantInput };
    setAssistantMessages(prev => [...prev, userMsg]);
    setAssistantInput("");
    setIsAssistantLoading(true);

    const systemPrompt = `Você é um especialista em economia doméstica e compras de supermercado em Maricá, RJ. 
    Abaixo estão os dados dos encartes atuais: ${JSON.stringify(deals)}. 
    Sua missão é ajudar o usuário a economizar, comparar preços e dar dicas. 
    Seja amigável, conciso e use emojis. Responda sempre em Português.`;

    try {
      const response = await callGemini(assistantInput, systemPrompt);
      setAssistantMessages(prev => [...prev, { role: "assistant", content: response || "" }]);
    } catch (err) {
      setAssistantMessages(prev => [...prev, { role: "assistant", content: "Ops, tive um problema na conexão. Pode tentar de novo? 😅" }]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const isItemInList = (itemName: string) => {
    return shoppingList.some(cat => cat.items.some(item => item.name.toLowerCase() === itemName.toLowerCase()));
  };

  const markets = useMemo(() => {
    const m = new Set(deals.map(d => d.market));
    return ["Todos", ...Array.from(m)];
  }, [deals]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Encartes e Ofertas</h2>
        <button 
          onClick={() => setIsAssistantOpen(true)}
          className="bg-violet-600 text-white p-3 rounded-full shadow-lg hover:bg-violet-700 transition-all"
        >
          <Bot size={24} />
        </button>
      </div>

      <div className="relative">
        <input 
          type="text"
          placeholder="Buscar ofertas..."
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-violet-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-4 top-4 text-slate-400" size={20} />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {markets.map(m => (
          <button
            key={m}
            onClick={() => setActiveMarket(m)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeMarket === m 
              ? "bg-violet-600 border-violet-600 text-white shadow-md" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((p) => {
          const inList = isItemInList(p.itemName);
          return (
            <div 
              key={p.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all hover:shadow-md relative flex flex-col justify-between ${
                inList ? "border-green-500 bg-green-50/30" : "border-transparent"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {p.market}
                  </span>
                  {inList && (
                    <span className="flex items-center text-[10px] font-bold text-green-600">
                      <CheckCircle2 size={12} className="mr-1" /> NA LISTA
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">
                  {p.itemName}
                </h3>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Preço</span>
                  <span className="text-2xl font-black text-violet-600">
                    R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  onClick={() => onDeleteDeal(p.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assistant Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-2xl rounded-t-[48px] sm:rounded-3xl flex flex-col h-[85vh] sm:h-[80vh] animate-in slide-in-from-bottom duration-300">
             <div className="p-6 border-b flex justify-between items-center bg-violet-600 text-white rounded-t-[48px] sm:rounded-t-3xl">
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8" />
                <div>
                  <h2 className="text-xl font-bold">Assistente de Compras ✨</h2>
                  <p className="text-[10px] uppercase font-bold opacity-80">IA Inteligente Gemini</p>
                </div>
              </div>
              <button onClick={() => setIsAssistantOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {assistantMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isAssistantLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                    <span className="text-xs font-bold text-slate-400 uppercase">Analisando ofertas...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white border-t rounded-b-3xl">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-violet-500"
                  placeholder="Pergunte sobre preços ou economia..."
                  value={assistantInput}
                  onChange={(e) => setAssistantInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAssistantSend()}
                />
                <button 
                  onClick={handleAssistantSend}
                  disabled={isAssistantLoading}
                  className="bg-violet-600 text-white p-4 rounded-2xl hover:bg-violet-700 disabled:opacity-50 transition-all"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
