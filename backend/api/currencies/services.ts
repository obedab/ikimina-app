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

    if (data.isBase) {
      await this.clearBaseCurrency();
      data.exchangeRate = 1;
    }

    return this.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async enableBaseCurrency(id: number): Promise<boolean> {
    const currency = await this.findById(id);

    if (!currency) {
      throw new Error('Currency not found');
    }

    await this.clearBaseCurrency();

    return this.update(id, {
      isBase: true,
      exchangeRate: 1,
      updatedAt: new Date(),
    });
  }

  async disableBaseCurrency(id: number): Promise<boolean> {
    const currency = await this.findById(id);

    if (!currency) {
      throw new Error('Currency is not found');
    }

    if (!currency.isBase) {
      throw new Error('This currecy is not base');
    }

    return this.update(id, {
      isBase: false,
      updatedAt: new Date(),
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
