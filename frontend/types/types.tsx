export type Transaction = {
  hash: string;
  event: string;
  block: number;
  timestamp: number;
  from: string;
  to: string;
  token1Type?: string;
  token2Type?: string;
  token1Value?: number;
  token2Value?: number;
  token1USDValue?: number;
  token2USDValue?: number;
};
