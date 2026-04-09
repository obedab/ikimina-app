
  export interface Contribution {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  type?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
