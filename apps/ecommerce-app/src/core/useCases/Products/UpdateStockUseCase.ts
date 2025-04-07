import { ProductRepository } from "../../domain/repositories/Product.repository";

export class UpdateStockUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(productId: number, quantity: number): Promise<void> {
    return this.productRepository.updateStock(productId, quantity);
  }
}