import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { event } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Observable, filter, map, startWith } from 'rxjs';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../../confirm-dialog/confirm-dialog.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.component.html',
  styleUrls: ['./add-new.component.scss']
})
export class AddNewComponent implements OnInit {

  // @Input() ExchangeName: string = '';
  public ExchangeName: string = '';
  public SheetName: string = '';
  public Location: string = '';


  public Date: string = '';
  public Time: string = ''
  today: Date = new Date();

  isNewEntrySubmitted: boolean = false;
  SubmittedEntityCount: number = 0;


  // --------------------
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;

  public Influencer: string = '';


  // ---------------------
  public accountsControl = new FormControl();
  public filteredAccounts!: Observable<string[]>;

  public Account: string = ''


  private accountsList: string[] = [
    'shivamcp10@gmail.com',
    'cvam159951@gmail.com',
    'drkdr.shivamji@gmail.com'

  ];
  // ------------------
  public exchangesControl = new FormControl();
  public filteredExchanges!: Observable<string[]>;

  public Exchange: string = ''

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


  public Date_Creation: string = '';
  // spot_Trades
  public Market: string = '';
  public Amount: any;
  public Price: any;
  public Total_USDT: any;
  public Fee_Asset:string='USDT'
  public Direction: string = '';
  public Period: string = '';
  public Notes: string = '';
  public TradingView_Account: string = '';


  // p2p

  public Order_Type: string = '';
  public Transaction_Type: string = '';
  public Amount_INR: any;
  public Amount_USDT: any;




  // Money_Flow
  public Fees: number = 0;
  public Network: string = '';
  public Type: string = '';
  public Asset:string='USDT';

  // Add network form control and list
  public networkControl = new FormControl();
  public filteredNetworks!: Observable<string[]>;
  private networksList: string[] = [
    'BSC (BEP20)',
    'TRC20',
    'ETH (ERC20)',
    'ARB',
    'TON',
    'MATIC',
    'OP',
    'AVAX'
  ];

  public Entry_Date: string = '';
  public Entry_Time: string = ''
  public Coin: string = '';
  public Leverage: number = 5;
  public Entry_Price: any;
  public Exit_Price: any;
  public Pnl_USDT: any;
  public Pnl_Percentage: any;
  public Closing_Date: string = ''
  public Closing_Time: string = ''
  public Contracts: string = '';
  public Closing_Direction: string = ''
  public Qty: any;
  public Closed_Pnl: any;
  public Exit_Type: string = 'Trade'
  public Opening_Direction: string = '';
  public Closed_Pnl_Percentage: any;
  public Executed: any;
  public Open_Date: string = '';
  public Open_Time: string = '';
  public Trading_Pair: string = '';
  public Amount_Coin: any;
  public Close_Date: string = '';
  public Close_Time: string = '';
  public Filled_Amount: any;
  public Filled_Price: any;
  public Fee_USDT: any;


  //exness
  public Symbol: string = '';
  public Lot_Size: number = 0.02;
  public Open_Price: any;
  public Close_Price: any;


  //Freebitco
  public Event: string = '';
  public Side: string = '';
  public Invested: any;
  public Return: any;
  public Result: string = '';
  public Amount_SAT: number = 6
  public Amount_FUN: any;
  public Principal: any;
  public Maturity: any;
  public Earning: any;
  public Days: any;
  public APY: any;
  public Expires_Date: any;
  public Expires_Time: any;
  public Status: string = 'Un-Matured'
  public Quantity: any;


  //Portfolio_Notes
  public Sheet: string = '';

  //SIP_Open_Orders
  public Qty_Open_Order: any;
  public Filled: string = 'NO';
  public Is_Placed: string = 'NO';
  public IS_TradingView_Setup: string = 'YES';

  IsMasterControlEnabled: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,

    private googleSheetAPIRef: GoogleSheetApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddNewComponent>,
    public _dialog: MatDialog,
    private router: Router,
    private dataService:DataService
  ) {
    // console.log(injectedData)
    this.googleSheetAPIRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

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
    const currentTime = new Date();





    this.ExchangeName = this.injectedData.ExchangeName;
    this.SheetName = this.injectedData.SheetName;
    this.injectedData.Location ? this.Location = this.injectedData.Location : '';






    // -------------------
    this.filteredInfluencers = this.influencerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterInfluencers(value))
    );
    // Sync ngModel with FormControl

    this.influencerControl.valueChanges.subscribe(value => {
      this.Influencer = value;
    });
    // -------------------
    this.filteredExchanges = this.exchangesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterExchanges(value))
    );
    // Sync ngModel with FormControl
    this.exchangesControl.valueChanges.subscribe(value => {
      this.Exchange = value;
    });
    // -------------------
    this.filteredAccounts = this.accountsControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAccounts(value))
    );
    // Sync ngModel with FormControl
    this.accountsControl.valueChanges.subscribe(value => {
      this.Account = value;
    });



    if (this.ExchangeName === 'Binance') {
      this.TradingView_Account = 'dtoudtoi@gmail.com';
    }
    if (this.ExchangeName === 'Bybit') {
      this.TradingView_Account = 'shivamcp10june@gmail.com';
    }
    if (this.ExchangeName === 'Mexc') {
      this.TradingView_Account = 'srma159cvam@gmail.com';
    }
    if (this.ExchangeName === 'Kucoin') {
      this.TradingView_Account = 'ruftmuft@gmail.com';
    }
    if (this.ExchangeName === 'Gateio') {
      this.TradingView_Account = 'ruftmuft@gmail.com';
    }
    if (this.ExchangeName === 'Exness') {
      this.Symbol = 'XAU/USD';
      this.SheetName = 'ACT_Forex_Demo';
    }
    if (this.ExchangeName === 'Freebitco') {
      this.Type = 'BUY';
      this.SheetName = 'Fun_Buying';


      this.Date = this.Open_Date = this.Date_Creation = this.datePipe.transform(todayDate, 'yyyy-MM-dd')!;
      this.Time = currentTime.toTimeString().slice(0, 8);  // HH:MM:SS format

      if (this.SheetName == 'Fun_Buying') {
        this.Notes = 'Fees Included';
        this.Type = 'WITHDRAW';
        this.Price = 6;
        this.Type = 'BUY'
      }




    }
    if (this.ExchangeName === 'Portfolio_Notes') {
      this.SheetName = 'Notes';
    }

    // Setup network autocomplete
    this.filteredNetworks = this.networkControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNetworks(value))
    );
    // Sync ngModel with FormControl
    this.networkControl.valueChanges.subscribe(value => {
      this.Network = value;
    });

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

  // Add network filter function
  private _filterNetworks(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.networksList.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearNetwork() {
    this.Network = '';
    this.networkControl.setValue('');
  }




  isFormValid(): boolean {

    //#region COMMON
    // ---------------------------------------Common------------------------------------STARTS
    if (this.SheetName === 'Spot_Trades') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Market &&
        !!this.Price &&
        !!this.Direction &&
        !!this.Amount&&
        !!this.Fee_Asset
        // !!this.Fees
      );
    } else if (this.SheetName === 'P2P') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Order_Type &&
        !!this.Price &&
        // !!this.Amount_USDT &&
        !!this.Amount_INR
      );
    } else if (this.SheetName === 'Money_Flow' && this.ExchangeName != 'Freebitco') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Amount &&
        !!this.Asset &&
        !!this.Network &&
        !!this.Type &&
        !!this.Exchange &&
        !!this.Account
      );
    } else if (this.SheetName === 'SIP_Open_Orders') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Trading_Pair &&
        !!this.Type &&
        !!this.Price &&
        !!this.Qty_Open_Order &&

        !!this.Filled &&
        !!this.Is_Placed &&
        !!this.IS_TradingView_Setup &&
        !!this.TradingView_Account
      )
    }
    // ---------------------------------------Common------------------------------------ENDS
    //#endregion

    //#region  BYBIT
    // ---------------------------------------Bybit------------------------------------STARTS
    else if (this.SheetName === 'Futures_Closed_Pnl') {
      return (
        !!this.Date_Creation &&
        !!this.Time &&
        !!this.Contracts &&
        !!this.Opening_Direction &&
        !!this.Leverage &&
        !!this.Qty &&
        !!this.Entry_Price &&
        !!this.Exit_Price &&
        !!this.Closed_Pnl


      );
    }
    // ---------------------------------------Bybit------------------------------------ENDS
    //#endregion
    //#region MEXC
    // ---------------------------------------Mexc------------------------------------STARTS

    else if (this.SheetName === 'Futures') {
      return (
        !!this.Open_Date &&
        !!this.Open_Time &&
        !!this.Trading_Pair &&
        !!this.Direction &&
        !!this.Amount_Coin &&
        !!this.Leverage &&
        !!this.Entry_Price &&
        !!this.Pnl_USDT &&
        !!this.Exit_Price &&
        !!this.Close_Date &&
        !!this.Close_Time &&
        !!this.Influencer
      );
    }

    // ---------------------------------------Mexc------------------------------------ENDS

    // ---------------------------------------Exness------------------------------------STARTS
    else if (this.SheetName === 'ACT_Forex_Demo' || this.SheetName === 'ACT_Forex_Real') {
      return (
        !!this.Open_Date &&
        !!this.Open_Time &&
        !!this.Symbol &&
        !!this.Type &&
        !!this.Lot_Size &&
        !!this.Open_Price &&
        !!this.Close_Price &&
        !!this.Pnl_USDT &&
        !!this.Close_Date &&
        !!this.Close_Time
        // !!this.Total_USDT
      );
    }

    // ---------------------------------------Exness------------------------------------ENDS

    // ---------------------------------------Freebitco------------------------------------STARTS
    else if (this.SheetName === 'Events') {
      return (!!this.Open_Date &&
        !!this.Open_Time &&
        !!this.Event &&
        !!this.Side &&
        !!this.Invested
      );
    } else if (this.SheetName === 'Fun_Buying') {
      return (!!this.Date &&
        !!this.Time &&
        !!this.Price &&

        !!this.Amount &&
        !!this.Type);
    } else if (this.SheetName === 'Premium') {
      return (!!this.Date &&
        !!this.Time &&
        !!this.Principal &&
        !!this.Maturity &&
        !!this.Earning &&
        !!this.Days &&
        !!this.APY &&
        !!this.Expires_Date &&
        !!this.Expires_Time &&
        !!this.Status
      );
    } else if (this.SheetName === 'Money_Flow' && this.ExchangeName == 'Freebitco') {
      return (
        !!this.Date &&
        !!this.Quantity &&
        !!this.Type &&
        // !!this.Fees &&
        !!this.Notes &&
        !!this.Exchange &&
        !!this.Account
      );
    }
    // ---------------------------------------Freebitco------------------------------------ENDS

    // ---------------------------------------Portfolio_Notes------------------------------------STARTS
    else if (this.SheetName === 'Notes') {
      return (
        !!this.Date &&
        !!this.Time &&
        !!this.Type &&
        !!this.Exchange &&
        !!this.Sheet &&
        !!this.Notes
      );
    }

    // ---------------------------------------Portfolio_Notes------------------------------------ENDS



    //#endregion
    return false; // Handle other cases as needed
  }

  onSubmit(): void {
    this.isNewEntrySubmitted = true;

    // Create a new FormData object
    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('ExchangeName', this.ExchangeName);
    formData.append('SheetName', this.SheetName);



    // ---------------------------------------COMMON------------------------------------STARTS


    if (this.SheetName === 'Spot_Trades') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Market', this.Market.toLocaleUpperCase());
      formData.append('Price', this.Price);
      formData.append('Direction', this.Direction);
      formData.append('Amount', this.Amount);
      formData.append('Total_USDT', (this.Amount * this.Price).toString());
      formData.append('Fees', this.Fees.toString());
      formData.append('Fee_Asset', this.Fee_Asset);
      formData.append('Period', this.Period);
      formData.append('Notes', this.Notes);
      formData.append('Influencer', this.Influencer.toUpperCase());
      formData.append('TradingView_Account', this.TradingView_Account);
    }

    if (this.SheetName === 'P2P') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Order_Type', this.Order_Type);
      formData.append('Price', this.Price);
      formData.append('Amount_USDT', (parseFloat(this.Amount_INR) / parseFloat(this.Price)).toFixed(3));
      formData.append('Amount_INR', this.Amount_INR);
      formData.append('Notes', this.Notes);
    }

    if (this.SheetName === 'Money_Flow' && this.ExchangeName != 'Freebitco') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Amount', this.Amount);
      formData.append('Asset', this.Asset.toUpperCase());
      formData.append('Fees', this.Fees.toString());
      formData.append('Network', this.Network.toLocaleUpperCase());
      formData.append('Type', this.Type.toLocaleUpperCase());
      formData.append('Exchange', this.Exchange.toLocaleUpperCase());
      formData.append('Account', this.Account.toLocaleUpperCase());
      formData.append('Notes', this.Notes)

    }




    if (this.SheetName === 'SIP_Open_Orders') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Trading_Pair', this.Trading_Pair.toLocaleUpperCase());
      formData.append('Type', this.Type.toLocaleUpperCase());
      formData.append('Price', this.Price);
      formData.append('Qty_Open_Order', this.Qty_Open_Order);
      formData.append('Amount', (parseFloat(this.Price) * parseFloat(this.Qty_Open_Order)).toFixed(3));
      formData.append('Filled', this.Filled.toLocaleUpperCase());
      formData.append('Is_Placed', this.Is_Placed.toLocaleUpperCase());
      formData.append('IS_TradingView_Setup', this.IS_TradingView_Setup.toLocaleUpperCase());
      formData.append('TradingView_Account', this.TradingView_Account);











    }

    // ---------------------------------------COMMON------------------------------------ENDS

    // ---------------------------------------BYBIT------------------------------------STARTS


    if (this.SheetName === 'Futures_Closed_Pnl') {

      const date = new Date(this.Date_Creation);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date_Creation', (formattedDate! + " " + this.Time).toString());
      formData.append('Contracts', this.Contracts.toUpperCase());
      formData.append('Opening_Direction', this.Opening_Direction);
      formData.append('Leverage', this.Leverage.toString());
      formData.append('Qty', this.Qty);
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

    // ---------------------------------------BYBIT------------------------------------ENDS

    // ---------------------------------------MEXC------------------------------------STARTS


    if (this.SheetName === 'Futures') {


      const openDate = new Date(this.Open_Date);
      const formattedOpenDate = this.datePipe.transform(openDate, 'yyyy-MM-dd');
      formData.append('Open_Date', (formattedOpenDate! + " " + this.Open_Time).toString());



      formData.append('Trading_Pair', this.Trading_Pair.toUpperCase());
      formData.append('Direction', this.Direction);
      formData.append('Amount_Coin', this.Amount_Coin);
      formData.append('Leverage', this.Leverage.toString());
      formData.append('Entry_Price', this.Entry_Price);
      formData.append('Pnl_USDT', this.Pnl_USDT);


      if (this.Pnl_USDT && this.Entry_Price && this.Amount_Coin && this.Leverage) {
        let Pnl_Percentage = (this.Pnl_USDT / (this.Amount_Coin * this.Entry_Price) * 100) * this.Leverage;
        this.Pnl_Percentage = Pnl_Percentage

        formData.append('Pnl_Percentage', Pnl_Percentage.toString());
      }

      formData.append('Exit_Price', this.Exit_Price);

      const closeDate = new Date(this.Close_Date);
      const formattedCloseDate = this.datePipe.transform(closeDate, 'yyyy-MM-dd');
      formData.append('Close_Date', (formattedCloseDate! + " " + this.Close_Time).toString());



      formData.append('Influencer', this.Influencer.toUpperCase());






    }

    // ---------------------------------------MEXC------------------------------------ENDS

    // ---------------------------------------EXNESS------------------------------------STARTS
    if (this.SheetName === 'ACT_Forex_Demo' || this.SheetName === 'ACT_Forex_Real') {

      const openDate = new Date(this.Open_Date);
      const formattedOpenDate = this.datePipe.transform(openDate, 'yyyy-MM-dd');
      formData.append('Open_Date', (formattedOpenDate! + " " + this.Open_Time).toString());
      formData.append('Symbol', this.Symbol.toLocaleUpperCase());
      formData.append('Type', this.Type.toLocaleUpperCase());
      formData.append('Lot_Size', this.Lot_Size.toString());
      formData.append('Open_Price', this.Open_Price.toString());
      formData.append('Close_Price', this.Close_Price.toString());
      formData.append('Pnl_USDT', this.Pnl_USDT.toString());

      const closeDate = new Date(this.Close_Date);
      const formattedCloseDate = this.datePipe.transform(closeDate, 'yyyy-MM-dd');
      formData.append('Close_Date', (formattedCloseDate! + " " + this.Close_Time).toString());
    }

    // ---------------------------------------EXNESS------------------------------------ENDS

    // ---------------------------------------FREEBITCO------------------------------------STARTS

    if (this.SheetName === 'Events') {
      const openDate = new Date(this.Open_Date);
      const formattedDate = this.datePipe.transform(openDate, 'yyyy-MM-dd');

      formData.append('Open_Date', (formattedDate! + " " + this.Open_Time).toString());
      formData.append('Event', this.Event)
      formData.append('Side', this.Side)
      // formData.append('Odds', this.Odds)
      formData.append('Invested', this.Invested)
      if (this.Return) { formData.append('Return', this.Return) }
      else if (this.Return == undefined || this.Return == null || !this.Return) {
        formData.append('Return', '0')

      }

      if (this.Result) { formData.append('Result', this.Result); }
      if (this.Close_Date) {
        const closeDate = new Date(this.Close_Date);
        const formattedDate = this.datePipe.transform(closeDate, 'yyyy-MM-dd');
        formData.append('Close_Date', (formattedDate! + " " + this.Close_Time).toString());
      }
    }


    if (this.SheetName === 'Fun_Buying') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + " " + this.Time).toString());
      formData.append('Price', this.Price)
      formData.append('Cost', (this.Amount * this.Price).toLocaleString())
      formData.append('Amount', this.Amount)
      formData.append('Type', this.Type)
      formData.append('Statergy', 'BUY_SELL')
    }
    if (this.SheetName === 'Premium') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

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

    if (this.SheetName === 'Money_Flow' && this.ExchangeName == 'Freebitco') {

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

    // ---------------------------------------FREEBITCO------------------------------------ENDS

    // ---------------------------------------PORTFOLIO_NOTES------------------------------------STARTS
    if (this.SheetName === 'Notes') {

      const date = new Date(this.Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date', (formattedDate! + ' ' + this.Time).toString());
      formData.append('Exchange', this.Exchange.toUpperCase());
      formData.append('Sheet', this.Sheet);
      formData.append('Type', this.Type);
      formData.append('Notes', this.Notes);
    }
    // ---------------------------------------PORTFOLIO_NOTES------------------------------------ENDS









    //#endregion


    // Call the service to send the form data
    this.googleSheetAPIRef
      .addNewEntry_AIO(formData)
      .then((response) => {


        if (response.error) {
          this.toastr.error(response.error, "Failed !")
          localStorage.removeItem('masterControlToken')
          if (!localStorage.getItem('masterControlToken')) {
            this.googleSheetAPIRef.checkMasterControl(false);

            this.onClose();
          }

        }
        else if (response.message) {
          this.SubmittedEntityCount++;
          this.toastr.success(response.message, "Successfull !")
        }



      })
      .catch((error) => {
        this.toastr.success(error, "Something went wrong !")

      })
      .finally(() => {
        this.isNewEntrySubmitted = false;

        // this.dialogRef.close();
      });
  }

  onClose(): void {
    this.dialogRef.close();

    if (this.SubmittedEntityCount != 0 && (this.injectedData.location) != 'dialog') {


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




}

