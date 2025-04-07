import { useState, useEffect, useCallback } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";

export const useProductPresenter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    products,
    loading: storeLoading,
    error: storeError,
    initializeProducts,
    updateStock,
    getProductById,
  } = useProductStore();

  const { addToCart: addToCartStore } = useCartStore();

  useEffect(() => {
    setLoading(storeLoading);
    if (storeError) {
      setError(storeError);
    }
  }, [storeLoading, storeError]);

  useEffect(() => {
    if (products.length === 0 && !loading) {
      initializeProducts();
    }
  }, [products.length, loading, initializeProducts]);

  const handleAddToCart = useCallback(
    (productId: number, quantity: number = 1) => {
      const product = getProductById(productId);

      if (!product) {
        console.error("Product not found:", productId);
        return { success: false, error: "Producto no encontrado" };
      }

      if (product.stock < quantity) {
        console.error(
          "Insufficient stock:",
          product.stock,
          "required:",
          quantity
        );
        return { success: false, error: "Stock insuficiente" };
      }

      addToCartStore(product, quantity);
      console.log("Added to cart:", product.name, "quantity:", quantity);

      updateStock(productId, quantity);

      return { success: true, product };
    },
    [addToCartStore, getProductById, updateStock]
  );

  return {
    products,
    loading,
    error,
    addToCart: handleAddToCart,
    updateStock,
  };
};
