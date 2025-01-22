import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  public ExchangeName: string = 'Delta_Exchange';
  public SheetName: string = 'Futures_Trades';
  public Location: string = '';
  isNewEntrySubmitted: boolean = false;
  

  public Date: string = '';
  public Time: string = '';
  public Coin: string = '';
  public Contracts: any = null;
  public Type: string = '';
  public Leverage: any = 25;
  public Open_Price: any = null;
  public Close_Price: any = null;
  public Lot_Value: any = null;
  public Open_Margin: number = 0;
  public Close_Margin: number = 0;
  public Pnl: number = 0;
  public Pnl_Percentage: number = 0;
  public Influencer: string = 'Trade_With_Ash';

  public Platform: string = 'Delta';

  Market: any;
  Direction: any;
  Price: any;
  Amount: any;
  Fees: any;
  Fee_Asset: any;
  Period: any;
  Notes: any;
  

  today: Date = new Date();
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;

  public Quantity: any = null;
  public isQuantityMode: boolean = false;  // To track which input mode user is using

  // Update class properties
  public Exchange_Name: string = 'Delta_Exchange';  // Default value
  public exchangesList: string[] = [
    'Delta_Exchange',
    'BingX',
    'Binance',
    'Bybit',
    'OKX',
    'Mexc'
  ];

  // Update lotValues to be exchange-specific
  public lotValues: { [exchange: string]: { [coin: string]: number } } = {
    'Delta_Exchange': {
      BTC: 0.001,
      ETH: 0.01,
      LTC: 0.1,
      BNB: 0.1,
      SOL: 1,
      XRP: 1,
      LINK: 1,
      DOGE: 100
    },
    'BingX': {
      BTC: 0.001,
      ETH: 0.01,
      LTC: 0.1,
      BNB: 0.1,
      SOL: 1,
      XRP: 1,
      LINK: 1,
      DOGE: 100
    },
    'Binance': {
      BTC: 100,
      ETH: 0.01,
      LTC: 0.1,
      BNB: 0.1,
      SOL: 1,
      XRP: 1,
      LINK: 1,
      DOGE: 100
    }
  };

  // Add new FormControls
  public exchangeControl = new FormControl();
  public coinControl = new FormControl();
  public filteredExchanges!: Observable<string[]>;
  public filteredCoins!: Observable<string[]>;
  public coinsList: string[] = ['BTC', 'ETH', 'LTC', 'BNB', 'SOL', 'XRP', 'LINK', 'DOGE'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,
    
    private firebaseDataService: FirebaseDataService,
    private datePipe: DatePipe,
    private notificationService: NotificationService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddComponent>,
    private router: Router,
  ) {
    // console.log(injectedData)

    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Close dialog on route change
      this.dialogRef.close();
    });
  }
  ngOnInit(): void {
    const indianTimeZone = 'Asia/Kolkata';
    const today = new Date().toLocaleString('en-US', { timeZone: indianTimeZone });
    const todayDate = new Date(today);
    this.Date = todayDate.toISOString().split('T')[0];
    const currentTime = new Date();
    this.Time = currentTime.toTimeString().slice(0, 8);

    this.ExchangeName = this.injectedData.ExchangeName;
    this.SheetName = this.injectedData.SheetName;
    this.injectedData.Location ? this.Location = this.injectedData.Location : '';

    // Setup filtering for influencer
    this.filteredInfluencers = this.influencerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterInfluencers(value))
    );

    // Setup filtering for exchange
    this.filteredExchanges = this.exchangeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterExchanges(value || ''))
    );

    // Setup filtering for coin
    this.filteredCoins = this.coinControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCoins(value || ''))
    );

    // Sync FormControls with ngModel
    this.influencerControl.valueChanges.subscribe(value => {
      this.Influencer = value;
    });

    this.exchangeControl.valueChanges.subscribe(value => {
      this.Exchange_Name = value;
      this.getLotValue();
    });

    this.coinControl.valueChanges.subscribe(value => {
      this.Coin = value;
      this.getLotValue();
    });
  }

  isFormValid(): boolean {
    if (this.SheetName === 'Futures_Trades') {
      const commonValidation = 
        !!this.Date &&
        !!this.Exchange_Name &&
        !!this.Coin &&
        !!this.Type &&
        !!this.Leverage &&
        !!this.Open_Price &&
        !!this.Close_Price;

      // Additional validation based on quantity mode
      if (this.isQuantityMode) {
        return commonValidation && !!this.Quantity;
      } else {
        return commonValidation && !!this.Contracts && !!this.Lot_Value;
      }
    }
    // ... rest of the existing validation code ...
    return false;
  }

  private _filterInfluencers(value: string): string[] {
    const filterValue = value?.toLowerCase() || '';
    return this.dataService.influencersList.filter(option => 
      option.toLowerCase().includes(filterValue)
    );
  }

  private _filterExchanges(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.exchangesList.filter(exchange => 
      exchange.toLowerCase().includes(filterValue)
    );
  }

  private _filterCoins(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.coinsList.filter(coin => 
      coin.toLowerCase().includes(filterValue)
    );
  }

  clearInfluencer() {
    this.Influencer = '';
    this.influencerControl.setValue('');
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.Coin = this.Coin.toUpperCase();
    await this.getLotValue();
    await this.calculateMargin();
    this.uploadTradeData();
  }

  validateForm(): boolean {
    if (!this.Coin || !this.Type || !this.Open_Price || !this.Close_Price) {
      // this.notificationService.error('Please fill all required fields');
      return false;
    }

    // Validate Quantity XOR (Contracts AND Lot_Value)
    if (this.isQuantityMode) {
      if (!this.Quantity) {
        // this.notificationService.error('Please enter Quantity');
        return false;
      }
      if (this.Contracts || this.Lot_Value) {
        // this.notificationService.error('Cannot use Contracts/Lot_Value with Quantity');
        return false;
      }
    } else {
      if (!this.Contracts) {
        // this.notificationService.error('Please enter Contracts');
        return false;
      }
      if (!this.Lot_Value) {
        // this.notificationService.error('Please enter Lot Value');
        return false;
      }
      if (this.Quantity) {
        // this.notificationService.error('Cannot use Quantity with Contracts/Lot_Value');
        return false;
      }
    }

    // const validCoins = ['BTC', 'ETH', 'LTC', 'BNB', 'SOL', 'XRP', 'LINK', 'DOGE'];
    // if (!validCoins.includes(this.Coin.toUpperCase())) {
    //   // this.notificationService.error('Invalid Coin!');
    //   return false;
    // }

    return true;
  }

  onQuantityModeChange(isQuantityMode: boolean) {
    this.isQuantityMode = isQuantityMode;
    if (isQuantityMode) {
      this.Contracts = null;
      this.Lot_Value = null;
    } else {
      this.Quantity = null;
      if (this.Coin) {
        this.getLotValue();
      }
    }
    this.calculateMargin(); // Recalculate after mode change
  }

  onContractsChange() {
    if (!this.isQuantityMode && this.Coin && !this.Lot_Value) {
      this.getLotValue();
    }
    this.calculateMargin(); // Recalculate after contracts change
  }

  async getLotValue() {
    if (!this.isQuantityMode && this.Coin && this.Exchange_Name) {
      const defaultLotValue = this.lotValues[this.Exchange_Name]?.[this.Coin.toUpperCase()];
      if (defaultLotValue) {
        this.Lot_Value = defaultLotValue;
        this.calculateMargin();
      } else {
        this.Lot_Value = null;
      }
    }
  }

  async calculateMargin() {
    if (!this.Open_Price || !this.Close_Price || !this.Leverage) {
      // Reset calculated values if required fields are missing
      this.Open_Margin = 0;
      this.Close_Margin = 0;
      this.Pnl = 0;
      this.Pnl_Percentage = 0;
      return;
    }

    // Check if we have valid quantity data
    if (this.isQuantityMode && !this.Quantity) {
      return;
    }
    if (!this.isQuantityMode && (!this.Contracts || !this.Lot_Value)) {
      return;
    }

    // Calculate quantity based on mode
    const quantity = this.isQuantityMode ? 
      Number(this.Quantity) : 
      (Number(this.Contracts) * Number(this.Lot_Value));

    // Calculate margins using quantity
    this.Open_Margin = (quantity * this.Open_Price) / this.Leverage;
    this.Close_Margin = (quantity * this.Close_Price) / this.Leverage;

    // Calculate PNL based on trade type
    if (this.Type === 'BUY') {
      // For BUY: Profit when Close_Price > Open_Price
      this.Pnl = (this.Close_Price - this.Open_Price) * quantity;
    } else if (this.Type === 'SELL') {
      // For SELL: Profit when Open_Price > Close_Price (reverse of BUY)
      this.Pnl = (this.Open_Price - this.Close_Price) * quantity;
    }

    // Calculate PNL Percentage using Open_Margin
    // The sign (positive/negative) comes from the PNL calculation above
    this.Pnl_Percentage = (this.Pnl / this.Open_Margin) * 100;

    // Format numbers to 3 decimal places
    this.Open_Margin = Number(this.Open_Margin.toFixed(3));
    this.Close_Margin = Number(this.Close_Margin.toFixed(3));
    this.Pnl = Number(this.Pnl.toFixed(3));
    this.Pnl_Percentage = Number(this.Pnl_Percentage.toFixed(3));

    // Log for debugging
    // console.log('Calculated values:', {
    //   Type: this.Type,
    //   quantity,
    //   Open_Price: this.Open_Price,
    //   Close_Price: this.Close_Price,
    //   Leverage: this.Leverage,
    //   Open_Margin: this.Open_Margin,
    //   Close_Margin: this.Close_Margin,
    //   Pnl: this.Pnl,
    //   Pnl_Percentage: this.Pnl_Percentage
    // });
  }

  async uploadTradeData() {
    this.isNewEntrySubmitted = true;

    // Generate unique ID
    const now = new Date();
    const uniqueId = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');

    // Format the selected date to YYYY-MM-DD string
    const formattedDate = this.datePipe.transform(new Date(this.Date), 'yyyy-MM-dd');

    // Get final quantity value
    const quantity = this.isQuantityMode ? 
      Number(this.Quantity) : 
      (Number(this.Contracts) * Number(this.Lot_Value));

    const tradeData = {
      ID: uniqueId,
      Sheet_Name: 'Futures_Trades',
      Date: formattedDate || '',  // Will be in YYYY-MM-DD format
      Coin: this.Coin.toUpperCase(),
      Type: this.Type.toUpperCase(),
      Quantity: quantity,
      Open_Price: Number(Number(this.Open_Price).toString().match(/^-?\d*\.?\d{0,8}/)?.[0] || this.Open_Price),
      Open_Margin: this.Open_Margin,
      Close_Price: Number(Number(this.Close_Price).toString().match(/^-?\d*\.?\d{0,8}/)?.[0] || this.Close_Price),
      Close_Margin: this.Close_Margin,
      Pnl: this.Pnl,
      Pnl_Percentage: this.Pnl_Percentage,
      Influencer: this.Influencer.toUpperCase(),
      Exchange_Name: this.Exchange_Name.toUpperCase(),
      Leverage: Number(this.Leverage)
    };

    try {
      await this.firebaseDataService.uploadTradeData(tradeData);
      this.notificationService.success("Trade data uploaded successfully!");
    } catch (error) {
      this.notificationService.error("Failed to upload trade data");
      console.error("Error uploading data:", error);
    } finally {
      this.isNewEntrySubmitted = false;
    }
  }
}
