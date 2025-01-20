import { Component, ViewChild, OnDestroy, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from 'src/app/SharedComponents/confirm-dialog/confirm-dialog.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
import { MasterControlComponent } from '../../master-control/master-control.component';

@Component({
  selector: 'app-money-flow',
  templateUrl: './money-flow.component.html',
  styleUrls: ['./money-flow.component.scss']
})
export class MoneyFlowComponent implements OnInit {

  IsMasterControlEnabled:boolean=false;


  @Input() exchangeName: string = '';
  @Input() sheetName: string = '';

  columnTotals: any = {
    TotalDeposit: 0,
    TotalWithdraw: 0,
    TotalBalance: 0,
  };


  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService

  ) {

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled=IsEnabled;
    })
  }

  ngOnInit() {
    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)


    if (this.exchangeName?.toUpperCase() == 'BINANCE') {
      this.displayedColumns = this.functionsServiceRef.binance_DisplayColumns.Money_Flow
    }

    if (this.exchangeName?.toUpperCase() == 'BYBIT') {
      this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.Money_Flow
    }

    if (this.exchangeName?.toUpperCase() == 'MEXC' || this.exchangeName?.toUpperCase() === 'OURBIT') {
      this.displayedColumns = this.functionsServiceRef.mexc_DisplayColumns.Money_Flow
    }
    if (this.exchangeName?.toUpperCase() == 'KUCOIN') {
      this.displayedColumns = this.functionsServiceRef.kucoin_DisplayColumns.Money_Flow
    }
    if (this.exchangeName?.toUpperCase() == 'GATEIO') {
      this.displayedColumns = this.functionsServiceRef.gateio_DisplayColumns.Money_Flow
    }
    if (this.exchangeName?.toUpperCase() == 'DELTA') {
      this.displayedColumns = this.functionsServiceRef.delta_DisplayColumns.Money_Flow
    }
    

    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.calculateColumnTotals()
        }
      })
  }


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


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', this.currentPage - 1, this, this.componentDestroyed$);
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


  editItem(item: any) {
    // console.log("Edit Method's item on edit click : ", item)

    if (!this.IsMasterControlEnabled) {

      const dialogRef = this._dialog.open(MasterControlComponent, {
        disableClose: false,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe((result) => {

        if (result) {
          const dialogRef = this._dialog.open(UpdateEntryComponent, {

            data: {
              tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
            }, // Pass the 'item' data to the dialog component
            disableClose: false, // Prevent the dialog from closing on click outside
            hasBackdrop: false, // Allow interaction with the underlying page

          });
          dialogRef.afterClosed().subscribe((result) => {
            // Handle any data returned from the dialog if needed
            // console.log('Dialog was closed with result:', result);
          })

        }
      })


    }

    else {

      const dialogRef = this._dialog.open(UpdateEntryComponent, {

        data: {
          tradeData: item, sheetName: this.sheetName, exchangeName: this.exchangeName
        }, // Pass the 'item' data to the dialog component
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page

      });
      dialogRef.afterClosed().subscribe((result) => {
        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      })
    }
  }


  deleteEntry(ID: number, element: any) {
    if (!this.IsMasterControlEnabled) {
      if (!this.IsMasterControlEnabled) {

        const dialogRef = this._dialog.open(MasterControlComponent, {
          disableClose: false,
          hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
          }
        })

      }
    }

    else {
      this.functionsServiceRef.deleteEntry(this.exchangeName, this.sheetName, ID)
    }

  }






  calculateColumnTotals() {
    this.sheetData.forEach((element: any) => {
      if(element.Asset=='USDT'){
      if (element.Type == 'DEPOSIT' || element.Type == 'Deposit') {
        this.columnTotals.TotalDeposit += element.Amount;
      } else if (element.Type == 'WITHDRAW' || element.Type == 'Withdraw') {
        this.columnTotals.TotalWithdraw += element.Amount;
      }
    }
    });

    this.columnTotals.TotalBalance =
      this.columnTotals.TotalDeposit - this.columnTotals.TotalWithdraw;
  }

}
