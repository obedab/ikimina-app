import { BaseService } from '../services/baseService';
import type { Contribution } from '../types/contribution.ts';

export class ContributionService extends BaseService<Contribution> {
  constructor() {
    super('contributions');
  }
  async findUserId(userId): promise<contribution[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1 ORDER BY date DESC`;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async getTotalContributions(): promise<number> {
    const query = `SELECT  SUM(amount)as total From ${this.tableName}`;
    const result = await this.pool.query(query);
    return parseFloat(result.rows[0].total || '0');
  }
}
