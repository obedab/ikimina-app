export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  isBase: boolean;
  exchangeRate: number;
  createdAt: Date;
  updatedAt: Date;
}
