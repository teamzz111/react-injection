import { Invoice } from "../domain/entities/Invoice";
import {
  CreateInvoiceUseCase,
  GetInvoiceByIdUseCase,
  GetInvoicesUseCase,
} from "../useCases/Admin/AdminUseCase";
import {
  GetInvoiceStatisticsUseCase,
  InvoiceStatistics,
} from "../useCases/Stats/GetStatsUseCase";

export class InvoiceActions {
  constructor(
    private getInvoicesUseCase: GetInvoicesUseCase,
    private getInvoiceByIdUseCase: GetInvoiceByIdUseCase,
    private createInvoiceUseCase: CreateInvoiceUseCase,
    private getInvoiceStatisticsUseCase: GetInvoiceStatisticsUseCase
  ) {}

  async getInvoices(): Promise<Invoice[]> {
    return this.getInvoicesUseCase.execute();
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    return this.getInvoiceByIdUseCase.execute(invoiceId);
  }

  async createInvoice(invoice: Invoice): Promise<void> {
    return this.createInvoiceUseCase.execute(invoice);
  }

  async getInvoiceStatistics(): Promise<InvoiceStatistics> {
    return this.getInvoiceStatisticsUseCase.execute();
  }
}
