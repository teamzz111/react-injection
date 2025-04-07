export interface InvoiceItem {
  id: number;
  name: string;
  price: number;
  tax: number;
  quantity: number;
}

export interface Invoice {
  invoiceId: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface ShippingFormData {
  name: string;
  phone: string;
  email: string;
  country: string;
}

export interface InvoiceData extends ShippingFormData {
  invoiceId: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    tax: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}
