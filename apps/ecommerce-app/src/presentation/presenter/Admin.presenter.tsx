import { useState, useEffect, useCallback } from "react";
import { Invoice } from "../../core/domain/entities/Invoice";
import { InvoiceStatistics } from "../../core/useCases/Stats/GetStatsUseCase";
import { InvoiceActions } from "../../core/actions/Admin.actions";
import { container } from "../../di/container";

export const useAdminPresenter = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InvoiceStatistics>({
    totalSales: 0,
    totalInvoices: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  const [showModal, setShowModal] = useState(false);

  const handleViewInvoice = (invoiceId: string) => {
    selectInvoice(invoiceId);
    setShowModal(true);
  };

  const getInvoiceActions = useCallback((): InvoiceActions | null => {
    try {
      return container.resolve("invoiceActions");
    } catch (error) {
      console.error("Error resolving invoiceActions:", error);
      return null;
    }
  }, []);

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const invoiceActions = getInvoiceActions();

      if (!invoiceActions) {
        throw new Error("No se pudo resolver invoiceActions");
      }

      const loadedInvoices = await invoiceActions.getInvoices();
      setInvoices(loadedInvoices);

      const statistics = await invoiceActions.getInvoiceStatistics();
      setStats(statistics);
    } catch (error) {
      console.error("Error loading invoices:", error);
      setError("Error al cargar las facturas");
    } finally {
      setLoading(false);
    }
  }, [getInvoiceActions]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const selectInvoice = useCallback(
    async (invoiceId: string) => {
      setLoading(true);

      try {
        const invoiceActions = getInvoiceActions();

        if (!invoiceActions) {
          throw new Error("No se pudo resolver invoiceActions");
        }

        const localInvoice = invoices.find(
          (invoice) => invoice.invoiceId === invoiceId
        );

        if (localInvoice) {
          setSelectedInvoice(localInvoice);
        } else {
          const invoice = await invoiceActions.getInvoiceById(invoiceId);

          if (invoice) {
            setSelectedInvoice(invoice);
          } else {
            throw new Error("Factura no encontrada");
          }
        }
      } catch (error) {
        console.error("Error selecting invoice:", error);
        setError("Error al cargar los detalles de la factura");
      } finally {
        setLoading(false);
      }
    },
    [getInvoiceActions, invoices]
  );

  const clearSelectedInvoice = useCallback(() => {
    setSelectedInvoice(null);
  }, []);

  const refreshData = useCallback(() => {
    loadInvoices();
  }, [loadInvoices]);

  return {
    invoices,
    selectedInvoice,
    loading,
    error,
    stats,
    selectInvoice,
    clearSelectedInvoice,
    refreshData,
    showModal,
    setShowModal,
    handleViewInvoice,
  };
};
