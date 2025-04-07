import { ProductActions } from "../core/actions/Product.actions";
import { ProductsUseCase } from "../core/useCases/Products/ProductsUseCase";
import { UpdateStockUseCase } from "../core/useCases/Products/UpdateStockUseCase";
import { ProductLocalStorageRepository } from "../infraestructure/repositories/ProductLocalStorageRepository";
import { ProductRepository } from "../core/domain/repositories/Product.repository";
import {
  InvoiceLocalStorageRepository,
  InvoiceRepository,
} from "../core/domain/repositories/Invoice.repository";
import { InvoiceActions } from "../core/actions/Admin.actions";
import {
  CreateInvoiceUseCase,
  GetInvoiceByIdUseCase,
  GetInvoicesUseCase,
} from "../core/useCases/Admin/AdminUseCase";
import {
  CountryRepository,
  RemoteCountryRepository,
} from "../core/domain/repositories/Country.repository";
import {
  GetCountriesByRegionUseCase,
  IsValidCountryInRegionUseCase,
} from "../core/useCases/Country/CountriesUseCase";
import { CountryActions } from "../core/actions/Country.actions";
import { GetInvoiceStatisticsUseCase } from "../core/useCases/Stats/GetStatsUseCase";

type Dependencies = {
  productRepository: ProductRepository;
  invoiceRepository: InvoiceRepository;
  countryRepository: CountryRepository;

  getProductsUseCase: ProductsUseCase;
  updateStockUseCase: UpdateStockUseCase;
  getInvoicesUseCase: GetInvoicesUseCase;
  getInvoiceByIdUseCase: GetInvoiceByIdUseCase;
  createInvoiceUseCase: CreateInvoiceUseCase;
  getCountriesByRegionUseCase: GetCountriesByRegionUseCase;
  isValidCountryInRegionUseCase: IsValidCountryInRegionUseCase;

  productActions: ProductActions;
  invoiceActions: InvoiceActions;
  countryActions: CountryActions;

  getInvoiceStatisticsUseCase: GetInvoiceStatisticsUseCase;
};

type DependencyKeys = keyof Dependencies;

class Container {
  private instances: Partial<Dependencies> = {};

  register<K extends DependencyKeys>(key: K, instance: Dependencies[K]): void {
    this.instances[key] = instance;
  }

  resolve<K extends DependencyKeys>(key: K): Dependencies[K] {
    const instance = this.instances[key];

    if (!instance) {
      throw new Error(`No instance registered for key: ${key}`);
    }

    return instance as Dependencies[K];
  }
}

export const container = new Container();

const productRepository = new ProductLocalStorageRepository();
const invoiceRepository = new InvoiceLocalStorageRepository();

container.register("productRepository", productRepository);
container.register("invoiceRepository", invoiceRepository);

const productsUseCase = new ProductsUseCase(productRepository);
const updateStockUseCase = new UpdateStockUseCase(productRepository);

container.register("getProductsUseCase", productsUseCase);
container.register("updateStockUseCase", updateStockUseCase);

const getInvoicesUseCase = new GetInvoicesUseCase(invoiceRepository);
const getInvoiceByIdUseCase = new GetInvoiceByIdUseCase(invoiceRepository);
const createInvoiceUseCase = new CreateInvoiceUseCase(invoiceRepository);

container.register("getInvoicesUseCase", getInvoicesUseCase);
container.register("getInvoiceByIdUseCase", getInvoiceByIdUseCase);
container.register("createInvoiceUseCase", createInvoiceUseCase);
const getInvoiceStatisticsUseCase = new GetInvoiceStatisticsUseCase(
  invoiceRepository
);

const productActions = new ProductActions(productsUseCase);
const invoiceActions = new InvoiceActions(
  getInvoicesUseCase,
  getInvoiceByIdUseCase,
  createInvoiceUseCase,
  getInvoiceStatisticsUseCase
);

container.register("productActions", productActions);
container.register("invoiceActions", invoiceActions);

const countryRepository = new RemoteCountryRepository();
const getCountriesByRegionUseCase = new GetCountriesByRegionUseCase(
  countryRepository
);
const isValidCountryInRegionUseCase = new IsValidCountryInRegionUseCase(
  countryRepository
);
const countryActions = new CountryActions(
  getCountriesByRegionUseCase,
  isValidCountryInRegionUseCase
);

container.register("countryRepository", countryRepository);
container.register("getCountriesByRegionUseCase", getCountriesByRegionUseCase);
container.register(
  "isValidCountryInRegionUseCase",
  isValidCountryInRegionUseCase
);
container.register("countryActions", countryActions);

container.register("getInvoiceStatisticsUseCase", getInvoiceStatisticsUseCase);
