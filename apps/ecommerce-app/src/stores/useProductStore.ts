import { create } from "zustand";
import { container } from "../di/container";
import { Product } from "../core/domain/entities/Product";
import { ProductActions } from "../core/actions/Product.actions";

export const mockData: Product[] = [
  {
    id: 1,
    name: "Manzana Roja",
    category: "Frutas Frescas",
    stock: 50,
    price: 2000,
    tax: 0.19,
  },
  {
    id: 2,
    name: "Manzana Verde",
    category: "Frutas Frescas",
    stock: 30,
    price: 3000,
    tax: 0,
  },
  {
    id: 3,
    name: "Banano",
    category: "Frutas Frescas",
    stock: 100,
    price: 1000,
    tax: 0,
  },
  {
    id: 4,
    name: "Pera",
    category: "Frutas Frescas",
    stock: 25,
    price: 3000,
    tax: 0.19,
  },
  {
    id: 5,
    name: "Fresa",
    category: "Frutas Frescas",
    stock: 40,
    price: 4000,
    tax: 0.19,
  },
  {
    id: 6,
    name: "Uva Morada",
    category: "Frutas Frescas",
    stock: 60,
    price: 5000,
    tax: 0,
  },
  {
    id: 7,
    name: "Uva Verde",
    category: "Frutas Frescas",
    stock: 55,
    price: 5000,
    tax: 0.19,
  },
  {
    id: 8,
    name: "Naranja",
    category: "Cítricos",
    stock: 70,
    price: 2000,
    tax: 0,
  },
  {
    id: 9,
    name: "Limón",
    category: "Cítricos",
    stock: 90,
    price: 1000,
    tax: 0.19,
  },
  {
    id: 10,
    name: "Mandarina",
    category: "Cítricos",
    stock: 45,
    price: 3000,
    tax: 0,
  },
  {
    id: 11,
    name: "Piña",
    category: "Tropicales",
    stock: 20,
    price: 7000,
    tax: 0.19,
  },
  {
    id: 12,
    name: "Mango",
    category: "Tropicales",
    stock: 35,
    price: 3000,
    tax: 0,
  },
  {
    id: 13,
    name: "Papaya",
    category: "Tropicales",
    stock: 30,
    price: 5000,
    tax: 0.19,
  },
  {
    id: 14,
    name: "Coco",
    category: "Tropicales",
    stock: 15,
    price: 8000,
    tax: 0,
  },
  {
    id: 15,
    name: "Sandía",
    category: "Tropicales",
    stock: 10,
    price: 9000,
    tax: 0.19,
  },
];

type ProductStore = {
  products: Product[];
  loading: boolean;
  error: string | null;
  initializeProducts: () => Promise<void>;
  updateStock: (productId: number, quantity: number) => Promise<void>;
  getProductById: (id: number) => Product | undefined;
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  initializeProducts: async () => {
    set({ loading: true, error: null });

    try {
      console.log("Iniciando carga de productos...");

      const storedProducts = localStorage.getItem("products");

      if (storedProducts) {
        try {
          const parsedProducts = JSON.parse(storedProducts);
          console.log(
            `Productos cargados desde localStorage: ${parsedProducts.length}`
          );
          set({ products: parsedProducts, loading: false });
          return;
        } catch (parseError) {
          console.error(
            "Error parseando productos de localStorage:",
            parseError
          );
        }
      }

      try {
        const productActions = container.resolve(
          "productActions"
        ) as ProductActions;
        const products = await productActions.getProducts();

        if (products && products.length > 0) {
          console.log(
            `Productos cargados a través de ProductActions: ${products.length}`
          );
          set({ products, loading: false });
          return;
        } else {
          console.log("No se obtuvieron productos a través de ProductActions");
        }
      } catch (containerError) {
        console.error("Error al resolver productActions:", containerError);
      }

      localStorage.setItem("products", JSON.stringify(mockData));
      set({ products: mockData, loading: false });
    } catch (error) {
      console.error("Error general al inicializar productos:", error);
      set({
        error: "Error al cargar productos",
        loading: false,
        products: mockData,
      });
    }
  },

  updateStock: async (productId, quantity) => {
    try {
      set({ loading: true, error: null });

      const isRestoring = quantity < 0;
      console.log(
        `${isRestoring ? "Restaurando" : "Reduciendo"} stock para producto ${productId}, cantidad: ${Math.abs(quantity)}`
      );

      try {
        const productActions = container.resolve(
          "productActions"
        ) as ProductActions;
        await productActions.updateStock(productId, quantity);

        const products = await productActions.getProducts();
        set({ products, loading: false });
        console.log(
          "Stock actualizado correctamente a través de ProductActions"
        );
        return;
      } catch (containerError) {
        console.warn(
          "Error al actualizar a través de productActions:",
          containerError
        );
      }

      const currentProducts = get().products;
      const productToUpdate = currentProducts.find((p) => p.id === productId);

      if (!productToUpdate) {
        throw new Error(`Producto no encontrado: ${productId}`);
      }

      const newStock = isRestoring
        ? productToUpdate.stock + Math.abs(quantity)
        : Math.max(0, productToUpdate.stock - quantity);

      const updatedProducts = currentProducts.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      );

      localStorage.setItem("products", JSON.stringify(updatedProducts));

      set({ products: updatedProducts, loading: false });
      console.log(
        `Stock ${isRestoring ? "restaurado" : "actualizado"} directamente. Nuevo stock: ${newStock}`
      );
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      set({
        error: `Error al ${quantity < 0 ? "restaurar" : "actualizar"} el stock`,
        loading: false,
      });
    }
  },

  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  },
}));
