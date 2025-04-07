import { Country } from "../domain/entities/Country";
import {
  GetCountriesByRegionUseCase,
  IsValidCountryInRegionUseCase,
} from "../useCases/Country/CountriesUseCase";

export class CountryActions {
  constructor(
    private getCountriesByRegionUseCase: GetCountriesByRegionUseCase,
    private isValidCountryInRegionUseCase: IsValidCountryInRegionUseCase
  ) {}

  async getCountriesByRegion(region: string): Promise<Country[]> {
    return this.getCountriesByRegionUseCase.execute(region);
  }

  async isValidCountryInRegion(
    countryName: string,
    region: string
  ): Promise<boolean> {
    return this.isValidCountryInRegionUseCase.execute(countryName, region);
  }
}
