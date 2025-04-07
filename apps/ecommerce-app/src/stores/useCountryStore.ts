import { create } from "zustand";
import { container } from "../di/container";
import { Country } from "../core/domain/entities/Country";
import { CountryActions } from "../core/actions/Country.actions";

type CountryStore = {
  countries: Country[];
  loading: boolean;
  error: string | null;
  fetchAmericanCountries: () => Promise<void>;
  isValidAmericanCountry: (countryName: string) => boolean;
};

export const useCountryStore = create<CountryStore>((set, get) => {
  let countryActions: CountryActions;
  try {
    countryActions = container.resolve("countryActions");
  } catch (error) {
    console.error("Error resolviendo countryActions:", error);
    countryActions = {
      getCountriesByRegion: async () => [],
      isValidCountryInRegion: async () => false,
    } as unknown as CountryActions;
  }

  return {
    countries: [],
    loading: false,
    error: null,

    fetchAmericanCountries: async () => {
      try {
        set({ loading: true, error: null });

        const countries = await countryActions.getCountriesByRegion("americas");
        set({ countries, loading: false });

        return;
      } catch (error) {
        console.error("Error fetching American countries:", error);
        set({
          error: "Error al cargar países de América",
          loading: false,
        });
      }
    },

    isValidAmericanCountry: (countryName: string) => {
      const { countries } = get();

      if (!countries.length || !countryName) {
        return false;
      }

      const normalizedName = countryName.trim().toLowerCase();

      return countries.some((country) => {
        const officialName = country.name.official.toLowerCase();
        const commonName = country.name.common.toLowerCase();

        return officialName === normalizedName || commonName === normalizedName;
      });
    },
  };
});
