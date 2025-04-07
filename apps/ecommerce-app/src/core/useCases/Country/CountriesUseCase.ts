import { Country } from "../../domain/entities/Country";
import { CountryRepository } from "../../domain/repositories/Country.repository";

export class GetCountriesByRegionUseCase {
  constructor(private countryRepository: CountryRepository) {}

  async execute(region: string): Promise<Country[]> {
    return this.countryRepository.getCountriesByRegion(region);
  }
}

export class IsValidCountryInRegionUseCase {
  constructor(private countryRepository: CountryRepository) {}

  async execute(countryName: string, region: string): Promise<boolean> {
    return this.countryRepository.isValidCountryInRegion(countryName, region);
  }
}
