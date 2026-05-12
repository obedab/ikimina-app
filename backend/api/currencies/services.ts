import { BaseService } from '../../services/base.service';
import type { Currency, CurrencyApiResponse } from '../types/currency';

export class CurrencyService extends BaseService<Currency> {
  constructor() {
    super('currencies');
  }

  async createCurrency(data: Omit<Currency, 'id'>): Promise<Currency> {
    const existing = await this.findOne({ code: data.code });

    if (existing) {
      throw new Error('Currency already exists');
    }

    if (data.is_base) {
      await this.clearBaseCurrency();
      data.exchange_rate = 1;
    }

    return this.create({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  async enableBaseCurrency(id: number): Promise<Currency> {
    const currency = await this.findById(id);

    if (!currency) {
      throw new Error('Currency not found');
    }

    await this.clearBaseCurrency();

    await this.update(id, {
      is_base: true,
      exchange_rate: 1,
      updated_at: new Date(),
    });

    const updatedCurrency = await this.findById(id);

    if (!updatedCurrency) {
      throw new Error('Failed to fetch updated currency');
    }

    return updatedCurrency;
  }

  async disableBaseCurrency(id: number): Promise<boolean> {
    const currency = await this.findById(id);

    if (!currency) {
      throw new Error('Currency is not found');
    }

    if (!currency.is_base) {
      throw new Error('This currecy is not base');
    }

    return this.update(id, {
      is_base: false,
      updated_at: new Date(),
    });
  }

  private async clearBaseCurrency(): Promise<void> {
    const baseCurrency = await this.findMany({ is_base: true });

    for (const currency of baseCurrency) {
      await this.update(currency.id, {
        is_base: false,
        updated_at: new Date(),
      });
    }
  }

  async getRates(base = 'eur'): Promise<CurrencyApiResponse> {
    const response = await fetch(
      `https://latest.currency-api.pages.dev/v1/currencies/${base.toLowerCase()}.json`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch currency rates');
    }

    const data: CurrencyApiResponse = (await response.json()) as CurrencyApiResponse;

    return data;
  }

  convertAmount(params: { amount: number; fromRate: number; baseRate: number }) {
    const { amount, fromRate, baseRate } = params;

    return (amount / fromRate) * baseRate;
  }

  async convertToBaseCurrency(params: {
    amount: number;
    fromCurrency: string;
    baseCurrency: string;
  }): Promise<number> {
    const { amount, fromCurrency, baseCurrency } = params;

    const data = await this.getRates(baseCurrency);

    const rates = data[baseCurrency.toLowerCase() as keyof CurrencyApiResponse];

    if (!rates || typeof rates !== 'object') {
      throw new Error('Invalid currency rates response');
    }

    const from = fromCurrency.toLowerCase();
    const base = baseCurrency.toLowerCase();

    if (!rates[from] || !rates[base]) {
      throw new Error('Currency not supported');
    }

    return this.convertAmount({
      amount,
      fromRate: rates[from],
      baseRate: rates[base],
    });
  }
}
