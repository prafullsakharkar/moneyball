// Currency types
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export interface CurrencyRate {
  from: Currency;
  to: Currency;
  rate: number;
  lastUpdated: string;
}

export interface Money {
  amount: number;
  currency: Currency;
  
  // Conversion
  convertedAmount?: number;
  convertedCurrency?: Currency;
}

export interface CurrencySettings {
  defaultCurrency: Currency;
  showCurrencySelector: boolean;
  autoConvert: boolean;
  precision: number;
  format: 'symbol' | 'code' | 'name';
}