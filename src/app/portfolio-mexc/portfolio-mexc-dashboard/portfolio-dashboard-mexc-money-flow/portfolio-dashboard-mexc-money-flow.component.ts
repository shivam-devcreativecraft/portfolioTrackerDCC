import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import * as Highcharts from 'highcharts';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-portfolio-dashboard-mexc-money-flow',
  templateUrl: './portfolio-dashboard-mexc-money-flow.component.html',
  styleUrls: ['./portfolio-dashboard-mexc-money-flow.component.scss']
})
export class PortfolioDashboardMexcMoneyFlowComponent  implements OnDestroy{
  IsSelectedSheetDataLoaded: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions_DepositWithdraw_PieChart!: Highcharts.Options;
  columnTotals: any = {
    Deposit: 0,
    Withdraw: 10,
    Balance: 0
  }
  constructor(private googleSheetAPIServiceRef: GoogleSheetApiService, private dialog: MatDialog, private toastr: ToastrService) {


    this.loadSheetData('Money_Flow', 50, 1)


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


          this.pageSizeOptions = Math.floor(this.sheetData.length)



          this.currentPage = page;
          this.totalPages = data.totalPages; // Assuming your API provides total pages

          this.pagesLoaded++;

          if (this.currentPage < this.totalPages) {
            // Make the next API call recursively
            this.loadSheetData('Money_Flow', 50, this.currentPage + 1);
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
      this.loadSheetData('Money_Flow', 50, this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.loadSheetData('Money_Flow', 50, this.currentPage - 1);
    }
  }


  calculateColumnTotals() {

    this.sheetData.forEach((element: any) => {
      if (element.Type.toUpperCase() == 'DEPOSIT')
        this.columnTotals.Deposit = this.columnTotals.Deposit + element.Amount_USDT;

      if (element.Type.toUpperCase() == 'WITHDRAW') {
        this.columnTotals.Withdraw = this.columnTotals.Withdraw + element.Amount_USDT;

      }
    });
    this.columnTotals.Balance = this.columnTotals.Deposit - this.columnTotals.Withdraw
    // console.log("total : ", this.columnTotals)

  }


  renderCharts() {

    this.withdrawDeposit_PieChart()


  }
  withdrawDeposit_PieChart() {
    this.chartOptions_DepositWithdraw_PieChart = {
      chart: {
        type: 'pie',
        // options3d: {
        //   enabled: true,
        //   alpha: 45,
        //   beta: 0
        // }
      },
      title: {
        text: `Balance<br>₮ ${this.columnTotals.Balance}`,
        align: 'center',
      },
      // accessibility: {
      //   point: {
      //     valueSuffix: '%&%'
      //   }
      // },
      tooltip: {

        // pointFormat: '<b>{series.name}: {point.percentage:.1f} %</b>' 
        pointFormat: '<b>{point.percentage:.1f} %</b>'


      },

      colors: ['#00e272', '#fa4b42'], // Define colors for winning and losing
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 15,
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
          data: [



            [`DEPOSIT<br>₮ ${this.columnTotals.Deposit}`, this.columnTotals.Deposit],
            [`WITHDRAW<br>₮ ${this.columnTotals.Withdraw}`, this.columnTotals.Withdraw]

          ],

        }
      ]
    };





  }
}
