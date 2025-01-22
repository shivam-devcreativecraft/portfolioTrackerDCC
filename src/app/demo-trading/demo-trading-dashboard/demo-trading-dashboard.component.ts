import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { ToastrService } from 'ngx-toastr';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { AddDemoTradingDeltaFuturesComponent } from '../add-demo-trading-delta-futures/add-demo-trading-delta-futures.component';
@Component({
  selector: 'app-demo-trading-dashboard',
  templateUrl: './demo-trading-dashboard.component.html',
  styleUrls: ['./demo-trading-dashboard.component.scss']
})
export class DemoTradingDashboardComponent {
 
  IsMasterControlEnabled: boolean = false;
  exchangeName: string = 'Delta_Exchange';
  sheetName: string = 'Futures_Trades'


  sheetData_FilteredBy_Influencers: any[] = [];



//#endregion

  //#region Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  private componentDestroyed$: Subject<void> = new Subject<void>();

  IsSelectedSheetDataLoaded: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;

//#endregion





  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();

  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, this.currentPage - 1, this, this.componentDestroyed$);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //#endregion


  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    // private toastr: ToastrService,
    private _dialog: MatDialog,
    private functionsServiceRef: FunctionsService,



  ) {


    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })







  }

  ngOnInit(): void {

    // this.getTradeHistoryRealtime('BYBIT')



    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 500, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
     
          const influencerData: any = sheetData.reduce((acc: any, item: any) => {
            const influencer = item.Influencer;

            if (!acc[influencer]) {
              acc[influencer] = [];
            }

            acc[influencer].push(item);
            return acc;
          }, {});

          this.sheetData_FilteredBy_Influencers = influencerData;
          
          if (this.sheetData_FilteredBy_Influencers) {
        
            console.log(this.sheetData,this.sheetData_FilteredBy_Influencers);
     
          }
        }
      });
  }





  IsAddDialogOpened: boolean = false;

  openAddNewEntryDialogForm() {
    this.IsAddDialogOpened = true;

    if (!this.IsMasterControlEnabled) {
      if (!this.IsMasterControlEnabled) {
        const dialogRef = this._dialog.open(MasterControlComponent, {
          disableClose: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            const dialogRef = this._dialog.open(AddDemoTradingDeltaFuturesComponent, {
              data: { ExchangeName : this.exchangeName, SheetName: this.sheetName },
              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
              maxWidth: '335px'
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened = false;
            });
          }
        });
      }
    } else {
      const dialogRef = this._dialog.open(AddDemoTradingDeltaFuturesComponent, {
        data: { ExchangeName : this.exchangeName, SheetName: this.sheetName },
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
        maxWidth: '335px'
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened = false;
      });
    }
  }

}
