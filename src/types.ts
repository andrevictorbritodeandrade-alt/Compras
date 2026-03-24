export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  unit?: string;
  active?: boolean;
  checked?: boolean;
}

export interface Category {
  id: number;
  name: string;
  items: ShoppingItem[];
}

export interface Estimation {
  name: string;
  estimatedQuantity: number;
  unit: string;
}

export interface Deal {
  id: string;
  itemName: string;
  price: number;
  market: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface PreShoppingItem {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export interface MonthlyHistory {
  month: string;
  total: number;
}
