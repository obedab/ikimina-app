import { BaseService } from '../../services/base.service';
import type {
  Contribution,
  CreateContributionDTO,
  ContributionSummary,
} from '../types/contribution';

export class ContributionService extends BaseService<Contribution> {
  constructor() {
    super('contributions');
  }

  async createContribution(data: CreateContributionDTO): Promise<Contribution> {
    if (!data.userId) {
      throw new Error('User is required');
    }

    if (!data.amount || data.amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const newContribution = await this.create({
      ...data,
      createdAt: new Date(),
    });

    return newContribution;
  }

  async fetchContributions(filters?: Partial<Contribution>): Promise<Contribution[]> {
    return await this.findAll(filters || {});
  }

  async getContributionDetails(id: number): Promise<Contribution> {
    const contribution = await this.findById(id);

    if (!contribution) {
      throw new Error('Contribution not found');
    }

    return contribution;
  }

  async getContributionSummary(): Promise<ContributionSummary> {
    const query = `
    SELECT 
      COALESCE(SUM(amount), 0) AS "totalAmount",
      COUNT(DISTINCT user_id) AS "totalContributors",
      COALESCE(SUM(amount), 0) / NULLIF(COUNT(DISTINCT user_id), 0) AS "averagePerContributor"
    FROM ${this.tableName};
  `;

    const result = await this.pool.query<{
      totalAmount: number;
      totalContributors: number;
      averagePerContributor: number;
    }>(query);

    return result.rows[0];
  }
}
