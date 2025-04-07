import { useCartStore } from "../../stores/useCartStore";

const useCartPresenter = () => {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const taxes = items.reduce(
    (sum, item) => sum + item.product.price * item.product.tax * item.quantity,
    0
  );

  const total = subtotal + taxes;

  return {
    total,
    removeFromCart,
    updateQuantity,
    items,
    subtotal,
    taxes,
  };
};

export default useCartPresenter;
