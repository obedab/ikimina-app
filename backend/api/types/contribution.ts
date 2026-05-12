export interface Contribution {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  type?: string;
  originalAmount: number;
  originalCurrency: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContributionSummary {
  totalAmount: number;
  totalContributors: number;
  averagePerContributor: number;
}

export type CreateContributionDTO = {
  userId: number;
  amount: number;
  originalAmount: number;
  originalCurrency: string;
  type?: string;
  description?: string;
};

export type ContributionRow = {
  id: number;
  user_id: number;
  amount: number;
  currency: string;
  type: string;
  original_amount: number;
  original_currency: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
};
