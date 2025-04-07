import { Product } from '../domain/entities/Product';
import { ProductsUseCase } from '../useCases/Products/ProductsUseCase';

export class ProductActions {
  constructor(private productsUseCase: ProductsUseCase) {}

  async getProducts(): Promise<Product[]> {
    return this.productsUseCase.getProducts();
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    return this.productsUseCase.updateStock(productId, quantity);
  }

  async getProductById(productId: number): Promise<Product | undefined> {
    return this.productsUseCase.getProductById(productId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productsUseCase.getProductsByCategory(category);
  }
}