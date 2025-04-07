import { Product } from "../../core/domain/entities/Product";
import { ProductRepository } from "../../core/domain/repositories/Product.repository";

export class ProductLocalStorageRepository implements ProductRepository {
  private readonly STORAGE_KEY = "products";

  private mockData: Product[] = [
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

  async getProducts(): Promise<Product[]> {
    try {
      const storedProducts = localStorage.getItem(this.STORAGE_KEY);

      if (storedProducts) {
        return JSON.parse(storedProducts);
      } else {
        await this.initializeProducts();
        return this.mockData;
      }
    } catch (error) {
      console.error("Error getting products:", error);
      await this.initializeProducts();
      return this.mockData;
    }
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    try {
      const products = await this.getProducts();
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock - quantity) }
          : product
      );

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }

  private async initializeProducts(): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.mockData));
    } catch (error) {
      console.error("Error initializing products:", error);
      throw error;
    }
  }
}
