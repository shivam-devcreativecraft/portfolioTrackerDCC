import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, filter, map, startWith } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-add-demo-trading-entry-margin-based',
  templateUrl: './add-demo-trading-entry-margin-based.component.html',
  styleUrls: ['./add-demo-trading-entry-margin-based.component.scss']
})
export class AddDemoTradingEntryMarginBasedComponent implements OnInit {

  public ExchangeName: string = '';
  public SheetName: string = '';
  public Location: string = '';


  public Date_Creation: string = '';
  public Time: string = ''
  today: Date = new Date();
  public maxFee: any = 0.2;
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;

  public Influencer: string = 'ACT_SCMR';


  IsMasterControlEnabled: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,
    private googleSheetAPIRef: GoogleSheetApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dataService:DataService,
    public dialogRef: MatDialogRef<AddDemoTradingEntryMarginBasedComponent>,
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

    // Convert the date string to a Date object
    const todayDate = new Date(today);

    // Format the date using DatePipe to 'yyyy-MM-dd' format
    this.Date_Creation = this.datePipe.transform(todayDate, 'yyyy-MM-dd')!;

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

  isNewEntrySubmitted: boolean = false;

  Profit_Targets: any = [{ profitTarget: null, qty: null }];
  Buy_Price: any = null;
  Stop_Price: any = null;
  Leverage: any = 10;
  Margin: any = null;
  Qty: any;
  Contracts: any = '';
  Type: string = '';
  Profit_Targets_PNL: any = {
    Buy_Price: null,
    Leverage: null,
    Margin: null,
    Stop_Price: null,
    Qty: null,
    Exit_Price: null,
    Profit_Stats: [{ profitTarget: null, profit: null, profitPercentage: null, qty: null }],
    Loss: [{ loss: null, lossPercentage: null }],
  };

  // Method to add new profit target
  addProfitTarget() {
    const newProfitTarget: any = { profitTarget: null, qty: null }; // Include qty in new targets
    this.Profit_Targets.push(newProfitTarget);
  }

  // Method to remove profit target
  removeProfitTarget(index: number) {
    if (this.Profit_Targets.length > 1) {
      this.Profit_Targets.splice(index, 1);
    }
  }


  // Main method to calculate Profit and Loss targets



  isFormValid(): boolean {
    if (this.SheetName === 'Futures') {
      return (
        !!this.Buy_Price &&
        !!this.Leverage &&
        !!this.Margin &&
        !!this.Contracts &&
        !!this.Stop_Price &&
        !!this.Stop_Price &&
        !!this.Type &&
        !!this.Influencer &&
        !!this.Date_Creation &&
        !!this.Time &&
        !!this.Profit_Targets[this.Profit_Targets.length - 1].profitTarget
        && (this.Profit_Targets.length == 1 ? true : this.Profit_Targets[this.Profit_Targets.length - 1].qty)

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
    if (this.isFormValid()) {
      this.calculateQuantity(); // Ensure quantities are updated
      await this.calculateProfit_Targets();
      this.uploadToGoogleSheets();
    } else {
      this.toastr.error('Please fill in all required fields.');
    }
  }

  calculateQuantity(): void {
    const margin = this.Margin || 1;
    this.Qty = parseFloat(((margin * this.Leverage) / this.Buy_Price).toFixed(8));

  }



  // Main method to calculate Profit and Loss targets
  async calculateProfit_Targets() {
    const margin = this.Margin || 1;

    // Calculate Qty
    this.Qty = parseFloat(((margin * this.Leverage) / this.Buy_Price).toFixed(8));

    let totalProfit = 0;

    // Adjust for fee
    const maxFeeMultiplierProfit = 1 - this.maxFee / 100;
    const maxFeeMultiplierLoss = 1 + this.maxFee / 100;

    // Check if there's only one profit target
    if (this.Profit_Targets.length === 1) {
      const singleTarget = this.Profit_Targets[0];
      const qty = this.Qty; // In single target, the entire quantity is sold at once
      const profit = this.Type === 'LONG'
        ? (singleTarget.profitTarget - this.Buy_Price) * qty
        : (this.Buy_Price - singleTarget.profitTarget) * qty;

      // Apply maxFee adjustment to profit
      const adjustedProfit = profit * maxFeeMultiplierProfit;
      const profitLeverage = adjustedProfit;
      const profitPercentage = (adjustedProfit / (margin * this.Leverage)) * 100;

      totalProfit = profitLeverage;

      this.Profit_Targets_PNL.Profit_Stats = [{
        profitTarget: singleTarget.profitTarget,
        profit: profitLeverage.toFixed(4),
        profitPercentage: profitPercentage.toFixed(3),
        qty: qty.toFixed(8) // Add qty to Profit_Stats
      }];


    } else {
      this.Profit_Targets_PNL.Profit_Stats = this.Profit_Targets.map((profitTarget: any) => {
        const qty = profitTarget.qty || 0;
        const profit = this.Type === 'LONG'
          ? (profitTarget.profitTarget - this.Buy_Price) * qty
          : (this.Buy_Price - profitTarget.profitTarget) * qty;

        // Apply maxFee adjustment to profit
        const adjustedProfit = profit * maxFeeMultiplierProfit;
        const profitLeverage = adjustedProfit;
        const profitPercentage = (adjustedProfit / (margin * this.Leverage)) * 100;

        totalProfit += profitLeverage;

        return {
          profitTarget: profitTarget.profitTarget,
          profit: profitLeverage.toFixed(4),
          profitPercentage: profitPercentage.toFixed(3),
          qty: qty.toFixed(8) // Add qty to Profit_Stats
        };
      });
    }

    // Calculate loss
    const loss = this.Type === 'LONG'
      ? (this.Stop_Price - this.Buy_Price) * this.Qty
      : (this.Buy_Price - this.Stop_Price) * this.Qty;

    // Apply maxFee adjustment to loss
    const adjustedLoss = loss * maxFeeMultiplierLoss;
    const lossLeverage = adjustedLoss;
    const lossPercentage = (lossLeverage / (margin * this.Leverage)) * 100;

    const totalProfitPercentage = (totalProfit / (margin * this.Leverage)) * 100;

    const lastTakeProfitPrice = this.Profit_Targets.length > 0
      ? this.Profit_Targets[this.Profit_Targets.length - 1].profitTarget
      : null;

    this.Profit_Targets_PNL = {
      Buy_Price: this.Buy_Price,
      Leverage: this.Leverage,
      Margin: this.Margin,
      Stop_Price: this.Stop_Price,
      Qty: this.Qty,
      Profit_Stats: this.Profit_Targets_PNL.Profit_Stats,
      Loss: [{ loss: lossLeverage.toFixed(4), lossPercentage: lossPercentage.toFixed(3) }],
      Closed_Pnl: totalProfit.toFixed(4),
      Closed_Pnl_Percentage: totalProfitPercentage.toFixed(3),
      Exit_Price: lastTakeProfitPrice
    };
  }




  uploadToGoogleSheets() {
    let totalQty;
    let IsFieldBlank: boolean = false;
    this.isNewEntrySubmitted = true;

    // Calculate the total quantity from all profit targets
    if (this.Profit_Targets.length === 1) {
      // Handle single profit target scenario
      totalQty = this.Qty; // For a single target, the total quantity is the full trade quantity
      this.Profit_Targets[0].qty = this.Qty
    } else {

      // Handle multiple profit targets scenario
      totalQty = this.Profit_Targets.reduce((acc: number, target: any) => {
        const qty = target.qty || 0; // Ensure qty is a number and not null
        return acc + qty;
      }, 0);
    }

    this.Profit_Targets.forEach((element: any) => {
      if (element.profitTarget == null || element.qty == null || parseInt(element.profitTarget) == 0 || parseInt(element.qty) == 0) {
        IsFieldBlank = true;
      }
    });

    this.Profit_Targets_PNL.Profit_Stats.forEach((element: any) => {
      if (element.profit == null || parseInt(element.profit) == 0) {
        IsFieldBlank = true;
      }
    });





    const formData = new FormData();


    const date = new Date(this.Date_Creation);
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

    formData.append('Date_Creation', (formattedDate! + " " + this.Time).toString());





    formData.append('action', 'add');
    formData.append('ExchangeName', 'Demo_Trading');
    formData.append('SheetName', this.SheetName);
    formData.append('Entry_Price', this.Buy_Price.toString());
    formData.append('Leverage', this.Leverage.toString());
    formData.append('Margin', this.Margin.toString());
    formData.append('Fee_Rate', this.maxFee)
    formData.append('Stop_Price', this.Stop_Price.toString());
    formData.append('Qty', (totalQty).toString()); // Convert totalQty to string
    formData.append('Opening_Direction', this.Type);
    formData.append('Contracts', this.Contracts.toUpperCase());
    formData.append('Profit_Stats', JSON.stringify(this.Profit_Targets_PNL.Profit_Stats));
    formData.append('Loss_Stats', JSON.stringify(this.Profit_Targets_PNL.Loss));
    formData.append('Influencer', this.Influencer.toUpperCase());
    formData.append('Closed_Pnl', ((this.Profit_Targets_PNL.Closed_Pnl) / this.Leverage).toString());
    formData.append('Closed_Pnl_Percentage', this.Profit_Targets_PNL.Closed_Pnl_Percentage);
    formData.append('Exit_Price', this.Profit_Targets_PNL.Exit_Price?.toString() || '0');

    if (totalQty === this.Qty) {



      if (IsFieldBlank) {
        this.toastr.error(`One of Take Profit or Quantity is Blank`, "Failed! Blank Field");
        this.isNewEntrySubmitted = false;

      }
      else {


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

    } else {
      if (totalQty > this.Qty) {
        this.toastr.error(`Sum of partial quantities exceeds trade quantity`, "Failed! Quantity exceeded");
      } else {
        this.toastr.error(`Trade quantity exceeds sum of partial quantities`, "Failed! Trade not closed");
      }
      this.isNewEntrySubmitted = false;
    }
  }


}
