import { Invoice } from "../../domain/entities/Invoice";
import { InvoiceRepository } from "../../domain/repositories/Invoice.repository";

export class GetInvoicesUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(): Promise<Invoice[]> {
    return this.invoiceRepository.getInvoices();
  }
}

export class GetInvoiceByIdUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(invoiceId: string): Promise<Invoice | null> {
    return this.invoiceRepository.getInvoiceById(invoiceId);
  }
}

export class CreateInvoiceUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(invoice: Invoice): Promise<void> {
    return this.invoiceRepository.saveInvoice(invoice);
  }
}
