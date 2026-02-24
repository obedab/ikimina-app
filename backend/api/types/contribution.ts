export interface Contribution {
  id: number;
  userId: number;              
  amountInCents: number;       
  currency:  string; 
  description?: string;       
  createdAt: Date;
  updatedAt: Date;
}