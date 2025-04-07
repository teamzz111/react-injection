import React, { useCallback, useRef } from "react";
import { Loader2Icon } from "lucide-react";
import { Product } from "../../../core/domain/entities/Product";
import { useProductPresenter } from "../../presenter/Product.presenter";
import ProductCard from "../../shared/ProductCard";
import { NotificationComponent } from "../../shared/Notification";

const ProductListView: React.FC = () => {
  const productsRef = useRef<Product[]>([]);
  const { products, loading, error, addToCart } = useProductPresenter();

  if (
    products.length > 0 &&
    (productsRef.current.length === 0 ||
      !products.every(
        (product, index) =>
          index < productsRef.current.length &&
          product.id === productsRef.current[index].id &&
          product.stock === productsRef.current[index].stock
      ))
  ) {
    productsRef.current = [...products];
  }

  const [notification, setNotification] = React.useState({
    show: false,
    type: "success" as "success" | "error",
    message: "",
  });

  const handleAddToCart = useCallback(
    (productId: number) => {
      const result = addToCart(productId, 1);

      if (result.success) {
        setNotification({
          show: true,
          type: "success",
          message: "¡Producto añadido al carrito!",
        });
      } else {
        setNotification({
          show: true,
          type: "error",
          message: result.error || "Error al añadir al carrito",
        });
      }

      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 2000);
    },
    [addToCart]
  );

  if (loading && productsRef.current.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg font-medium">Cargando productos...</span>
      </div>
    );
  }

  if (error && productsRef.current.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-lg">
          <h2 className="text-red-800 font-semibold text-lg">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (productsRef.current.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Catálogo de Productos
        </h1>
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No hay productos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Catálogo de Productos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsRef.current.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      <NotificationComponent {...notification} />
    </>
  );
};

export default React.memo(ProductListView);
