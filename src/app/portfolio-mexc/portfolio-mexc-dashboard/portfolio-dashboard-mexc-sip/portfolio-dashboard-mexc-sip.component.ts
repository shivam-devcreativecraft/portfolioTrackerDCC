import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-portfolio-dashboard-mexc-sip',
  templateUrl: './portfolio-dashboard-mexc-sip.component.html',
  styleUrls: ['./portfolio-dashboard-mexc-sip.component.scss']
})
export class PortfolioDashboardMexcSipComponent {
  IsSelectedSheetDataLoaded: boolean = false;
  columnTotals: any = {

  }
  Highcharts: typeof Highcharts = Highcharts
  chartOptions_TradingPairs!: Highcharts.Options;//PieChart


  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private toastr: ToastrService) {
    this.loadSheetData('SIP', 50, 1)
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
  }
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;

  isDestroyed: boolean = false;
  loadSheetData(sheetName: string, itemsPerPage: number, page: number) {
    if (!this.isDestroyed) {
      this.googleSheetAPIServiceRef.getAIOSheetsData('Mexc',sheetName, itemsPerPage, page).subscribe((data: any) => {

        if (data) {
          const newDataArray: any[] = Object.values(data.data);
          this.sheetData = [...this.sheetData, ...newDataArray];
          this.currentPage = page;
          this.totalPages = data.totalPages; // Assuming your API provides total pages
          this.pagesLoaded++;

          if (this.currentPage < this.totalPages) {
            // Make the next API call recursively
            this.loadSheetData('SIP', 50, this.currentPage + 1);
          } else if (this.pagesLoaded === this.totalPages) {


            // All pages have been loaded, show Toastr notification
            this.calculateColumnTotals()
            this.renderCharts()
            this.IsSelectedSheetDataLoaded = true;

            // this.toastr.success('Complete History Loaded', 'Successfull !');

          }
        }
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadSheetData('SIP', 50, this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadSheetData('SIP', 50, this.currentPage - 1);
    }
  }
  tradingPairCounts: { [key: string]: number } = {};

  calculateColumnTotals() {
    this.sheetData.forEach((element: any) => {
      let tradingPair = element.Market;
      if (this.tradingPairCounts[tradingPair]) {
        this.tradingPairCounts[tradingPair]++;
      } else {
        this.tradingPairCounts[tradingPair] = 1;
      }
    })

  }
  renderCharts() {
    this.render_TradingPair()
  }

  render_TradingPair() {
    // Extract keys and values from the tradingPairCounts object
    const keys = Object.keys(this.tradingPairCounts);
    const values = Object.values(this.tradingPairCounts);
    // Map the keys and values to the format required by Highcharts
    const pieData = keys.map((key, index) => [key, values[index]]);
    // console.log(pieData)
    this.chartOptions_TradingPairs = {
      chart: {
        type: 'pie',
        // options3d: {
        //   enabled: true,
        //   alpha: 45,
        //   beta: 0
        // }
      },
      title: {
        text: '',
        align: 'left'
      },
      // accessibility: {
      //   point: {
      //     valueSuffix: '%&%'
      //   }
      // },
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}Trades</b>'
        pointFormat: '{point.y} Trades'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Trades',
          data: pieData
        }
      ]
    };


  }


}