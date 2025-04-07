import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../core/domain/entities/Product";
import { useProductStore } from "./useProductStore";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, quantity) => {
        if (quantity <= 0) return;

        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const updatedItems = items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },

      removeFromCart: (productId) => {
        const { items } = get();

        const itemToRemove = items.find(
          (item) => item.product.id === productId
        );

        if (itemToRemove) {
          try {
            const { updateStock } = useProductStore.getState();
            updateStock(productId, -itemToRemove.quantity);
          } catch (error) {
            console.error("Error al restaurar stock:", error);
          }
        }

        const newItems = items.filter((item) => item.product.id !== productId);
        set({ items: newItems });
      },

      updateQuantity: (productId, newQuantity) => {
        const { items } = get();
        const existingItem = items.find(
          (item) => item.product.id === productId
        );

        if (!existingItem) return;

        if (newQuantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        const quantityDiff = newQuantity - existingItem.quantity;

        if (quantityDiff !== 0) {
          try {
            const { updateStock } = useProductStore.getState();
            updateStock(productId, quantityDiff);
            console.log(
              "Stock actualizado por cambio de cantidad:",
              productId,
              "Diferencia:",
              quantityDiff
            );
          } catch (error) {
            console.error("Error al actualizar stock:", error);
          }
        }

        const updatedItems = items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
        set({ items: updatedItems });
      },

      clearCart: () => {
        const { items } = get();

        try {
          const { updateStock } = useProductStore.getState();
          items.forEach((item) => {
            updateStock(item.product.id, -item.quantity);
            console.log(
              "Stock restaurado para:",
              item.product.id,
              "Cantidad:",
              item.quantity
            );
          });
        } catch (error) {
          console.error("Error al restaurar stock al vaciar carrito:", error);
        }

        set({ items: [] });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const priceWithTax = item.product.price * (1 + item.product.tax);
          return total + priceWithTax * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
