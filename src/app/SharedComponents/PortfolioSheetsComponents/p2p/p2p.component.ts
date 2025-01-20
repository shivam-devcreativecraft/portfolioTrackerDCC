import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../../../SharedComponents/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject } from 'rxjs';
import { UpdateEntryComponent } from '../update-entry/update-entry.component';
import { MasterControlComponent } from '../../master-control/master-control.component';

@Component({
  selector: 'app-p2p',
  templateUrl: './p2p.component.html',
  styleUrls: ['./p2p.component.scss']
})
export class P2pComponent implements OnInit{
  @Input() exchangeName: string = '';
  @Input() sheetName: string = '';

  columnTotals: any = {
    // new
    TotalBuyUSDT: 0,
    TotalSellUSDT: 0,
    TotalBuyINR: 0,
    TotalSellINR: 0,
    TotalBuyTrades: 0,
    TotalSellTrades: 0,
    TotalTrades: 0,
    BalanceUSDT: 0,
    BalanceINR: 0,
  };

  IsMasterControlEnabled: boolean = false;

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService

  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }
 ngOnInit(): void {
  
  this.googleSheetAPIServiceRef.setSheetName(this.sheetName)
  

  if (this.exchangeName?.toUpperCase() == 'BINANCE') {
    this.displayedColumns = this.functionsServiceRef.binance_DisplayColumns.P2P
  }

  if (this.exchangeName?.toUpperCase() == 'BYBIT') {
    this.displayedColumns = this.functionsServiceRef.bybit_DisplayColumns.P2P
  }

  if (this.exchangeName?.toUpperCase() == 'MEXC') {
    this.displayedColumns = this.functionsServiceRef.mexc_DisplayColumns.P2P
  }
  if (this.exchangeName?.toUpperCase() == 'KUCOIN') {
    this.displayedColumns = this.functionsServiceRef.kucoin_DisplayColumns.P2P
  }
  if (this.exchangeName?.toUpperCase() == 'GATEIO') {
    this.displayedColumns = this.functionsServiceRef.gateio_DisplayColumns.P2P
  }





  this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', 1, this, this.componentDestroyed$)
  .then((sheetData)=>{
    if(sheetData){
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
        this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', this.currentPage + 1, this, this.componentDestroyed$);
      }
    }
  
    prevPage() {
      if (this.currentPage > 1) {
        this.functionsServiceRef.loadSheetData(this.exchangeName,this.sheetName, '', this.currentPage - 1, this, this.componentDestroyed$);
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
    let totalBuyUSDT = 0;
    let totalSellUSDT = 0;
    let totalBuyINR = 0;
    let totalSellINR = 0;
    // Initialize totals
    this.sheetData.forEach((element: any) => {
      if (element.Order_Type.toUpperCase() == 'SELL') {
        this.columnTotals.TotalBuyTrades += 1;

        totalSellUSDT += element.Amount_USDT;
        totalSellINR += element.Amount_INR;
        this.columnTotals.TotalSellUSDT += element.Amount_USDT;
        this.columnTotals.TotalSellINR += element.Amount_INR;
      }
      if (element.Order_Type.toUpperCase() == 'BUY') {
        this.columnTotals.TotalBuyUSDT += element.Amount_USDT;
        this.columnTotals.TotalBuyINR += element.Amount_INR;
        this.columnTotals.TotalSellTrades += 1;
      }

      if (element.Order_Type.toUpperCase() == 'BUY') {
        totalBuyUSDT += element.Amount_USDT;
        totalBuyINR += element.Amount_INR;
      }
    });

    this.columnTotals.BalanceUSDT = totalBuyUSDT - totalSellUSDT;
    this.columnTotals.BalanceINR = totalBuyINR - totalSellINR;
  }
}
