import { create } from 'zustand';
import { Product } from '../types/firebase';

export type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addToCart: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? {
                ...item,
                quantity: item.quantity + (product.quantity || 1), // increment correctly
              }
              : item
          ),
        };
      } else {
        return {
          items: [...state.items, { ...product, quantity: product.quantity || 1 }],
        };
      }
    });
  },


  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));
