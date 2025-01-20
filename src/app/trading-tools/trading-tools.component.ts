// trading-Tools.component.ts

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tools-tools',
  templateUrl: './trading-tools.component.html',
  styleUrls: ['./trading-tools.component.scss']
})
export class TradingToolsComponent implements OnInit {
  currentPrice: any;
  orderPrice: any; 
  pnlPercentage: number | null = null;
  buyPrice: any;
  sellPrice: any;
  buyPriceFutures: any;
  sellPriceFutures: any;
  profitPercentage: number | null = null;
  profitPercentageFutures: number | null = null;
  averagePrice: number | null = null;
  leverage: any;

  // New properties for filtering
  filterButtons: { label: string, section: string }[] = [
    { label: 'Profits Targets', section: 'profitTargets' },
    { label: 'Pnl (Futures)', section: 'pnl_futures' },
    { label: 'Target Price using %', section: 'targetPrice' },
    { label: 'Price %', section: 'price' },
    { label: 'Pnl %', section: 'pnl' },
    { label: 'Fee %', section: 'feePercentage' },
    { label: 'Fee using %', section: 'fee' },
    { label: 'Average Price', section: 'averagePrice' },

  ];

  // Initially dont show all sections
  showPnlPercentageFuturesSection: boolean = false;
  showTargetPriceSection: boolean = false;
  showProfitTargetsSection: boolean = false;


  showPricePercentageSection: boolean = false;
  showPnlPercentageSection: boolean = false;

  showAveragePriceSection: boolean = false;

  showFeeInPercentageSection: boolean = false;
  showFeeInAssetSection: boolean = false;

constructor(){}

  ngOnInit(): void {
    this.toggleFavourites();
  }

selectedFilters: string[] = [];


toggleFilter(section: string) {
  const index = this.selectedFilters.indexOf(section);
  if (index === -1) {
    this.selectedFilters.push(section);
    this.showSection(section, true);
  } else {
    this.selectedFilters.splice(index, 1);
    this.showSection(section, false);
  }
}

showSection(section: string, value: boolean) {
  switch (section) {
    case 'profitTargets':
      this.showProfitTargetsSection = value;
      break;
    case 'pnl_futures':
      this.showPnlPercentageFuturesSection = value;
      break;
    case 'targetPrice':
      this.showTargetPriceSection = value;
      break;
    case 'price':
      this.showPricePercentageSection = value;
      break;
    case 'pnl':
      this.showPnlPercentageSection = value;
      break;
    case 'feePercentage':
      this.showFeeInPercentageSection = value;
      break;
    case 'fee':
      this.showFeeInAssetSection = value;
      break;
    case 'averagePrice':
      this.showAveragePriceSection = value;
      break;
    default:
      break;
  }
}





isFilterSelected(section: string) {
  return this.selectedFilters.includes(section);
}

  toggleAllSections() {
    const shouldShowAll = !this.showProfitTargetsSection || !this.showPnlPercentageFuturesSection || !this.showTargetPriceSection || !this.showPricePercentageSection || !this.showPnlPercentageSection || !this.showAveragePriceSection || !this.showFeeInPercentageSection || !this.showFeeInAssetSection;

    this.showProfitTargetsSection = shouldShowAll;
    this.showPnlPercentageFuturesSection = shouldShowAll;
    this.showTargetPriceSection = shouldShowAll;
    this.showPricePercentageSection = shouldShowAll;
    this.showPnlPercentageSection = shouldShowAll;
    this.showAveragePriceSection = shouldShowAll;
    this.showFeeInPercentageSection = shouldShowAll;
    this.showFeeInAssetSection = shouldShowAll;

    this.selectedFilters = shouldShowAll ? this.filterButtons.map(button => button.section) : [];
  }
  getAllButtonText() {
    const allShown = this.filterButtons.every(button => this.isFilterSelected(button.section));
    return allShown ? 'Hide All' : 'Show All';
  }

  toggleFavourites() {
    const shouldShowDefault = !this.showPnlPercentageFuturesSection || !this.showTargetPriceSection || !this.showProfitTargetsSection;

    this.showPnlPercentageFuturesSection = shouldShowDefault;
    this.showTargetPriceSection = shouldShowDefault;
    this.showProfitTargetsSection = shouldShowDefault;

    if (shouldShowDefault) {
      this.selectedFilters.push('pnl_futures', 'targetPrice', 'profitTargets');
    } else {
      this.selectedFilters = this.selectedFilters.filter(section => section !== 'pnl_futures' && section !== 'targetPrice' && section !== 'profitTargets');
    }
  }
  getFavouritesButtonText() {
    const allDefaultsShown = this.showPnlPercentageFuturesSection && this.showTargetPriceSection && this.showProfitTargetsSection;
    return allDefaultsShown ? 'Hide Favourites' : 'Show Favourites';
  }





  

  calculatePnl() {
    this.pnlPercentage = ((this.orderPrice - this.currentPrice) / Math.abs(this.currentPrice)) * 100;
  }

  calculateProfit() {
    this.profitPercentage = ((this.sellPrice - this.buyPrice) / Math.abs(this.buyPrice)) * 100;
  }
  calculateProfitFutures() {
    this.profitPercentageFutures = (((this.sellPriceFutures - this.buyPriceFutures) / Math.abs(this.buyPriceFutures)) * 100) * this.leverage;
  }
  // New property for the additional tool
  inputPrice: any;
  inputPercentage: any;
  resultingPriceLong: number | null = null;
  resultingPriceShort: number | null = null;


  // Existing properties for filtering and other tools remain unchanged...

  // Existing methods for calculating PnL and profit remain unchanged...

  // New method for calculating resulting price
  calculateResultingPrice() {
    this.resultingPriceLong = this.inputPrice * (1 + this.inputPercentage / 100);
    this.resultingPriceShort = this.inputPrice * (1 - this.inputPercentage / 100);

  }


  // ---------------------calculate avg price, totalQuantity and totalCost----------------
  //#region  AverageBuyPrice
  transactions: any[] = [];
  avgPrice: any;
  totalQuantity: any;
  totalCost: any;

  addTransaction() {
    const newTransaction: any = {
      buyPrice: null,
      amount: null,
      totalCost: null
    };
    this.transactions.push(newTransaction);
  }

  removeTransaction(index: number) {
    this.transactions.splice(index, 1);
  }

  calculateAvgPrice() {
    this.totalQuantity = 0;
    this.totalCost = 0;

    for (const transaction of this.transactions) {
      if (transaction.amount && transaction.totalCost) {
        this.totalQuantity += transaction.amount;
        this.totalCost += transaction.totalCost;
      }
    }

    if (this.totalQuantity > 0 && this.totalCost > 0) {
      this.avgPrice = this.totalCost / this.totalQuantity;
      // console.log('Average Price:', this.avgPrice);
      // console.log('Total Quantity:', this.totalQuantity);
      // console.log('Total Cost:', this.totalCost);
    } else {
      // console.log('Please enter valid amounts and total costs for each transaction.');
    }
  }

  //#endregion


//#region Profit Targets

profitTargets: any[] = [{ profitTarget: null }];
profitTargets_BuyPrice: any;
profitTargets_StopPrice: any;
profitTargets_Leverage: any;
profitTargets_Margin: any;
profitTarget_Type:any;

profitTargets_Qty: any;
profitTargets_Loss: any;
profitTargets_Profits: any[] = [];
profitTargets_LiquidationPrice:any;
profitTargets_LiquidationPricePercentage:any;

resultsVisible = false;

addProfitTarget() {
  const newProfitTarget: any = {
    profitTarget: null
  };
  this.profitTargets.push(newProfitTarget);
}

removeProfitTarget(index: number) {
  if (this.profitTargets.length > 1) {
    this.profitTargets.splice(index, 1);
  }
}

calculateProfitTargets() {
  this.resultsVisible = true; // Show the results when calculate is pressed
  this.performProfitTargetCalculations();
}

performProfitTargetCalculations() {
  const margin = this.profitTargets_Margin ? this.profitTargets_Margin : 1;
  this.profitTargets_Qty = margin / this.profitTargets_BuyPrice;
  this.profitTargets_Profits = [];

  for (let profitTarget of this.profitTargets) {
    const profit = (profitTarget.profitTarget - this.profitTargets_BuyPrice) * this.profitTargets_Qty * this.profitTargets_Leverage;
    this.profitTargets_Profits.push(profit.toFixed(3));
  }

  if (this.profitTargets_StopPrice) {
    this.profitTargets_Loss =( -1 * (this.profitTargets_BuyPrice - this.profitTargets_StopPrice) * this.profitTargets_Qty * this.profitTargets_Leverage ).toFixed(3);
  } else {
    this.profitTargets_Loss = undefined;
  }

  if (this.profitTarget_Type) {
    const maintenanceMargin = 0.0056; // Maintenance margin rate for MEXC (0.56%)

    if (this.profitTarget_Type === 'LONG') {
      const rawLiquidationPrice = (this.profitTargets_BuyPrice * this.profitTargets_Leverage) / (this.profitTargets_Leverage + 1);
      this.profitTargets_LiquidationPrice = rawLiquidationPrice * (1 - maintenanceMargin);
    } else if (this.profitTarget_Type === 'SHORT') {
      const rawLiquidationPrice = (this.profitTargets_BuyPrice * this.profitTargets_Leverage) / (this.profitTargets_Leverage - 1);
      this.profitTargets_LiquidationPrice = rawLiquidationPrice * (1 + maintenanceMargin);
    }

    this.profitTargets_LiquidationPricePercentage = ((this.profitTargets_LiquidationPrice - this.profitTargets_BuyPrice) / this.profitTargets_BuyPrice) * 100;
    this.profitTargets_LiquidationPricePercentage = parseFloat(this.profitTargets_LiquidationPricePercentage.toFixed(3));
  }

 
// console.log(this.pr)


  
}

calculatePercentage(targetPrice: number, isStopLoss: boolean = false): string {
  const buyPrice = this.profitTargets_BuyPrice;
  const margin = this.profitTargets_Margin ? this.profitTargets_Margin : 1;
  this.profitTargets_Qty = margin / buyPrice;

  if (buyPrice !== 0) {
    const priceDifference = isStopLoss ? (buyPrice - targetPrice) : (targetPrice - buyPrice);
    const profit = priceDifference * this.profitTargets_Qty * this.profitTargets_Leverage;
    const percentage = (profit / (buyPrice * this.profitTargets_Qty)) * 100;
    return (isStopLoss ? -percentage : percentage).toFixed(3); // Ensure stop loss percentage is negative
  }
  return '0.00';
}

isFormValid(): boolean {
  const requiredFieldsFilled = this.profitTargets_BuyPrice && this.profitTargets_Leverage;
  const stopPriceOrProfitTargetsFilled = this.profitTargets_StopPrice || this.profitTargets.some(pt => pt.profitTarget);

  return requiredFieldsFilled && stopPriceOrProfitTargetsFilled && this.profitTarget_Type;
}

//#endregion







  showLessCoinsFlag: boolean = false;
  show_advance_options: boolean = false;
  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options
  }


  // <!-- -----------------------------new tools for fee and vice versa------------------------STARTS-- -->

  amount1: number | null = null;
  fee1: number | null = null;
  feePercentageResult: number | null = null;

  amount2: number | null = null;
  feePercentage: number | null = null;
  feeInUSDResult: number | null = null;

  calculateFeePercentage() {
    if (this.amount1 !== null && this.fee1 !== null) {
      // this.feePercentageResult = (this.fee1 / this.amount1) * 100;
      this.feePercentageResult = +(this.fee1 / this.amount1 * 100).toFixed(3);

      // console.log(':RESULT:', this.feePercentageResult)

    }

  }

  calculateFeeInUSD() {
    if (this.amount2 !== null && this.feePercentage !== null) {
      // this.feeInUSDResult = (this.feePercentage / 100) * this.amount2;

      this.feeInUSDResult = +(this.feePercentage / 100 * this.amount2).toFixed(3);
      // console.log(':RESULT:', this.feeInUSDResult)
    }
  }

  






  // <!-- -----------------------------new tools for fee and vice versa------------------------ENDS-- -->




  clearForm(form: NgForm) {
    form.reset();

  }
}
