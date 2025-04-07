export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  capital?: string[];
  region: string;
}
