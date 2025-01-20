import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.scss'],
  providers: [DatePipe] // Add DatePipe to component providers
})
export class UpdateEntryComponent implements OnInit, OnChanges {
  public sheetName: string = '';
  public exchangeName: string = ''
  dataToUpdate: any;
  public isNewEntrySubmitted: boolean = false;
  SubmittedEntityCount: number = 0;

  //Futures_ACT_Positions, Future_Positions | MEXC

  public Open_Date: any; // Changed to any to hold Date object
  public Open_Time: string | null = '';
  public Trading_Pair: string = '';
  public Direction: string = '';
  public Leverage: any;
  public Amount_Coin: any;
  public Entry_Price: any;
  public Exit_Price: any;
  public Pnl_USDT: any;
  public Pnl_Percentage: any;
  public Close_Date: any;
  public Close_Time: any;
  public Influencer: string = '';

  // Spot_Trades | MEXC

  public Date: any;
  public Time: any;
  public Market: string = '';
  public Price: any;
  public Amount: any;
  public Total_USDT: any;
  public Fees: any;
  public Fee_Asset: string = '';
  public Period: string = '';
  public Notes: string = '';
  public TradingView_Account: any;


  //Money_Flow | MEXC

  public Amount_USDT: any;
  public Network: string = '';
  public Type: string = '';
  public Exchange: string = ''
  public Account: string = 'cvam159951@gmail.com';


  //P2P 
  public Amount_INR: any;
  public Order_Type: string = '';

  //Futures_Closed_Pnl & Futures_Closed_Pnl_Copy_Tarder_Master | BYBIT
  public Date_Creation: any;
  public Contracts: string = '';
  public Opening_Direction: string = '';
  public Closing_Direction: string = '';
  public Qty: any;
  public Closed_Pnl: any;
  public Closed_Pnl_Percentage: any


  //Portfoio-notes : notes

  public Sheet: string = '';

  // SIP_Open_Orders
  public Qty_Open_Order: any;
  public Filled: string = '';
  public Is_Placed: string = '';
  public IS_TradingView_Setup: string = '';


  //Freebitco
  today: Date = new Date();
  public Event: string = '';
  public Side: string = '';
  public Invested: any;
  public Return: any;
  public Result: string = '';
  public Amount_SAT: any;
  public Amount_FUN: any;
  public Principal: any;
  public Maturity: any;
  public Earning: any;
  public Days: any;
  public APY: any;
  public Expires_Date: any;
  public Expires_Time: any;
  public Status: string = ''
  public Quantity: any;
  public Cost: any;
  public Statergy: string = '';



  // --------------------
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;



  // ---------------------
  public accountsControl = new FormControl();
  public filteredAccounts!: Observable<string[]>;



  private accountsList: string[] = [
    'shivamcp10@gmail.com',
    'cvam159951@gmail.com',
    'drkdr.shivamji@gmail.com'

  ];
  // ------------------
  public exchangesControl = new FormControl();
  public filteredExchanges!: Observable<string[]>;


  private exchangesList: string[] = [
    'BINANCE',
    'BYBIT',
    'MEXC',
    'KUCOIN',
    'GATEIO',
    'FREEBITCO',
    'BITGET',
    'BINGX'

  ];



  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedTradeData: any,
    public dialogRef: MatDialogRef<UpdateEntryComponent>,
    public _dialog: MatDialog,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService, // Inject DatePipe
    private router: Router,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataService : DataService

  ) {


    // this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
    //   this.IsMasterControlEnabled = IsEnabled;
    // })


  }

  ngOnInit() {
    this.exchangeName = this.injectedTradeData.exchangeName;
    this.sheetName = this.injectedTradeData.sheetName;
    this.dataToUpdate = this.injectedTradeData.tradeData


    // const indianTimeZone = 'Asia/Kolkata';
    // const today = new Date().toLocaleString('en-US', { timeZone: indianTimeZone });
    // const todayDate = new Date(today);
    // const currentTime = new Date();




    if (this.dataToUpdate && (this.sheetName === 'Futures_ACT_Positions' || this.sheetName === 'Futures')) {

      if (this.dataToUpdate.Open_Date) {
        const open_dateTime = new Date(this.dataToUpdate.Open_Date);
        this.Open_Date = open_dateTime; // Directly assigning Date object
        this.Open_Time = this.datePipe.transform(open_dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }
      this.Trading_Pair = this.dataToUpdate.Trading_Pair;
      this.Direction = this.dataToUpdate.Direction;
      this.Leverage = this.dataToUpdate.Leverage;
      this.Amount_Coin = this.dataToUpdate.Amount_Coin;
      this.Entry_Price = this.dataToUpdate.Entry_Price;
      this.Exit_Price = this.dataToUpdate.Exit_Price;
      this.Pnl_USDT = this.dataToUpdate.Pnl_USDT;

      if (this.dataToUpdate.Close_Date) {
        const close_dateTime = new Date(this.dataToUpdate.Close_Date);
        this.Close_Date = close_dateTime; // Directly assigning Date object
        this.Close_Time = this.datePipe.transform(close_dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }

      this.Influencer = this.dataToUpdate.Influencer
    }
    if (this.dataToUpdate && this.sheetName === 'Spot_Trades') {
      if (this.dataToUpdate.Date) {
        const dateTime = new Date(this.dataToUpdate.Date);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }

      this.Market = this.dataToUpdate.Market;
      this.Direction = this.dataToUpdate.Direction;
      this.Price = this.dataToUpdate.Price;
      this.Amount = this.dataToUpdate.Amount;
      this.Total_USDT = this.dataToUpdate.Total_USDT;
      this.Fees = this.dataToUpdate.Fees;
      this.Fee_Asset = this.dataToUpdate.Fee_Asset;
      this.Influencer = this.dataToUpdate.Influencer;
      this.Period = this.dataToUpdate.Period;
      this.Notes = this.dataToUpdate.Notes;
      this.TradingView_Account = this.dataToUpdate.TradingView_Account;

    }


    if (this.dataToUpdate && this.sheetName === 'Money_Flow') {
      if (this.dataToUpdate.Date) {
        const dateTime = new Date(this.dataToUpdate.Date);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }
      this.Amount_USDT = this.dataToUpdate.Amount_USDT;
      this.Fees = this.dataToUpdate.Fees;
      this.Network = this.dataToUpdate.Network;
      this.Type = this.dataToUpdate.Type;
      this.Exchange = this.dataToUpdate.Exchange;
      this.Account = this.dataToUpdate.Account;
      this.Notes = this.dataToUpdate.Notes;


    }

    if (this.dataToUpdate && this.sheetName === 'P2P') {
      if (this.dataToUpdate.Date) {
        const dateTime = new Date(this.dataToUpdate.Date);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }
      this.Order_Type = this.dataToUpdate.Order_Type;
      this.Price = this.dataToUpdate.Price;
      this.Amount_USDT = this.dataToUpdate.Amount_USDT;
      this.Amount_INR = this.dataToUpdate.Amount_INR;
      this.Notes = this.dataToUpdate.Notes;
    }
    if (this.dataToUpdate && (this.sheetName === 'Futures_Closed_Pnl')) {

      if (this.dataToUpdate.Date_Creation) {
        const dateTime = new Date(this.dataToUpdate.Date_Creation);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }
      this.Contracts = this.dataToUpdate.Contracts;
      this.Opening_Direction = this.dataToUpdate.Opening_Direction;
      // this.Closing_Direction=this.dataToUpdate.Closing_Direction;
      this.Leverage = this.dataToUpdate.Leverage
      this.Qty = this.dataToUpdate.Qty;
      this.Entry_Price = this.dataToUpdate.Entry_Price;
      this.Exit_Price = this.dataToUpdate.Exit_Price;
      this.Closed_Pnl = this.dataToUpdate.Closed_Pnl;
      this.Closed_Pnl_Percentage = this.dataToUpdate.Closed_Pnl_Percentage;
      this.Influencer = this.dataToUpdate.Influencer;
      this.Notes = this.dataToUpdate.Notes;




    }

    if (this.dataToUpdate && this.exchangeName === 'Portfolio_Notes' && this.sheetName === 'Notes') {
      if (this.dataToUpdate.Date) {
        const dateTime = new Date(this.dataToUpdate.Date);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }

      this.Type = this.dataToUpdate.Type;
      this.Exchange = this.dataToUpdate.Exchange;
      this.Sheet = this.dataToUpdate.Sheet;
      this.Notes = this.dataToUpdate.Notes;



    }

    if (this.dataToUpdate && (this.sheetName === 'SIP_Open_Orders')) {
      if (this.dataToUpdate.Date) {
        const dateTime = new Date(this.dataToUpdate.Date);
        this.Date = dateTime; // Directly assigning Date object
        this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
      }
      this.Trading_Pair = this.dataToUpdate.Trading_Pair;
      this.Type = this.dataToUpdate.Type;
      this.Price = this.dataToUpdate.Price;
      this.Qty_Open_Order = this.dataToUpdate.Qty_Open_Order;
      this.Amount = this.dataToUpdate.Amount;
      this.Filled = this.dataToUpdate.Filled;
      this.Is_Placed = this.dataToUpdate.Is_Placed;
      this.Exchange = this.dataToUpdate.Exchange;
      this.Period = this.dataToUpdate.Period;
      this.IS_TradingView_Setup = this.dataToUpdate.IS_TradingView_Setup;
      this.TradingView_Account = this.dataToUpdate.TradingView_Account;

    }

    if (this.dataToUpdate && (this.exchangeName === 'Freebitco')) {
      if (this.sheetName === 'Premium') {

        if (this.dataToUpdate.Date) {
          const dateTime = new Date(this.dataToUpdate.Date);
          this.Date = dateTime; // Directly assigning Date object
          this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
        }

        this.Principal = this.dataToUpdate.Principal;
        this.Maturity = this.dataToUpdate.Maturity;
        this.Earning = this.dataToUpdate.Earning;
        this.Days = this.dataToUpdate.Days;
        this.APY = this.dataToUpdate.APY;
        this.Status = this.dataToUpdate.Status;

        if (this.dataToUpdate.Expires_Date) {
          const dateTime = new Date(this.dataToUpdate.Expires_Date);
          this.Expires_Date = dateTime; // Directly assigning Date object
          this.Expires_Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
        }


      }

      if (this.sheetName === 'Fun_Buying') {
        if (this.dataToUpdate.Date) {
          const dateTime = new Date(this.dataToUpdate.Date);
          this.Date = dateTime; // Directly assigning Date object
          this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
        }
        this.Price = this.dataToUpdate.Price;
        this.Cost = this.dataToUpdate.Cost;
        this.Amount = this.dataToUpdate.Amount;
        this.Type = this.dataToUpdate.Type;
        this.Statergy = this.dataToUpdate.Statergy;

      }

      if (this.sheetName === 'Money_Flow') {
        if (this.dataToUpdate.Date) {
          const dateTime = new Date(this.dataToUpdate.Date);
          this.Date = dateTime; // Directly assigning Date object
          this.Time = this.datePipe.transform(dateTime, 'HH:mm:ss'); // Format time as HH:mm:ss
        }
        this.Quantity = this.dataToUpdate.Quantity;
        this.Type = this.dataToUpdate.Type;
        this.Price = this.dataToUpdate.Price;
        this.Fees = this.dataToUpdate.Fees;
        this.Amount = this.dataToUpdate.Amount;
        this.Exchange = this.dataToUpdate.Exchange;
        this.Account = this.dataToUpdate.Account;
        this.Notes = this.dataToUpdate.Notes;
      }

    }

  }

  onClose(): void {
    this.dialogRef.close();

    if (this.SubmittedEntityCount != 0 && (this.injectedTradeData.location) != 'dialog') {


      const message = `New Data Update Found ! Refresh Data ?`;

      const dialogData = new ConfirmDialogModel("Confirm", message);

      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        // position: { left: '550px', top: '365px' }, // Adjust these values as needed
        data: dialogData
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === true) {

          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });

          this.SubmittedEntityCount = 0;

        } else {

          // this.toastr.warning("Cancelled !")

        }
      });



    }


  }

  // --------------
  private _filterInfluencers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dataService.influencersList.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearInfluencer() {
    this.Influencer = '';
    this.influencerControl.setValue('');
  }
// --------------
  private _filterExchanges(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.exchangesList.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearExchange() {
    this.Exchange = '';
    this.exchangesControl.setValue('');
  }
  // --------------
  private _filterAccounts(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.accountsList.filter(option => option.toLowerCase().includes(filterValue));
  }



  clearAccount() {
    this.Account = '';
    this.accountsControl.setValue('');
  }




  isFormValid(): boolean {
    if (
      this.sheetName === 'Futures_ACT_Positions' ||
      this.sheetName === 'Futures'
    ) {
      return (
        !!this.Open_Date &&
        !!this.Open_Time &&
        // !!this.Pair_Name &&
        !!this.Trading_Pair &&
        !!this.Direction &&
        !!this.Leverage &&
        !!this.Amount_Coin &&
        !!this.Entry_Price
        // && !!this.Exit_Price &&
        // !!this.Pnl_USDT &&
        // !!this.Close_Date &&
        // !!this.Close_Time &&
        // !!this.Influencer
      );
    }

    if (this.sheetName === 'Spot_Trades') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Market &&
        !!this.Direction &&
        !!this.Price &&
        !!this.Amount
        //&& !!this.Fees
      );
    };

    if (this.sheetName === 'Money_Flow') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Amount_USDT &&
        !!this.Type &&
        // !!this.Fees &&
        !!this.Network &&
        !!this.Exchange &&
        !!this.Account
      );
    };
    if (this.sheetName === 'P2P') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Order_Type &&
        !!this.Price &&
        !!this.Amount_USDT &&
        !!this.Amount_INR
      );
    };
    if (this.sheetName === 'Futures_Closed_Pnl') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Contracts &&
        !!this.Opening_Direction &&
        !!this.Qty &&
        !!this.Leverage &&
        !!this.Entry_Price &&
        !!this.Exit_Price &&
        !!this.Closed_Pnl
      );
    };
    if (this.exchangeName === 'Portfolio_Notes' && this.sheetName === 'Notes') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Type &&
        !!this.Exchange &&
        !!this.Sheet &&
        !!this.Notes
      );
    }
    if (this.sheetName === 'SIP_Open_Orders') {
      return (
        !!this.Date
        && !!this.Time
        && !!this.Trading_Pair
        && !!this.Type
        && !!this.Price
        && !!this.Qty_Open_Order
        && !!this.Amount
        && !!this.Filled
        && !!this.Is_Placed

        && !!this.IS_TradingView_Setup
        && !!this.TradingView_Account
      )
    }

    if (this.exchangeName === 'Freebitco') {
      if (this.sheetName === 'Premium') {
        return (
          !!this.Date
          && !!this.Time
          && !!this.Principal
          && !!this.Maturity
          && !!this.Earning
          && !!this.Days
          && !!this.APY
          && !!this.Status

        )
      }
      if (this.sheetName === 'Fun_Buying') {
        return (
          !!this.Date
          && !!this.Time
          && !!this.Price
          && !!this.Amount
          && !!this.Type
          && !!this.Statergy
        )
      }
      if (this.sheetName === 'Money_Flow') {
        return (
          !!this.Date
          && !!this.Time
          && !!this.Quantity
          && !!this.Type
          && !!this.Price
          && !!this.Fees
          && !!this.Exchange
          && !!this.Account
          && !!this.Notes
        )
      }

    }



    return false; // Handle other cases as needed


  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['Price'] || changes['Qty_Open_Order']) {
      this.calculateAmount();
    }
  }

  calculateAmount(): void {
    this.Amount = this.Price * this.Qty_Open_Order;
  }




  onSubmit(): void {


    // this.isNewEntrySubmitted = true;
    // Create a new FormData object
    const formData = new FormData();
    formData.append('action', 'edit');
    formData.append('SheetName', this.sheetName);
    formData.append('ExchangeName', this.exchangeName)
    formData.append('ID', this.dataToUpdate.ID)
    // formData.append('masterPassword', 'masterPassword');
    // formData.append('token', 'BBEgHFQohlvgqrBxIEG6l5tPkkPJPnYH');


    if (this.sheetName === 'Futures_ACT_Positions' || this.sheetName === 'Futures') {
      const openDate = new Date(this.Open_Date);
      const formattedDate = this.datePipe.transform(openDate, 'yyyy-MM-dd');

      formData.append(
        'Open_Date',
        (formattedDate! + ' ' + this.Open_Time).toString()
      );

      formData.append('Trading_Pair', this.Trading_Pair.toUpperCase());
      formData.append('Direction', this.Direction);
      formData.append('Leverage', this.Leverage);
      formData.append('Amount_Coin', this.Amount_Coin);
      formData.append('Entry_Price', this.Entry_Price);




      formData.append('Exit_Price', this.Exit_Price ? this.Exit_Price : '');
      formData.append('Pnl_USDT', this.Pnl_USDT ? this.Pnl_USDT.toString() : '');

      if (this.Pnl_USDT && this.Entry_Price && this.Amount_Coin && this.Leverage) {
        let Pnl_Percentage = (this.Pnl_USDT / (this.Amount_Coin * this.Entry_Price) * 100) * this.Leverage;
        this.Pnl_Percentage = Pnl_Percentage

        formData.append('Pnl_Percentage', Pnl_Percentage.toString());
      }
      else if ((!this.Pnl_USDT || !this.Entry_Price || !this.Amount_Coin || !this.Leverage)) {
        formData.append('Pnl_Percentage', '');

      }


      if (this.Close_Date) {
        const closeDate = new Date(this.Close_Date);
        const formattedDate = this.datePipe.transform(closeDate, 'yyyy-MM-dd');
        formData.append(
          'Close_Date',
          (formattedDate! + ' ' + (this.Close_Time ? this.Close_Time : '')).toString()
        );
      }
      else if (!this.Close_Date) {
        this.Close_Time = ''
        formData.append('Close_Date', '')

      }
      formData.append('Influencer', this.Influencer ? this.Influencer.toUpperCase() : '')

    }


    if (this.sheetName === 'Spot_Trades') {
      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + ' ' + this.Time).toString()
      );
      formData.append('Market', this.Market.toUpperCase());
      formData.append('Direction', this.Direction);
      formData.append('Amount', this.Amount);
      formData.append('Price', this.Price);
      formData.append('Total_USDT', (this.Amount * this.Price).toString());
      formData.append('Fees', this.Fees);
      formData.append('Fee_Asset', this.Fee_Asset.toUpperCase());
      formData.append('Influencer', this.Influencer.toUpperCase());

      formData.append('Period', this.Period);
      formData.append('Notes', this.Notes);
      formData.append('TradingView_Account', this.TradingView_Account)


    }

    if (this.sheetName === 'Money_Flow') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + ' ' + this.Time).toString());

      formData.append('Amount_USDT', this.Amount_USDT);
      formData.append('Type', this.Type);
      formData.append('Fees', this.Fees);
      formData.append('Network', this.Network);
      formData.append('Exchange', this.Exchange);
      formData.append('Account', this.Account);
      formData.append('Notes', this.Notes)

    }

    if (this.sheetName === 'P2P') {
      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Order_Type', this.Order_Type);
      formData.append('Price', this.Price);
      formData.append('Amount_USDT', this.Amount_USDT);
      formData.append('Amount_INR', this.Amount_INR);
      formData.append('Notes', this.Notes);
    }

    if (this.sheetName === 'Futures_Closed_Pnl') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date_Creation', (formattedDate! + " " + this.Time).toString());

      formData.append('Contracts', this.Contracts.toUpperCase());
      formData.append('Opening_Direction', this.Opening_Direction);
      formData.append('Qty', this.Qty);
      formData.append('Leverage', this.Leverage);

      formData.append('Entry_Price', this.Entry_Price);
      formData.append('Exit_Price', this.Exit_Price);
      formData.append('Closed_Pnl', this.Closed_Pnl);
      if (this.Entry_Price && this.Exit_Price && this.Leverage) {

        if (this.Opening_Direction.toUpperCase() == 'SELL') {
          const pnlPercentage = (this.Entry_Price - this.Exit_Price) / this.Entry_Price * 100 * this.Leverage;
          formData.append('Closed_Pnl_Percentage', pnlPercentage.toString());

        }

        if (this.Opening_Direction.toUpperCase() == 'BUY') {
          const pnlPercentage = (this.Exit_Price - this.Entry_Price) / this.Entry_Price * 100 * this.Leverage
          formData.append('Closed_Pnl_Percentage', pnlPercentage.toString());

        }

      }
      formData.append('Influencer', this.Influencer.toUpperCase());

      formData.append('Notes', this.Notes);


    }

    if (this.exchangeName === 'Portfolio_Notes' && this.sheetName === 'Notes') {
      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Type', this.Type.toUpperCase());
      formData.append('Exchange', this.Exchange.toUpperCase());
      formData.append('Sheet', this.Sheet);
      formData.append('Notes', this.Notes);


    }

    if (this.sheetName === 'SIP_Open_Orders') {


      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Trading_Pair', this.Trading_Pair);
      formData.append('Type', this.Type);
      formData.append('Price', this.Price);
      formData.append('Qty_Open_Order', this.Qty_Open_Order);
      formData.append('Amount', (this.Price * this.Qty_Open_Order).toFixed(3).toString());
      formData.append('Filled', this.Filled);
      formData.append('Is_Placed', this.Is_Placed);

      formData.append('IS_TradingView_Setup', this.IS_TradingView_Setup);
      formData.append('TradingView_Account', this.TradingView_Account);

    }


    if (this.dataToUpdate && (this.exchangeName === 'Freebitco')) {
      if (this.sheetName === 'Premium') {
        const date = new Date(this.Date);
        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        formData.append('Date', (formattedDate! + " " + this.Time).toString());
        formData.append('Date', (formattedDate! + " " + this.Time).toString());
        formData.append('Principal', this.Principal)
        formData.append('Maturity', this.Maturity)
        formData.append('Earning', this.Earning)
        formData.append('Days', this.Days)
        formData.append('APY', this.APY.toLocaleString())
        const expire_Date = new Date(this.Expires_Date);
        const formattedExpiresDate = this.datePipe.transform(expire_Date, 'yyyy-MM-dd');
        formData.append('Expires_Date', (formattedExpiresDate! + " " + this.Expires_Time).toString())
        formData.append('Status', this.Status)
      }

      if (this.sheetName === 'Money_Flow' && this.exchangeName == 'Freebitco') {
        const date = new Date(this.Date);
        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        formData.append('Date', (formattedDate! + " " + this.Time).toString());
        formData.append('Quantity', this.Quantity)
        formData.append('Type', this.Type)
        formData.append('Price', this.Price)
        formData.append('Fees', this.Fees.toString())
        formData.append('Amount', (parseFloat(this.Price) * parseFloat(this.Quantity)).toFixed(3))
        formData.append('Exchange', this.Exchange)
        formData.append('Account', this.Account)
        formData.append('Notes', this.Notes)
      }

      if (this.sheetName === 'Fun_Buying') {
        const date = new Date(this.Date);
        const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
        formData.append('Date', (formattedDate! + " " + this.Time).toString());
        formData.append('Price', this.Price)
        formData.append('Cost', (this.Amount * this.Price).toLocaleString())
        formData.append('Amount', this.Amount)
        formData.append('Type', this.Type)
        formData.append('Statergy', 'BUY_SELL')
      }

    }







    this.functionsServiceRef.updateEntry(formData, this, this.injectedTradeData.tradeData, this.injectedTradeData.location)
      .then((response) => {
        this.toastr.success(response.message, 'Updated !');


      })
      .catch((error) => {
        // Handle error or cancellation here
        if (error != 'Cancelled') {
          this.toastr.warning(error, 'Failed !');
          this.onClose();
        }



      })
      .finally(() => {
        this.isNewEntrySubmitted = false;
      });



  }



}
