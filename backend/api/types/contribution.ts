export interface Contribution {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
