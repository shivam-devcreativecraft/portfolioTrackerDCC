import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-portfolio-bybit-dashboard',
  templateUrl: './portfolio-bybit-dashboard.component.html',
  styleUrls: ['./portfolio-bybit-dashboard.component.scss']
})
export class PortfolioBybitDashboardComponent {
  exchangeName: string = 'Bybit';

  
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
  this.googleSheetAPIServiceRef.getBybitAllDataPD().subscribe((response:any)=>{
    

    if(response){

      this.dataServiceRef.bybitSheetData.next({
        Data: response.data,
        IsDataPresent: true
      });
    }


  })
}


}
