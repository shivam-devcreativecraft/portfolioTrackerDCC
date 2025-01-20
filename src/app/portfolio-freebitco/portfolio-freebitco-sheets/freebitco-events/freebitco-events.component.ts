import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
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
import { MatTooltip } from '@angular/material/tooltip';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { Subject } from 'rxjs';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';

@Component({
  selector: 'app-freebitco-events',
  templateUrl: './freebitco-events.component.html',
  styleUrls: ['./freebitco-events.component.scss'],
})
export class FreebitcoEventsComponent implements OnDestroy {
  private exchangeName:string='Freebitco'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName:string='Events' //for 1. MatTablle , 2. deleteEntry()

  IsMasterControlEnabled: boolean = false;


  columnTotals: any = {
    Won_BTC_Executed: 0,
    Invested_BTC_Executed: 0,
    Won_BTC_All: 0,
    Invested_BTC_All: 0,
    Pending_Return_BTC: 0,
    Pending_Events: 0,
    Executed_Events: 0,
  };

 
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private _dialog: MatDialog,
    private toastr: ToastrService,
    private functionsServiceRef: FunctionsService

  ) {

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })


    this.displayedColumns=this.functionsServiceRef.freebitco_DisplayColumns.Events
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

  @ViewChild(MatTooltip) tooltip!: MatTooltip;
  tooltipText: string = '';

  setTooltipText(result: string) {
    this.tooltipText = result;
  }

  removeTooltip() {
    this.tooltipText = ''; // Clear the tooltip message
  }

  calculateColumnTotals() {
    this.sheetData.forEach((element: any) => {
      // for events completed
      if (element.Result == 'WIN' || element.Result == 'LOOSE') {
        this.columnTotals.Won_BTC_Executed += element.Return;
        this.columnTotals.Invested_BTC_Executed += element.Invested;
        this.columnTotals.Executed_Events++;
      }
      // only for events pending
      if (element.Result != 'WIN' && element.Result != 'LOOSE') {
        this.columnTotals.Pending_Return_BTC += element.Invested;
        this.columnTotals.Pending_Events++;
      }
      // for both pending and completed

      this.columnTotals.Won_BTC_All += element.Return;
      this.columnTotals.Invested_BTC_All += element.Invested;
    });
    // console.log(this.columnTotals)
  }
}
