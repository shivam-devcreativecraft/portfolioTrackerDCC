import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Trade {
  Date: string;
  Type: 'BUY' | 'SELL';
  Price: number;
  Quantity: number;
  Influencer: string;
  Period: string;
  Notes: string;
}

interface TradeData {
  trades: Trade[];
  buyTrades: number;
  sellTrades: number;
  averageBuyPrice: number;
  remainingQuantity: number;
  currentValue: number;
}

interface TradeDetailsData {
  exchangeName: string;
  coinName: string;
  tradeData: TradeData;
}

@Component({
  selector: 'app-trade-details-modal',
  templateUrl: './trade-details-modal.component.html',
  styleUrls: ['./trade-details-modal.component.scss']
})
export class TradeDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TradeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TradeDetailsData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getLatestTrade(): Trade | null {
    return this.data?.tradeData?.trades?.[0] || null;
  }

  getTradeType(): string {
    return this.getLatestTrade()?.Type || '-';
  }

  getTradeDate(): string | null {
    return this.getLatestTrade()?.Date || null;
  }

  getTradePrice(): number {
    return this.getLatestTrade()?.Price || 0;
  }

  getTradeQuantity(): number {
    return this.getLatestTrade()?.Quantity || 0;
  }

  getTotalValue(): number {
    const trade = this.getLatestTrade();
    return trade ? trade.Price * trade.Quantity : 0;
  }

  getInfluencer(): string {
    return this.getLatestTrade()?.Influencer || '-';
  }

  getPeriod(): string {
    return this.getLatestTrade()?.Period || '-';
  }

  getNotes(): string {
    return this.getLatestTrade()?.Notes || '-';
  }

  getCurrentHoldings(): number {
    return this.data?.tradeData?.currentValue || 0;
  }

  getAverageBuyPrice(): number {
    return this.data?.tradeData?.averageBuyPrice || 0;
  }

  getRemainingQuantity(): number {
    return this.data?.tradeData?.remainingQuantity || 0;
  }

  getCurrentValue(): number {
    return this.getAverageBuyPrice() * this.getRemainingQuantity();
  }

  isHolding(): boolean {
    return (this.getCurrentHoldings() > 0.1);
  }

  getBuyTrades(): number {
    return this.data?.tradeData?.buyTrades || 0;
  }

  getSellTrades(): number {
    return this.data?.tradeData?.sellTrades || 0;
  }

  getFirstTradeDate(): string | null {
    const trades = this.data?.tradeData?.trades;
    if (!trades || trades.length === 0) return null;
    return trades[trades.length - 1].Date;
  }

  getLastTradeDate(): string | null {
    return this.getTradeDate();
  }

  getTradingDuration(): number {
    const firstDate = this.getFirstTradeDate();
    const lastDate = this.getLastTradeDate();
    if (!firstDate || !lastDate) return 0;
    
    const firstTime = new Date(firstDate).getTime();
    const lastTime = new Date(lastDate).getTime();
    return Math.floor((lastTime - firstTime) / (1000 * 60 * 60 * 24));
  }

  getHoldingDuration(): number {
    const lastDate = this.getLastTradeDate();
    if (!lastDate || !this.isHolding()) return 0;
    
    const lastTime = new Date(lastDate).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((currentTime - lastTime) / (1000 * 60 * 60 * 24));
  }
} 