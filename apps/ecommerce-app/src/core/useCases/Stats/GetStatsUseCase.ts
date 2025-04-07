import { InvoiceRepository } from "../../domain/repositories/Invoice.repository";

export interface InvoiceStatistics {
  totalSales: number;
  totalInvoices: number;
  totalProducts: number;
  totalCustomers: number;
}

export class GetInvoiceStatisticsUseCase {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute(): Promise<InvoiceStatistics> {
    try {
      const invoices = await this.invoiceRepository.getInvoices();

      const totalSales = invoices.reduce(
        (sum, invoice) => sum + invoice.total,
        0
      );
      const totalInvoices = invoices.length;
      const totalProducts = invoices.reduce(
        (sum, invoice) =>
          sum +
          invoice.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
      );

      const uniqueCustomers = new Set<string>();
      invoices.forEach((invoice) => {
        if (invoice.email) {
          uniqueCustomers.add(invoice.email);
        }
      });
      const totalCustomers = uniqueCustomers.size;

      return {
        totalSales,
        totalInvoices,
        totalProducts,
        totalCustomers,
      };
    } catch (error) {
      console.error("Error en GetInvoiceStatisticsUseCase:", error);
      return {
        totalSales: 0,
        totalInvoices: 0,
        totalProducts: 0,
        totalCustomers: 0,
      };
    }
  }
}
