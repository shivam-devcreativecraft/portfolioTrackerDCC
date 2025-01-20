import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-portfolio-mexc-dashboard',
  templateUrl: './portfolio-mexc-dashboard.component.html',
  styleUrls: ['./portfolio-mexc-dashboard.component.scss']
})
export class PortfolioMexcDashboardComponent {
  exchangeName: string = 'Mexc';

  sheetData: any[] = []
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private dataServiceRef: DataService
  ) {
    // if (this.dataServiceRef.mexcSheetData.Data != null && this.dataServiceRef.mexcSheetData.IsDataPresent) {

    //   this.sheetData = this.dataServiceRef.mexcSheetData.Data
    //   this.dataServiceRef.mexcSheetDataa.next(this.sheetData);
    //   console.log("SheetData : ", this.sheetData)
    // }
    // else 
    // this.getSheetData();

  }


getSheetData(){
  this.googleSheetAPIServiceRef.getMexcAllDataPD().subscribe((response:any)=>{
    

    if(response){
      this.dataServiceRef.mexcSheetData.next({
        Data: response.data,
        IsDataPresent: true
      });
    }


  })
}

}
