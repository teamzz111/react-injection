import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/Product.repository";

export class ProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async getProducts(): Promise<Product[]> {
    return this.productRepository.getProducts();
  }

  async updateStock(productId: number, quantity: number): Promise<void> {
    return this.productRepository.updateStock(productId, quantity);
  }

  async getProductById(productId: number): Promise<Product | undefined> {
    const products = await this.productRepository.getProducts();
    return products.find((product) => product.id === productId);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.productRepository.getProducts();
    return products.filter((product) => product.category === category);
  }
}
