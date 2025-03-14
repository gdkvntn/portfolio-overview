export interface Currency {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface Stream {
  data: {
    A: string;
    B: string;
    C: number;
    E: number;
    F: number;
    L: number;
    O: number;
    P: string;
    Q: string;
    a: string;
    b: string;
    c: string;
    e: string;
    h: string;
    l: string;
    n: number;
    o: string;
    p: string;
    q: string;
    s: string;
    v: string;
    w: string;
    x: string;
  };
  stream: string;
}

export interface PortfolioItem {
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  priceChangePercent: number;
}
