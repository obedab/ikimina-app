import { BaseService } from '../../services/base.service';
import type { Contribution } from '../types/contribution';

export class ContributionService extends BaseService<Contribution> {
  constructor() {
    super('contributions');
  }

  async createContribution(data: Contribution): Promise<Contribution> {
    if(!data.userId){
      throw new Error('User is required');
    }

    if (!data.amount || data.amount <= 0){
      throw new Error('Amount must be greater than 0');
    }

    const newContribution = await this.create({
      ...data,
      createdAt: new Date(),
    })

    return newContribution;
  }

  async getAllContributions(): Promise<Contribution[]> {
    return await this.findAll({});
  }

  async getContributionsByConditions(condition: Partial<Contribution>): Promise<Contribution[]>{
    return await this.findMany(condition);
  }

  async getContributionDetails(id: number): Promise<Contribution> {
    const contribution = await this.findById(id);

    if (!contribution) {
      throw new Error('Contribution not found');
    }

    return contribution;
  } 
  
}
