import { Country } from "../entities/Country";

export interface CountryRepository {
  getCountriesByRegion(region: string): Promise<Country[]>;
  isValidCountryInRegion(countryName: string, region: string): Promise<boolean>;
}

export class RemoteCountryRepository implements CountryRepository {
  private countriesCache: Map<string, Country[]> = new Map();

  async getCountriesByRegion(region: string): Promise<Country[]> {
    if (this.countriesCache.has(region)) {
      return this.countriesCache.get(region) || [];
    }

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );

      if (!response.ok) {
        throw new Error(`Error fetching countries: ${response.statusText}`);
      }

      const countries: Country[] = await response.json();

      this.countriesCache.set(region, countries);

      return countries;
    } catch (error) {
      console.error("Error fetching countries:", error);
      return [];
    }
  }

  async isValidCountryInRegion(
    countryName: string,
    region: string
  ): Promise<boolean> {
    const countries = await this.getCountriesByRegion(region);

    if (!countries.length) {
      return false;
    }

    const normalizedName = countryName.trim().toLowerCase();

    return countries.some((country) => {
      const officialName = country.name.official.toLowerCase();
      const commonName = country.name.common.toLowerCase();

      return officialName === normalizedName || commonName === normalizedName;
    });
  }
}
