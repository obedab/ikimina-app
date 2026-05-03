import { BaseService } from '../../services/base.service';
import type { Currency } from '../types/currency';

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
  async enableBaseCurrency(id: number): Promise<boolean> {
    const currency = await this.findById(id);

    if (!currency) {
      throw new Error('Currency not found');
    }

    await this.clearBaseCurrency();

    return this.update(id, {
      is_base: true,
      exchange_rate: 1,
      updated_at: new Date(),
    });
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
    const baseCurrency = await this.findMany({ isBase: true});
    
    for (const currency of baseCurrency) {
      await this.update(currency.id, {
        isBase: false,
        updatedAt:new Date(),
      });
    }
    
  }
}
