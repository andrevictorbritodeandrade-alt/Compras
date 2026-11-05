import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Power, Trash2, Plus, Info, AlertTriangle, Check, RefreshCw, ChevronDown, ChevronUp, ShoppingBag, Calculator, Sparkles } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export interface EnemItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  active: boolean;
  checked?: boolean;
  note?: string;
  isEncarte: boolean;
  appDiscount?: boolean;
}

const INITIAL_ENEM_ITEMS: EnemItem[] = [
  // 1. Itens Encontrados no Encarte (Preços Reais)
  {
    id: 101,
    name: 'PÃO DE FORMA VISCONTI/KIM (400G)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 9,
    unit: 'pct',
    price: 4.98,
    active: true,
    checked: false,
    note: 'Visconti ou Kim Tradicional 400g (compensa 400g). Alt.: Panco 500g a R$ 6,99 no App Meu Assaí.',
    isEncarte: true,
  },
  {
    id: 102,
    name: 'QUEIJO MUÇARELA LA PAULINA (KG)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 1.5,
    unit: 'kg',
    price: 34.90,
    active: true,
    checked: false,
    note: 'Atenção: R$ 34,90/kg na peça/pedaço. Se fatiado na bandeja: ~R$ 44,90/kg (Subtotal ~R$ 67,35).',
    isEncarte: true,
  },
  {
    id: 103,
    name: 'MORTADELA DEFUMADA SEARA (KG)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 2,
    unit: 'kg',
    price: 13.90,
    active: true,
    checked: false,
    note: 'Peça R$ 13,90/kg (ou Apresuntado Perdigão R$ 14,90/kg). Se fatiado na bandeja: ~R$ 19,90/kg.',
    isEncarte: true,
  },
  {
    id: 104,
    name: 'CREME DE QUEIJO QUATÁ 180G',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 2,
    unit: 'potes',
    price: 5.99,
    active: true,
    checked: false,
    note: 'R$ 5,99 no App Meu Assaí (ou Requeijão Polenghi 200g R$ 6,99). Ótimo p/ passar no pão.',
    isEncarte: true,
    appDiscount: true,
  },
  {
    id: 105,
    name: 'BISCOITO SALGADO CREAM CRACKER (350G)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 5,
    unit: 'pct',
    price: 4.69,
    active: true,
    checked: false,
    note: 'Biscoito Richester Cream Cracker pct 350g.',
    isEncarte: true,
  },
  {
    id: 106,
    name: 'BISCOITO MAISENA PIRAQUÊ (700G)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 3,
    unit: 'pct',
    price: 10.90,
    active: true,
    checked: false,
    note: 'Pacote grande 4x175g = 700g (equivale a 6 pacotes comuns).',
    isEncarte: true,
  },
  {
    id: 107,
    name: 'CAFÉ EM PÓ GOLDEN PIMPINELA (500G)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 2,
    unit: 'pct',
    price: 22.80,
    active: true,
    checked: false,
    note: 'Pouch 500g (2 pacotes = 1 kg).',
    isEncarte: true,
  },
  {
    id: 108,
    name: 'LEITE LONGA VIDA QUATÁ 1L',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 6,
    unit: 'cx',
    price: 4.39,
    active: true,
    checked: false,
    note: 'R$ 4,39 no App Meu Assaí (ou R$ 4,69 normal).',
    isEncarte: true,
    appDiscount: true,
  },
  {
    id: 109,
    name: 'ACHOCOLATADO TODDY ORIGINAL (1,02KG)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 1,
    unit: 'pct',
    price: 19.69,
    active: true,
    checked: false,
    note: 'Pacote econômico de 1,02 kg.',
    isEncarte: true,
  },
  {
    id: 110,
    name: 'AÇÚCAR REFINADO CARAVELAS 1KG',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 2,
    unit: 'pct',
    price: 2.99,
    active: true,
    checked: false,
    note: 'R$ 2,99 no App Meu Assaí (ou R$ 3,19 normal).',
    isEncarte: true,
    appDiscount: true,
  },
  {
    id: 111,
    name: 'REFRIGERANTE SUKITA 2L',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 7,
    unit: 'garrafas',
    price: 4.69,
    active: true,
    checked: false,
    note: 'Sukita 2L (sabores variados).',
    isEncarte: true,
  },
  {
    id: 112,
    name: 'SUCO DE CAJU DAFRUTA 1L',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 2,
    unit: 'garrafas',
    price: 4.79,
    active: true,
    checked: false,
    note: 'Suco de Caju Concentrado Dafruta 1L (rende até 4L - opcional p/ quem não bebe refri).',
    isEncarte: true,
  },
  {
    id: 113,
    name: 'BANANA PRATA (FEIRASSAÍ)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 4,
    unit: 'kg',
    price: 6.49,
    active: true,
    checked: false,
    note: 'Oferta FeirAssaí: ~48 a 50 bananas médias (1 por pessoa).',
    isEncarte: true,
  },
  {
    id: 114,
    name: 'MAÇÃS DO BENI / SUPER K (PCT 850G)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 3,
    unit: 'pct',
    price: 4.99,
    active: true,
    checked: false,
    note: 'Pacote 850g: ~8 a 10 maçãs pequenas (ou Uva s/ semente R$ 6,99 bandeja 500g).',
    isEncarte: true,
  },
  {
    id: 115,
    name: 'PAPEL TOALHA BOM PETY (2 ROLOS)',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 3,
    unit: 'pct',
    price: 2.89,
    active: true,
    checked: false,
    note: 'Toalhas de Papel pct c/ 2 rolos (3 pacotes = 6 rolos).',
    isEncarte: true,
  },
  {
    id: 116,
    name: 'SACO DE LIXO EMBALIXO',
    category: '1. Itens do Encarte Assaí Pilares',
    quantity: 1,
    unit: 'pct',
    price: 8.90,
    active: true,
    checked: false,
    note: 'Embalixo (25x100L ou 50x50L).',
    isEncarte: true,
  },

  // 2. Itens que NÃO apareceram no encarte (Pegar na prateleira normal)
  {
    id: 201,
    name: 'MARGARINA (POTE DE 1 KG)',
    category: '2. Fora do Encarte (Prateleira)',
    quantity: 1,
    unit: 'pote',
    price: 11.50,
    active: true,
    checked: false,
    note: 'Para 46 pessoas o pote de 1kg compensa muito mais que manteiga 200g.',
    isEncarte: false,
  },
  {
    id: 202,
    name: 'COPOS DESCARTÁVEIS 200ML (TIRA 100 UN.)',
    category: '2. Fora do Encarte (Prateleira)',
    quantity: 3,
    unit: 'tiras',
    price: 5.50,
    active: true,
    checked: false,
    note: '3 tiras c/ 100 un. = 300 copos (R$ 16,50 total estimado).',
    isEncarte: false,
  },
  {
    id: 203,
    name: 'GUARDANAPOS DE PAPEL (PCT GRANDE)',
    category: '2. Fora do Encarte (Prateleira)',
    quantity: 2,
    unit: 'pct',
    price: 3.90,
    active: true,
    checked: false,
    note: '2 pacotes grandes (R$ 7,80 total estimado).',
    isEncarte: false,
  },
  {
    id: 204,
    name: 'MEXEDORES DE CAFÉ + FILTRO DE PAPEL 103',
    category: '2. Fora do Encarte (Prateleira)',
    quantity: 1,
    unit: 'kit',
    price: 8.50,
    active: true,
    checked: false,
    note: '1 pacote de mexedores de café + 1 pacote de filtro de papel 103.',
    isEncarte: false,
  },
];

const LOCAL_STORAGE_KEY = 'compras_do_enem_list_v1';

export const EnemShoppingList: React.FC = () => {
  const [items, setItems] = useState<EnemItem[]>(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading ENEM list from localStorage', e);
    }
    return INITIAL_ENEM_ITEMS;
  });

  const [useSlicedOption, setUseSlicedOption] = useState<boolean>(() => {
    return localStorage.getItem('enem_use_sliced') === 'true';
  });

  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'1. Itens do Encarte Assaí Pilares' | '2. Fora do Encarte (Prateleira)'>('1. Itens do Encarte Assaí Pilares');
  const [newItemUnit, setNewItemUnit] = useState('un');
  const [newItemNote, setNewItemNote] = useState('');

  // Sync with Firestore doc 'specialLists/enem'
  useEffect(() => {
    const docRef = doc(db, 'specialLists', 'enem');
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.items) && data.items.length > 0) {
          setItems(data.items);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.items));
        }
        if (typeof data?.useSlicedOption === 'boolean') {
          setUseSlicedOption(data.useSlicedOption);
          localStorage.setItem('enem_use_sliced', String(data.useSlicedOption));
        }
      } else {
        // Seed Firestore
        setDoc(docRef, { items: INITIAL_ENEM_ITEMS, useSlicedOption: false });
      }
    }, (err) => {
      console.warn('Firestore offline or snapshot error for ENEM list:', err);
    });

    return () => unsubscribe();
  }, []);

  const saveItems = (updated: EnemItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    const docRef = doc(db, 'specialLists', 'enem');
    updateDoc(docRef, { items: updated }).catch((err) => {
      // If doc doesn't exist yet, setDoc
      setDoc(docRef, { items: updated, useSlicedOption }, { merge: true }).catch(console.error);
    });
  };

  const toggleItemActive = (id: number) => {
    const updated = items.map(item => item.id === id ? { ...item, active: !item.active } : item);
    saveItems(updated);
  };

  const toggleItemChecked = (id: number) => {
    const updated = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    saveItems(updated);
  };

  const handleQuantityStep = (id: number, delta: number) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const step = item.unit === 'kg' ? 0.5 : 1;
        const newQty = Math.max(0, Math.round((item.quantity + delta * step) * 10) / 10);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveItems(updated);
  };

  const handlePriceChange = (id: number, rawVal: string) => {
    const normalized = rawVal.replace('.', ',');
    // sanitize leading zero: e.g. "05" -> "5", but keep "0," or "0"
    let clean = normalized;
    if (clean.length > 1 && clean.startsWith('0') && !clean.startsWith('0,')) {
      clean = clean.replace(/^0+/, '');
      if (clean === '' || clean.startsWith(',')) clean = '0' + clean;
    }
    const parsed = parseFloat(clean.replace(',', '.') || '0');
    const updated = items.map(item => item.id === id ? { ...item, price: isNaN(parsed) ? 0 : parsed } : item);
    saveItems(updated);
  };

  const handleDeleteItem = (id: number) => {
    if (!window.confirm('Deseja excluir este item das Compras do ENEM?')) return;
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const handleResetToDefault = () => {
    if (!window.confirm('Deseja restaurar a lista oficial das Compras do ENEM com os preços do encarte Assaí Pilares?')) return;
    saveItems(INITIAL_ENEM_ITEMS);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    let cleanPrice = newItemPrice.replace('.', ',');
    if (cleanPrice.length > 1 && cleanPrice.startsWith('0') && !cleanPrice.startsWith('0,')) {
      cleanPrice = cleanPrice.replace(/^0+/, '');
    }
    const priceNum = parseFloat(cleanPrice.replace(',', '.') || '0');
    const qtyNum = parseFloat(newItemQty.replace(',', '.') || '1');

    const newItem: EnemItem = {
      id: Date.now(),
      name: newItemName.trim().toUpperCase(),
      category: newItemCategory,
      quantity: isNaN(qtyNum) || qtyNum <= 0 ? 1 : qtyNum,
      unit: newItemUnit.trim() || 'un',
      price: isNaN(priceNum) ? 0 : priceNum,
      active: true,
      checked: false,
      note: newItemNote.trim() || undefined,
      isEncarte: newItemCategory.includes('Encarte'),
    };

    saveItems([...items, newItem]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemQty('1');
    setNewItemNote('');
    setShowAddModal(false);
  };

  // Calculations
  const calculations = useMemo(() => {
    let encarteTotal = 0;
    let foraTotal = 0;
    let activeCount = 0;
    let totalCount = items.length;

    items.forEach(item => {
      if (item.active) {
        activeCount++;
        let effectivePrice = item.price;
        // If sliced option is enabled and item is queijo (id 102) or mortadela (id 103)
        if (useSlicedOption) {
          if (item.id === 102) effectivePrice = 44.90; // Queijo fatiado ~R$ 44,90/kg
          if (item.id === 103) effectivePrice = 19.90; // Mortadela fatiada ~R$ 19,90/kg
        }
        const sub = item.quantity * effectivePrice;
        if (item.isEncarte) {
          encarteTotal += sub;
        } else {
          foraTotal += sub;
        }
      }
    });

    const grandTotal = encarteTotal + foraTotal;
    return {
      encarteTotal,
      foraTotal,
      grandTotal,
      activeCount,
      totalCount,
    };
  }, [items, useSlicedOption]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Group items
  const categoriesList = useMemo(() => {
    const map = new Map<string, EnemItem[]>();
    items.forEach(item => {
      const cat = item.category || 'Outros';
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(item);
    });
    return Array.from(map.entries());
  }, [items]);

  return (
    <div className="space-y-4">
      {/* ========================================================= */}
      {/* STICKY REAL-TIME SUMMARY WIDGET (Appears as user scrolls) */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* STICKY REAL-TIME SUMMARY WIDGET (Compact for mobile)      */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-red-600 shadow-md -mx-4 px-3 py-2 transition-all">
        <div className="max-w-4xl mx-auto space-y-1.5">
          {/* Top Row: Title, Items count, and Frios Toggle */}
          <div className="flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="bg-red-600 text-yellow-300 px-1.5 py-0.5 rounded font-black text-[10px] uppercase tracking-wider shrink-0">
                ENEM
              </span>
              <span className="font-black text-slate-900 text-xs truncate">
                ASSAÍ PILARES
              </span>
              <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full border border-slate-200 shrink-0">
                {calculations.activeCount}/{calculations.totalCount} ativos
              </span>
            </div>

            {/* Sliced Option Switch */}
            <button
              onClick={() => {
                const nextVal = !useSlicedOption;
                setUseSlicedOption(nextVal);
                localStorage.setItem('enem_use_sliced', String(nextVal));
                const docRef = doc(db, 'specialLists', 'enem');
                updateDoc(docRef, { useSlicedOption: nextVal }).catch(console.error);
              }}
              className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border transition-all shrink-0 ${
                useSlicedOption
                  ? 'bg-yellow-400 text-black border-yellow-500 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Alternar entre frios na peça vs fatiados na bandeja"
            >
              {useSlicedOption ? '✓ Fatiados (+R$27)' : 'Peça (Padrão)'}
            </button>
          </div>

          {/* Bottom Row: Subtotals & Big Yellow/Red Total */}
          <div className="flex items-center justify-between gap-2 bg-red-600 text-white px-2.5 py-1.5 rounded-xl shadow-xs border border-yellow-400">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-yellow-100 font-bold">
              <div>Encarte: <strong className="text-white font-black">{formatCurrency(calculations.encarteTotal)}</strong></div>
              <span className="opacity-40">|</span>
              <div>Prat.: <strong className="text-white font-black">{formatCurrency(calculations.foraTotal)}</strong></div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] uppercase font-black tracking-wider text-yellow-200">TOTAL:</span>
              <span className="text-base sm:text-lg font-black tracking-tight text-yellow-300">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar: Add Item button & Tips toggle */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase py-2 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 border border-yellow-400"
        >
          <Plus size={15} className="text-yellow-300" />
          <span>Adicionar Item</span>
        </button>

        <button
          onClick={() => setIsTipsOpen(!isTipsOpen)}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase py-2 px-3 rounded-xl shadow-xs flex items-center gap-1 transition-transform active:scale-95 border border-yellow-500 shrink-0"
        >
          <Info size={14} />
          <span>3 Dicas Assaí</span>
          {isTipsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        <button
          onClick={handleResetToDefault}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl transition-colors border border-slate-300 shrink-0"
          title="Restaurar itens padrão do encarte"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Tips Banner (Collapsible) */}
      {isTipsOpen && (
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 shadow-xs text-xs text-slate-800 space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-black text-slate-900 uppercase text-xs border-b border-yellow-300 pb-1">
            <AlertTriangle size={15} className="text-red-600 shrink-0" />
            <span>Dicas do Encarte Assaí Pilares (RJ)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-yellow-300 shadow-2xs">
              <p className="font-black text-red-600 uppercase mb-0.5">1. Peça vs Fatiado</p>
              <p className="leading-snug text-slate-700">
                Queijo (R$ 34,90/kg) e mortadela (R$ 13,90/kg) são na <strong>PEÇA</strong>. Fatiados na bandeja custam ~R$ 44,90/kg e ~R$ 19,90/kg (+R$ 27 no total).
              </p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-yellow-300 shadow-2xs">
              <p className="font-black text-red-600 uppercase mb-0.5">2. App "Meu Assaí"</p>
              <p className="leading-snug text-slate-700">
                Digite o CPF no caixa para ativar: Leite Quatá R$ 4,39, Açúcar R$ 2,99, Creme de Queijo R$ 5,99 e Pão Panco R$ 6,99.
              </p>
            </div>

            <div className="bg-white p-2 rounded-lg border border-yellow-300 shadow-2xs">
              <p className="font-black text-red-600 uppercase mb-0.5">3. Frutas Práticas</p>
              <p className="leading-snug text-slate-700">
                Banana Prata (R$ 6,49/kg) e Maçã pequena (R$ 4,99 pct) não precisam ser descascadas/cortadas na hora do coffee break do ENEM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LIST OF CATEGORIES AND ITEM CARDS (OPTIMIZED FOR MOBILE)  */}
      {/* ========================================================= */}
      <div className="space-y-3">

        {categoriesList.map(([categoryName, catItems]) => {
          const isEncarte = categoryName.includes('Encarte');
          const catActiveTotal = catItems
            .filter(i => i.active)
            .reduce((sum, i) => {
              let p = i.price;
              if (useSlicedOption) {
                if (i.id === 102) p = 44.90;
                if (i.id === 103) p = 19.90;
              }
              return sum + i.quantity * p;
            }, 0);

          return (
            <div key={categoryName} className="border-4 border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              {/* Category Header */}
              <div className="flex items-center justify-between p-3 bg-slate-100 border-b-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isEncarte ? 'bg-red-600' : 'bg-yellow-500'}`} />
                  <h3 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight">
                    {categoryName}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-slate-500 mr-1">Subtotal:</span>
                  <span className="text-xs md:text-sm font-black text-red-600">{formatCurrency(catActiveTotal)}</span>
                </div>
              </div>

              {/* Items in Category */}
              <div className="divide-y-2 divide-slate-100">
                {catItems.map((item) => (
                  <EnemItemRow
                    key={item.id}
                    item={item}
                    useSlicedOption={useSlicedOption}
                    onToggleActive={() => toggleItemActive(item.id)}
                    onToggleChecked={() => toggleItemChecked(item.id)}
                    onQuantityStep={(delta) => handleQuantityStep(item.id, delta)}
                    onPriceChange={(raw) => handlePriceChange(item.id, raw)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD CUSTOM ITEM TO ENEM LIST                       */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border-4 border-red-600 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 text-yellow-300 p-1.5 rounded-lg">
                  <Plus size={18} />
                </div>
                <h3 className="font-black text-slate-900 text-base uppercase">Adicionar Item ao ENEM</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-black text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SUCO DE UVA 1L"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-xs font-black uppercase focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Quantidade
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-xs font-black text-center focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Unidade
                  </label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-2 py-2 border-2 border-slate-300 rounded-lg text-xs font-black focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="pct">pct</option>
                    <option value="cx">cx</option>
                    <option value="garrafas">garrafas</option>
                    <option value="potes">potes</option>
                    <option value="tiras">tiras</option>
                    <option value="kit">kit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={newItemPrice}
                    onChange={(e) => {
                      const val = e.target.value.replace('.', ',');
                      if (/^\d*,?\d*$/.test(val)) {
                        const clean = val.length > 1 && val.startsWith('0') && !val.startsWith('0,') ? val.substring(1) : val;
                        setNewItemPrice(clean);
                      }
                    }}
                    className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-xs font-black text-right focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Categoria
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-xs font-black focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="1. Itens do Encarte Assaí Pilares">1. Itens do Encarte Assaí Pilares</option>
                  <option value="2. Fora do Encarte (Prateleira)">2. Fora do Encarte (Prateleira)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase mb-1">
                  Observação / Marca
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pegar marca X em promoção"
                  value={newItemNote}
                  onChange={(e) => setNewItemNote(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-black text-xs uppercase"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-black text-xs uppercase border-2 border-yellow-400 shadow-md"
                >
                  Adicionar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================
// SINGLE ROW COMPONENT FOR ENEM ITEM
// =========================================================
interface EnemItemRowProps {
  item: EnemItem;
  useSlicedOption: boolean;
  onToggleActive: () => void;
  onToggleChecked: () => void;
  onQuantityStep: (delta: number) => void;
  onPriceChange: (val: string) => void;
  onDelete: () => void;
}

const EnemItemRow: React.FC<EnemItemRowProps> = ({
  item,
  useSlicedOption,
  onToggleActive,
  onToggleChecked,
  onQuantityStep,
  onPriceChange,
  onDelete,
}) => {
  const [localPriceStr, setLocalPriceStr] = useState(() => {
    let p = item.price;
    if (useSlicedOption) {
      if (item.id === 102) p = 44.90;
      if (item.id === 103) p = 19.90;
    }
    return p.toString().replace('.', ',');
  });

  useEffect(() => {
    let p = item.price;
    if (useSlicedOption) {
      if (item.id === 102) p = 44.90;
      if (item.id === 103) p = 19.90;
    }
    setLocalPriceStr(p.toString().replace('.', ','));
  }, [item.price, item.id, useSlicedOption]);

  const effectivePrice = useMemo(() => {
    if (useSlicedOption) {
      if (item.id === 102) return 44.90;
      if (item.id === 103) return 19.90;
    }
    return item.price;
  }, [item.price, item.id, useSlicedOption]);

  const subtotal = item.quantity * effectivePrice;
  const isChecked = item.checked === true;
  const isActive = item.active !== false;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div
      className={`px-2.5 py-2 transition-colors relative border-b border-slate-100 last:border-b-0 ${
        !isActive ? 'opacity-40 grayscale bg-slate-50' : isChecked ? 'bg-yellow-50/60' : 'hover:bg-slate-50'
      }`}
    >
      {/* LINE 1: Power, Check, Full Product Name, Delete */}
      <div className="flex items-center gap-2">
        {/* Toggle Active/Inactive (Ligar / Desligar) */}
        <button
          onClick={onToggleActive}
          className={`p-1 rounded-full transition-all shrink-0 ${
            isActive ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-300 text-slate-700'
          }`}
          title={isActive ? 'Desligar item' : 'Ligar item'}
        >
          <Power size={13} />
        </button>

        {/* Checkmark (Comprado / Carrinho) */}
        <button
          onClick={onToggleChecked}
          disabled={!isActive}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
            isChecked
              ? 'bg-yellow-400 border-yellow-500 text-black font-black'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
          title={isChecked ? 'Desmarcar comprado' : 'Marcar como comprado'}
        >
          {isChecked && <Check size={12} strokeWidth={4} />}
        </button>

        {/* Full Product Name - 100% visible, NEVER truncated to 1 letter */}
        <div className="flex-1 min-w-0 pr-1">
          <div
            className={`font-black text-xs sm:text-sm text-slate-900 leading-snug uppercase ${
              isChecked ? 'line-through text-slate-400' : ''
            }`}
          >
            {item.name}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="text-slate-300 hover:text-red-600 transition-colors p-1 rounded shrink-0"
          title="Excluir item"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Note and App Meu Assaí tag */}
      {(item.note || item.appDiscount) && (
        <div className="pl-8 pr-6 pt-0.5 pb-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
          {item.appDiscount && (
            <span className="bg-yellow-400 text-black font-black uppercase text-[8px] px-1 rounded shrink-0">
              App Meu Assaí
            </span>
          )}
          {item.note && <span className="leading-tight">{item.note}</span>}
        </div>
      )}

      {/* LINE 2: Controls (QTD Stepper, Preço Unit, Subtotal) - Clean, Spacious, Highly Usable on mobile */}
      <div className="flex items-center justify-between gap-2 pt-1.5 pl-8 pr-1 mt-0.5">
        {/* Quantity Stepper */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200 shrink-0">
          <button
            onClick={() => onQuantityStep(-1)}
            disabled={!isActive}
            className="w-7 h-7 bg-white hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-black rounded-md flex items-center justify-center text-sm shadow-xs transition-transform active:scale-95"
            title="Diminuir"
          >
            -
          </button>
          <div className="px-2 text-center font-black text-xs sm:text-sm text-slate-900 leading-none whitespace-nowrap">
            <span>{item.quantity}</span>
            <span className="text-[10px] font-bold text-slate-500 ml-0.5 uppercase">{item.unit}</span>
          </div>
          <button
            onClick={() => onQuantityStep(1)}
            disabled={!isActive}
            className="w-7 h-7 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-black rounded-md flex items-center justify-center text-sm shadow-xs transition-transform active:scale-95"
            title="Aumentar"
          >
            +
          </button>
        </div>

        {/* Unit Price */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-black uppercase text-slate-400">UN:</span>
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-1.5 py-0.5 focus-within:ring-1 focus-within:ring-red-500">
            <span className="text-[10px] font-bold text-slate-500 mr-0.5">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={localPriceStr}
              disabled={!isActive || (useSlicedOption && (item.id === 102 || item.id === 103))}
              onChange={(e) => {
                const raw = e.target.value.replace('.', ',');
                if (/^\d*,?\d*$/.test(raw)) {
                  let clean = raw;
                  if (clean.length > 1 && clean.startsWith('0') && !clean.startsWith('0,')) {
                    clean = clean.replace(/^0+/, '');
                    if (clean === '' || clean.startsWith(',')) clean = '0' + clean;
                  }
                  setLocalPriceStr(clean);
                  onPriceChange(clean);
                }
              }}
              onBlur={() => {
                onPriceChange(localPriceStr);
              }}
              className="w-12 text-right font-black text-xs text-slate-900 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Subtotal */}
        <div className="text-right shrink-0">
          <div className="text-[8px] font-black uppercase tracking-wider text-slate-400">Subtotal</div>
          <div className="font-black text-xs sm:text-sm text-slate-900 whitespace-nowrap">
            {formatCurrency(subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
};
