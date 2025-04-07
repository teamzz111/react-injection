import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useCountryStore } from "../stores/useCountryStore";
import CheckoutView from "../presentation/screen/Checkout/Checkout";
import { Product } from "../core/domain/entities/Product";
import { Country } from "../core/domain/entities/Country";

const mockCountries: Country[] = [
  {
    name: {
      common: "Colombia",
      official: "Republic of Colombia",
    },
    cca2: "CO",
    capital: ["Bogotá"],
    region: "Americas",
  },
  {
    name: {
      common: "Argentina",
      official: "Argentine Republic",
    },
    cca2: "AR",
    capital: ["Buenos Aires"],
    region: "Americas",
  },
];

const mockProduct: Product = {
  id: 1,
  name: "Manzana Roja",
  category: "Frutas Frescas",
  stock: 50,
  price: 2000,
  tax: 0.19,
};

const mockCartItem = {
  product: mockProduct,
  quantity: 2,
};

// Datos de prueba

const mockHandleSubmit = vi.fn((e) => {
  e.preventDefault();
});

const mockHandleInputChange = vi.fn();

const mockFormData = {
  name: "Usuario Cliente",
  phone: "",
  email: "cliente@example.com",
  country: "",
};

// Mock de los hooks de React Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock de los stores
vi.mock("../stores/useCartStore");
vi.mock("../stores/useAuthStore");
vi.mock("../stores/useCountryStore");
vi.mock("../presentation/presenter/Checkout.presenter");

describe("Checkout Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mock("../presentation/presenter/Checkout.presenter", () => ({
      default: () => ({
        currentInvoice: null,
        showSuccessView: false,
        countries: mockCountries,
        loadingCountries: false,
        countryError: null,
        formData: mockFormData,
        errors: {},
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        isSubmitting: false,
        subtotal: 4000,
        taxes: 760,
        total: 4760,
        isValidAmericanCountry: vi.fn().mockReturnValue(true),
        user: {
          id: "client-123",
          name: "Usuario Cliente",
          role: "client",
          email: "cliente@example.com",
        },
        items: [mockCartItem],
      }),
    }));

    vi.mocked(useCartStore).mockReturnValue({
      items: [mockCartItem],
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      addToCart: vi.fn(),
      clearCart: vi.fn(),
      getTotalPrice: vi.fn().mockReturnValue(4760),
      getTotalItems: vi.fn().mockReturnValue(2),
    });

    vi.mocked(useAuthStore).mockReturnValue({
      user: {
        id: "client-123",
        name: "Usuario Cliente",
        role: "client",
        email: "cliente@example.com",
      },
      isAuthenticated: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useCountryStore).mockReturnValue({
      countries: mockCountries,
      loading: false,
      error: null,
      fetchAmericanCountries: vi.fn(),
      isValidAmericanCountry: vi.fn().mockReturnValue(true),
    });
  });

  it("renders checkout form correctly", () => {
    const { container } = render(
      <BrowserRouter>
        <CheckoutView />
      </BrowserRouter>
    );

    expect(screen.getByText("Finalizar Compra")).toBeDefined();
    expect(screen.getByText("Información de Envío")).toBeDefined();
    expect(screen.getByText("Resumen de la Orden")).toBeDefined();

    expect(screen.getByText("Manzana Roja")).toBeDefined();

    expect(container.querySelector("form")).toBeDefined();
    expect(container.querySelector(".container")).toBeDefined();
  });

  it("displays correct price calculations and handles user input", async () => {
    render(
      <BrowserRouter>
        <CheckoutView />
      </BrowserRouter>
    );

    expect(screen.getAllByText("$4,000")).toBeTruthy(); // Subtotal
    expect(screen.getAllByText("$760")).toBeTruthy(); // Impuestos
    expect(screen.getAllByText("$4,760")).toBeTruthy(); // Total

    const phoneInput = screen.getByLabelText(/teléfono/i);
    const countryInput = screen.getByLabelText(/país/i);

    await act(async () => {
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(countryInput, { target: { value: "Colombia" } });
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it("submits form correctly", async () => {
    render(
      <BrowserRouter>
        <CheckoutView />
      </BrowserRouter>
    );

    const phoneInput = screen.getByLabelText(/teléfono/i);
    const countryInput = screen.getByLabelText(/país/i);

    await act(async () => {
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(countryInput, { target: { value: "Colombia" } });
    });

    const submitButton = screen.getByText(/completar compra/i);

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockHandleSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
