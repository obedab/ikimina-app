import { BaseService } from '../../services/base.service';
import type { Contribution } from '../types/contribution';

export class ContributionService extends BaseService<Contribution> {
  constructor() {
    super('contributions');
  }

  async getTotalContributions(): Promise<number> {
    const query = `SELECT SUM(amount) as total From ${this.tableName}`;
    const result = await this.pool.query(query);
    const totalCount = (result.rows as { total: number }[])[0].total || 0;
    return totalCount;
  }
}
