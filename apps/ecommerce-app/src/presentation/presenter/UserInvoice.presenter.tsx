import { useState, useEffect, useCallback } from "react";
import { Invoice } from "../../core/domain/entities/Invoice";
import { useAuthStore } from "../../stores/useAuthStore";
import { container } from "../../di/container";

export const useUserInvoicesPresenter = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const getInvoiceActions = useCallback(() => {
    try {
      return container.resolve("invoiceActions");
    } catch (error) {
      console.error("Error resolving invoiceActions:", error);
      return null;
    }
  }, []);

  const loadUserInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const invoiceActions = getInvoiceActions();

      if (!invoiceActions) {
        throw new Error("No se pudo resolver invoiceActions");
      }

      const allInvoices = await invoiceActions.getInvoices();

      if (user && user.email) {
        const userInvoices = allInvoices.filter(
          (invoice) => invoice.email === user.email
        );
        setInvoices(userInvoices);
      } else {
        setInvoices(allInvoices);
      }
    } catch (error) {
      console.error("Error loading user invoices:", error);
      setError("Error al cargar las facturas del usuario");

      try {
        const storedInvoices = localStorage.getItem("invoices");
        if (storedInvoices) {
          const allInvoices = JSON.parse(storedInvoices);
          if (user && user.email) {
            const userInvoices = allInvoices.filter(
              (invoice: Invoice) => invoice.email === user.email
            );
            setInvoices(userInvoices);
          } else {
            setInvoices(allInvoices);
          }
          setError(null);
        }
      } catch (fallbackError) {
        console.error("Fallback loading failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [getInvoiceActions, user]);

  useEffect(() => {
    loadUserInvoices();
  }, [loadUserInvoices, user]);

  const selectInvoice = useCallback(
    async (invoiceId: string) => {
      setLoading(true);

      try {
        const existingInvoice = invoices.find(
          (invoice) => invoice.invoiceId === invoiceId
        );

        if (existingInvoice) {
          setSelectedInvoice(existingInvoice);
          setLoading(false);
          return;
        }

        const invoiceActions = getInvoiceActions();

        if (!invoiceActions) {
          throw new Error("No se pudo resolver invoiceActions");
        }

        const invoice = await invoiceActions.getInvoiceById(invoiceId);

        if (invoice) {
          setSelectedInvoice(invoice);
        } else {
          throw new Error("Factura no encontrada");
        }
      } catch (error) {
        console.error("Error selecting invoice:", error);
        setError("Error al cargar los detalles de la factura");
      } finally {
        setLoading(false);
      }
    },
    [invoices, getInvoiceActions]
  );

  const clearSelectedInvoice = useCallback(() => {
    setSelectedInvoice(null);
  }, []);

  const refreshInvoices = useCallback(() => {
    loadUserInvoices();
  }, [loadUserInvoices]);

  return {
    invoices,
    selectedInvoice,
    loading,
    error,
    selectInvoice,
    clearSelectedInvoice,
    refreshInvoices,
  };
};
