import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-portfolio-binance-dashboard',
  templateUrl: './portfolio-binance-dashboard.component.html',
  styleUrls: ['./portfolio-binance-dashboard.component.scss']
})
export class PortfolioBinanceDashboardComponent {
  sheetData: any[] = []
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataServiceRef: DataService
  ) {
    // if (this.dataServiceRef.bybitSheetData.Data != null && this.dataServiceRef.bybitSheetData.IsDataPresent) {

    //   this.sheetData = this.dataServiceRef.bybitSheetData.Data
    //   console.log("SheetData : ", this.sheetData)
    // }
    // else 
    // this.getSheetData();

  }


getSheetData(){
  this.googleSheetAPIServiceRef.getBinanceAllDataPD().subscribe((response:any)=>{
    

    if(response){

      this.dataServiceRef.binanceSheetData.next({
        Data: response.data,
        IsDataPresent: true
      });
    }


  })
}


}
