import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
@Component({
  selector: 'app-search-spot-coin-dialog',
  templateUrl: './search-spot-coin-dialog.component.html',
  styleUrls: ['./search-spot-coin-dialog.component.scss']
})
export class SearchSpotCoinDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SearchSpotCoinDialogComponent>,
    private googleSheetAPIRef: GoogleSheetApiService,
    private router: Router,
    private dataServiceRef: DataService

    // @Inject(MAT_DIALOG_DATA) public tradingPairDataInjected: any,


  ) {
    // this.getColumnData();
    // this.serachCoin();
  }
  // exchangeName: string = 'Binannce';
  // sheetName: string = 'Spot_Trades';
  // // columnNames: string[] = ['Market', 'Direction', 'gjh'];
  // columnName:string='Market'
  // coinName:string='ETH'
  sheetName: string = 'Spot_Trades';
  columnName: string = 'Market';
  coinName: string = '';

  // getColumnData() {
  //   console.log("clicked");
  //   this.googleSheetAPIRef.getColumnData(this.exchangeName, this.sheetName, this.columnNames).subscribe((res: any) => {
  //     let data: any = res.data
  //     console.log("response : ", res); // Corrected here
  //     console.log(data); // Corrected here
  //     this.columnNames.forEach(element => {
  //       if (data[element]) {
  //         console.log(element, ' found on ', this.exchangeName)
  //       }
  //       console.log(element + " : ", data[element])
  //     });



  //   });
  // }







  isResponse: boolean = false;
  searchResult: any = null;
  isClickedOnce: boolean = false;






  searchCoin() {
    this.isClickedOnce = true
    this.isResponse = false; // Hide response-div and show loader
    this.coinName = this.coinName.replace(/\s+/g, '');
    this.googleSheetAPIRef.searchCoin(this.sheetName, this.columnName, this.coinName.toUpperCase())
      .subscribe((res: any) => {
        this.searchResult = res;
        if (this.searchResult) {

          this.isResponse = true; // Show response-div and hide loader
        }
      });
  }

  onClose(): void {
    this.dataServiceRef.setSearchTerm('');
    this.dialogRef.close();
  }
  gotoPortfolio(exchangeName: string) {

    this.dataServiceRef.setSearchTerm(this.coinName);

return
    switch (exchangeName) {
      case 'Binance':
        this.router.navigate([
          'portfolio-binance',
          'portfolio-binance-sheets',
          'binance-spot_trades',
        ]);
        break;
      case 'Bybit':
        this.router.navigate([
          'portfolio-bybit',
          'portfolio-bybit-sheets',
          'bybit-spot_trades',
        ]);
        break;
      case 'Mexc':
        this.router.navigate([
          'portfolio-mexc',
          'portfolio-mexc-sheets',
          'mexc-spot_trades',
        ]);
        break;
      case 'Kucoin':
        this.router.navigate([
          'portfolio-kucoin',
          'portfolio-kucoin-sheets',
          'kucoin-spot_trades',
        ]);
        break;
      case 'Gateio':
        this.router.navigate([
          'portfolio-gateio',
          'portfolio-gateio-sheets',
          'gateio-spot_trades',
        ]);
        break;
    }
  }

}



