import { Invoice } from "../entities/Invoice";

export interface InvoiceRepository {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(invoiceId: string): Promise<Invoice | null>;
  saveInvoice(invoice: Invoice): Promise<void>;
}

export class InvoiceLocalStorageRepository implements InvoiceRepository {
  private readonly STORAGE_KEY = "invoices";

  async getInvoices(): Promise<Invoice[]> {
    try {
      const storedInvoices = localStorage.getItem(this.STORAGE_KEY);

      if (storedInvoices) {
        return JSON.parse(storedInvoices);
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error getting invoices:", error);
      throw error;
    }
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const invoices = await this.getInvoices();
      return (
        invoices.find((invoice) => invoice.invoiceId === invoiceId) || null
      );
    } catch (error) {
      console.error("Error getting invoice by id:", error);
      throw error;
    }
  }

  async saveInvoice(invoice: Invoice): Promise<void> {
    try {
      const invoices = await this.getInvoices();
      const updatedInvoices = [...invoices, invoice];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedInvoices));
    } catch (error) {
      console.error("Error saving invoice:", error);
      throw error;
    }
  }
}
