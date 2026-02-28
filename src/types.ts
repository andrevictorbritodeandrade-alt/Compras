export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  unit?: string;
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
