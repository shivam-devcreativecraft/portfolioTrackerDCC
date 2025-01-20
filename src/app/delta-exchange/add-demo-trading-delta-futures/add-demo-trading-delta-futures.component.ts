import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, filter, map, startWith } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { SharedMaterialImportsModule } from 'src/app/shared-material-imports/shared-material-imports.module';


@Component({
  selector: 'app-add-demo-trading-delta-futures',
  templateUrl: './add-demo-trading-delta-futures.component.html',
  styleUrls: ['./add-demo-trading-delta-futures.component.scss'],
  standalone: true,
  imports: [ SharedMaterialImportsModule, ReactiveFormsModule, FormsModule, CommonModule, MatIconModule, MatButtonModule, MatChipsModule],
  providers: [DatePipe]
})
export class AddDemoTradingDeltaFuturesComponent implements OnInit {

  public ExchangeName: string = '';
  public SheetName: string = '';
  public Location: string = '';
  isNewEntrySubmitted: boolean = false;
  IsMasterControlEnabled: boolean = false;


  public Date: string = '';
  public Time: string = ''
  today: Date = new Date();
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;
  public Influencer: string = 'Trade_With_Ash';

  public Platform: string = 'Delta';

  Coin: any = '';
  Contracts: any = null;
  Type: string = '';
  Leverage: any = 25;
  Open_Price: any = null;
  Open_Margin: any = null;
  Close_Price: any = null;
  Close_Margin: any = null;
  Pnl: any = null;
  Pnl_Percentage: any = null;
  Lot_Value: any = null;










  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,
    private googleSheetAPIRef: GoogleSheetApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dataService: DataService,
    public dialogRef: MatDialogRef<AddDemoTradingDeltaFuturesComponent>,
    private router: Router,

  ) {
    console.log(injectedData)

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

    // Convert the date string to a Date object
    const todayDate = new Date(today);

    // Format the date using DatePipe to 'yyyy-MM-dd' format
    this.Date = this.datePipe.transform(todayDate, 'yyyy-MM-dd')!;

    // Set the current time in HH:MM:SS format
    const currentTime = new Date();
    this.Time = currentTime.toTimeString().slice(0, 8);  // HH:MM:SS format





    this.ExchangeName = this.injectedData.ExchangeName;
    this.SheetName = this.injectedData.SheetName;
    this.injectedData.Location ? this.Location = this.injectedData.Location : '';
    this.filteredInfluencers = this.influencerControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    // Sync ngModel with FormControl
    this.influencerControl.valueChanges.subscribe(value => {
      this.Influencer = value;
    });
  }





  isFormValid(): boolean {
    if (this.SheetName === 'Delta_Futures') {
      return (
        // true
        !!this.Date &&
        !!this.Time &&
        !!this.Coin &&
        !!this.Contracts &&
        !!this.Type &&
        !!this.Leverage &&
        !!this.Open_Price &&
        !!this.Close_Price &&
        !!this.Influencer 
        // && !!this.Platform
      );
    }
    return false;
  }






  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dataService.influencersList.filter(option => option.toLowerCase().includes(filterValue));
  }

  clearInfluencer() {
    this.Influencer = '';
    this.influencerControl.setValue('');
  }

  onClose(): void {
    this.dialogRef.close();
  }



  async onSubmit() {
    this.Coin = this.Coin.toUpperCase();
    if (this.Coin === 'BTC' || this.Coin === 'ETH' || this.Coin === 'LTC' || this.Coin === 'BNB' || this.Coin === 'SOL' || this.Coin === 'XRP' || this.Coin === 'LINK' || this.Coin === 'DOGE') {
      // console.log('submitted')
      await this.getLotValue();
      // console.log(this.Lot_Value)
    } else {
      this.toastr.error("Invalid Coin !", "Error");
      return;
    }
    await this.calculateMargin();
    await this.formateDate();


    this.uploadToGoogleSheets();

  }



  async getLotValue() {




    if (this.Platform === 'Delta') {


      if (this.Coin === 'BTC') {
        this.Lot_Value = 0.001;
      }
      else if (this.Coin === 'ETH') {
        this.Lot_Value = 0.01;
      }
      if (this.Coin === 'LTC' || this.Coin === 'BNB') {
        this.Lot_Value = 0.1;
      }

      else if (this.Coin === 'SOL' || this.Coin === 'XRP' || this.Coin === 'LINK') {
        this.Lot_Value = 1;
      }

      else if (this.Coin === 'DOGE') {
        this.Lot_Value = 100;
      }



    }


    if (this.Platform === 'Mexc') {

      if (this.Coin === 'BTC') {
        this.Lot_Value = 0.0001;
      }
      else if (this.Coin === 'ETH') {
        this.Lot_Value = 0.01;
      }
      if (this.Coin === 'LTC' || this.Coin === 'BNB') {
        this.Lot_Value = 0.01;
      }
      else if (this.Coin === 'SOL' || this.Coin === 'LINK') {
        this.Lot_Value = 0.1;
      }
      if (this.Coin === 'XRP') {
        this.Lot_Value = 1;
      }
      else if (this.Coin === 'DOGE') {
        this.Lot_Value = 100;
      }




    }
  }

  async calculateMargin() {

    if (this.Type === 'BUY') {
      this.Open_Margin = this.Open_Price * this.Contracts * this.Lot_Value / this.Leverage;
      this.Close_Margin = this.Close_Price * this.Contracts * this.Lot_Value / this.Leverage;
    }
    else if (this.Type === 'SELL') {
      this.Open_Margin = this.Open_Price * this.Contracts * this.Lot_Value / this.Leverage;
      this.Close_Margin = this.Close_Price * this.Contracts * this.Lot_Value / this.Leverage;
    }

    if (this.Type === 'BUY') {
      this.Pnl = (this.Close_Price - this.Open_Price) * this.Contracts * this.Lot_Value;
      this.Pnl_Percentage = ((this.Close_Price - this.Open_Price) / this.Open_Price) * 100 *25;
    }
    if (this.Type === 'SELL') {
      this.Pnl = (this.Open_Price - this.Close_Price) * this.Contracts * this.Lot_Value;
      this.Pnl_Percentage = ((this.Open_Price - this.Close_Price) / this.Close_Price) * 100 *25;
    }


    this.Open_Margin = this.Open_Margin.toFixed(3);
    this.Close_Margin = this.Close_Margin.toFixed(3);
    this.Pnl = this.Pnl.toFixed(3);
    this.Pnl_Percentage = this.Pnl_Percentage.toFixed(3);


    // console.log('Open_Margin : ', this.Open_Margin);
    // console.log('Close_Margin : ', this.Close_Margin);
    // console.log('Pnl : ', this.Pnl);
    // console.log('Pnl_Percentage : ', this.Pnl_Percentage);



  }

  async formateDate() {
    const date = new Date(this.Date);
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    // this.Date = (formattedDate! + " " + this.Time).toString();
    this.Date = (formattedDate!).toString();

    //     console.log('formattedDate : ', this.formateDate);
    //     console.log('Date : ', this.Date);
  }

  uploadToGoogleSheets() {


    this.isNewEntrySubmitted = true;
    const formData = new FormData();

    formData.append('action', 'add');
    formData.append('ExchangeName', this.ExchangeName);
    formData.append('SheetName', this.SheetName);

    // const date = new Date(this.Date);
    // const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');





    // formData.append('Date', this.Date.toString());
    // console.log(typeof(this.Date))
    formData.append('Date', this.Date);
    formData.append('Contracts', this.Contracts);
    formData.append('Coin', this.Coin);
    formData.append('Type', this.Type);
    formData.append('Leverage', this.Leverage);
    formData.append('Open_Price', this.Open_Price);
    formData.append('Open_Margin', this.Open_Margin);
    formData.append('Close_Price', this.Close_Price);
    formData.append('Close_Margin', this.Close_Margin);
    formData.append('Pnl', this.Pnl);
    formData.append('Pnl_Percentage', this.Pnl_Percentage);
    formData.append('Influencer', this.Influencer);
    formData.append('Lot_Value', this.Lot_Value);


  

    this.googleSheetAPIRef.addNewEntry_AIO(formData)
      .then((response) => {
        if (response.error) {
          this.toastr.error(response.error, "Failed!");
          localStorage.removeItem('masterControlToken');
          this.googleSheetAPIRef.checkMasterControl(false);
          this.onClose();
        } else if (response.message) {
          this.toastr.success(response.message, "Successful!");
        }
      })
      .catch((error) => {
        this.toastr.error("Something went wrong!", "Error");
        console.error("Error uploading to Google Sheets:", error);
      })
      .finally(() => {
        this.isNewEntrySubmitted = false;
      });


  }



}
