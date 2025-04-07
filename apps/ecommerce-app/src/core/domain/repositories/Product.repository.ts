import { Product } from '../entities/Product';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  updateStock(productId: number, quantity: number): Promise<void>;
}