import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useCartStore } from "../../stores/useCartStore";
import { useCountryStore } from "../../stores/useCountryStore";
import {
  InvoiceData,
  ShippingFormData,
} from "../../core/domain/entities/Invoice";
import { useNavigate } from "react-router-dom";

const useCheckoutPresenter = () => {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const {
    countries,
    loading: loadingCountries,
    error: countryError,
    fetchAmericanCountries,
    isValidAmericanCountry,
  } = useCountryStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<ShippingFormData>({
    name: user?.name || "",
    phone: "",
    email: user?.email || "",
    country: "",
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessView, setShowSuccessView] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(
    null
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const taxes = items.reduce(
    (sum, item) => sum + item.product.price * item.product.tax * item.quantity,
    0
  );

  const total = subtotal + taxes;

  useEffect(() => {
    fetchAmericanCountries();
  }, [fetchAmericanCountries]);

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0 && !showSuccessView) {
      navigate("/");
    }
  }, [items.length, navigate, showSuccessView]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (errors[name as keyof ShippingFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^[0-9]{7,15}$/.test(formData.phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!formData.country.trim()) {
      newErrors.country = "El país es requerido";
    } else if (!isValidAmericanCountry(formData.country)) {
      newErrors.country = "El país debe estar en América";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateInvoiceId = (): string => {
    return `FAC-${Date.now().toString(36).toUpperCase()}`;
  };

  const saveInvoice = (invoice: InvoiceData): void => {
    try {
      const existingInvoices: InvoiceData[] = JSON.parse(
        localStorage.getItem("invoices") || "[]"
      );

      existingInvoices.push(invoice);

      localStorage.setItem("invoices", JSON.stringify(existingInvoices));
    } catch (error) {
      console.error("Error guardando factura:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const invoice: InvoiceData = {
        invoiceId: generateInvoiceId(),
        date: new Date().toISOString(),
        ...formData,
        email: user?.email || formData.email,
        items: items.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          tax: item.product.tax,
          quantity: item.quantity,
        })),
        subtotal,
        tax: taxes,
        total,
      };

      saveInvoice(invoice);

      setCurrentInvoice(invoice);

      setShowSuccessView(true);

      clearCart();
    } catch (error) {
      console.error("Error procesando checkout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentInvoice,
    showSuccessView,
    setShowSuccessView,
    countries,
    loadingCountries,
    countryError,
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    subtotal,
    taxes,
    total,
    isValidAmericanCountry,
    validateForm,
    clearCart,
    setFormData,
    setErrors,
    setIsSubmitting,
    setCurrentInvoice,
    generateInvoiceId,
    saveInvoice,
    user,
    items,
  };
};

export default useCheckoutPresenter;
