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
  selector: 'app-add-trading-setup-entry',
  templateUrl: './add-trading-setup-entry.component.html',
  styleUrls: ['./add-trading-setup-entry.component.scss']
})
export class AddTradingSetupEntryComponent implements OnInit {

  public ExchangeName: string = '';
  public SheetName: string = '';
  public Location: string = '';


  public Creation_Date: string = '';
  public Time: string = ''
  today: Date = new Date();
  public influencerControl = new FormControl();
  public filteredInfluencers!: Observable<string[]>;

  public Influencer: string = '';



  constructor(
    @Inject(MAT_DIALOG_DATA) public injectedData: any,
    private googleSheetAPIRef: GoogleSheetApiService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddTradingSetupEntryComponent>,
    private router: Router,
    private dataService: DataService

  ) {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Close dialog on route change

      this.dialogRef.close();
    });

  }

  ngOnInit(): void {
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
  public Trading_Pair: string = '';

  Profit_Targets: any = [{ profitTarget: null }];
  Open_Price: any;
  Close_Price: any;
  Booked_Profit: any;
  Booked_Profit_Percentage: any;
  Stop_Price: any;
  Leverage: any = 10;
  Margin: any = 10;
  Qty: any;
  Type: string = '';
  Profit_Targets_PNL: any = {
    Open_Price: null, //done
    Leverage: null, //done
    Margin: null, //done
    Stop_Price: null, //done
    Qty: null, //done
    Profit_Stats: [{ profitTarget: null, profit: null, profitPercentage: null }],
    Loss: [{ loss: null, lossPercentage: null }],
  };

  // Method to add new profit target
  addProfitTarget() {
    const newProfitTarget: any = { profitTarget: null };
    this.Profit_Targets.push(newProfitTarget);
  }

  // Method to remove profit target
  removeProfitTarget(index: number) {
    if (this.Profit_Targets.length > 1) {
      this.Profit_Targets.splice(index, 1);
    }
  }

  // Main method to calculate Profit and Loss targets
  async calculateProfit_Targets() {
    const margin = this.Margin ? this.Margin : 1;

    // Calculate Qty
    this.Qty = parseFloat(((margin * this.Leverage) / this.Open_Price).toFixed(8)); // Limit Qty to 8 decimal places

    // Calculate Profit and Profit Percentage for each target
    this.Profit_Targets_PNL.Profit_Stats = this.Profit_Targets.map((profitTarget: any) => {


      // Profit Calculation


      const profit = this.Type === 'LONG'
        ? (profitTarget.profitTarget - this.Open_Price) * this.Qty
        : (this.Open_Price - profitTarget.profitTarget) * this.Qty;

      // Adjust profit based on leverage


      // Profit Percentage Calculation
      const profitPercentage = (profit / (margin)) * 100;

      return {
        profitTarget: profitTarget.profitTarget,
        profit: profit.toFixed(4), // Changed to 4 decimal places to match the corrected data
        profitPercentage: profitPercentage.toFixed(3)
      };
    });





    // Calculate Loss and Loss Percentage for Stop Price
    const loss = this.Type === 'LONG'
      ? ((this.Stop_Price - this.Open_Price) * this.Qty)
      : ((this.Open_Price - this.Stop_Price) * this.Qty);

    // Adjust loss based on leverage
    const lossLeverage = loss;

    const lossPercentage = (lossLeverage / (margin * this.Leverage)) * 100;

    // Update the Profit Targets PNL object
    this.Profit_Targets_PNL = {
      Open_Price: this.Open_Price,
      Leverage: this.Leverage,
      Margin: this.Margin,
      Stop_Price: this.Stop_Price,
      Qty: this.Qty,
      Profit_Stats: this.Profit_Targets_PNL.Profit_Stats,
      Loss: [{ loss: lossLeverage.toFixed(4), lossPercentage: lossPercentage.toFixed(3) }],
    };
  }
  async calculateBookedProfit() {
    // Ensure all necessary values are present before performing calculations


    // const priceDifference = this.Close_Price - this.Open_Price;

    // // Calculate Booked Profit:
    // this.Booked_Profit = (this.Type.toLowerCase() == 'long') ? priceDifference * this.Qty : -(priceDifference * this.Qty);

    // // Calculate Booked Profit Percentage: 
    // const totalInvestment = this.Open_Price * this.Qty * this.Leverage;
    // this.Booked_Profit_Percentage = ((this.Type.toLowerCase() == 'long') ? (this.Booked_Profit / totalInvestment) * 100 : -(this.Booked_Profit / totalInvestment) * 100);






    this.Booked_Profit = this.Type.toUpperCase() === 'LONG'
      ? (this.Close_Price - this.Open_Price) * this.Qty
      : (this.Open_Price - this.Close_Price) * this.Qty;

      this.Booked_Profit.toFixed(4)
    this.Booked_Profit_Percentage = ((this.Booked_Profit / this.Margin) * 100).toFixed(3)


    console.log('Booked Profit:', this.Booked_Profit);
    console.log('Booked Profit Percentage:', this.Booked_Profit_Percentage);
    console.log('Profit_Target : ', this.Profit_Targets_PNL)

  }




  isFormValid(): boolean {
    if (this.SheetName === 'Futures') {
      return (
        !!this.Open_Price &&
        !!this.Trading_Pair &&
        !!this.Leverage &&
        !!this.Margin &&
        !!this.Stop_Price &&
        !!this.Stop_Price &&
        !!this.Type &&
        !!this.Influencer &&
        !!this.Creation_Date &&
        !!this.Time &&
        !!this.Profit_Targets[this.Profit_Targets.length - 1].profitTarget
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


  async onSubmit() {
    await this.calculateProfit_Targets();
    if (this.Close_Price && this.Qty && this.Open_Price && this.Leverage && this.Margin) {
      await this.calculateBookedProfit();
    }
    this.uploadToGoogeSheets()
  }

  onClose(): void {
    this.dialogRef.close();
  }

  uploadToGoogeSheets() {
    this.isNewEntrySubmitted = true;

    const formData = new FormData();
    formData.append('action', 'add');
    formData.append('ExchangeName', 'Trade_Setup');
    formData.append('SheetName', this.SheetName);
    if (this.Creation_Date && this.Time) {


      const date = new Date(this.Creation_Date);
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');

      formData.append('Date_Creation', (formattedDate! + " " + this.Time).toString());
    }
    formData.append('Trading_Pair', this.Trading_Pair.toUpperCase());
    formData.append('Open_Price', this.Profit_Targets_PNL.Open_Price);
    if (this.Close_Price) {
      formData.append('Close_Price', this.Close_Price);
      formData.append('Booked_Profit', this.Booked_Profit)
      formData.append('Booked_Profit_Percentage', this.Booked_Profit_Percentage)

    }
    formData.append('Leverage', this.Profit_Targets_PNL.Leverage);
    formData.append('Type', this.Type.toUpperCase());
    formData.append('Margin', this.Profit_Targets_PNL.Margin);
    formData.append('Qty', this.Profit_Targets_PNL.Qty);
    formData.append('Stop_Price', this.Profit_Targets_PNL.Stop_Price);

    formData.append('Loss', this.Profit_Targets_PNL.Loss[0].loss)
    formData.append('Loss_Percentage', this.Profit_Targets_PNL.Loss[0].lossPercentage)
    formData.append('Influencer', this.Influencer.toUpperCase());

    // Add Each key of Profit_Stats as a single string
    const profitTargetsString = this.Profit_Targets_PNL.Profit_Stats.map((item: any) => item.profitTarget).join(',');
    formData.append('Targets', profitTargetsString);

    const profitString = this.Profit_Targets_PNL.Profit_Stats.map((item: any) => item.profit).join(',');
    formData.append('Profits', profitString);

    const profitPercentageString = this.Profit_Targets_PNL.Profit_Stats.map((item: any) => item.profitPercentage).join(',');
    formData.append('Profit_Percentages', (profitPercentageString));




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

}
