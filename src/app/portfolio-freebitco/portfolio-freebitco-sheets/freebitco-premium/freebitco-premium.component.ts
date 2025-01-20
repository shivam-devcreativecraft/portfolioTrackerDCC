import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UpdateEntryComponent } from 'src/app/SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import { MasterControlComponent } from 'src/app/SharedComponents/master-control/master-control.component';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-freebitco-premium',
  templateUrl: './freebitco-premium.component.html',
  styleUrls: ['./freebitco-premium.component.scss']
})
export class FreebitcoPremiumComponent implements OnInit, OnDestroy {
  private exchangeName: string = 'Freebitco'; //for 1. MatTablle , 2. deleteEntry()
  private sheetName: string = 'Premium' //for 1. MatTablle , 2. deleteEntry()

  IsMasterControlEnabled: boolean = false;



  dataToRender: any[] = [];

  columnTotals: any = {
    TotalInvested: 0,
    TotalEarnings: 0,
    TotalRealizedMaturity: 0,
    TotalUnRealizedMaturity: 0
  };
  IsColumnTotalExecuted: boolean = false;

  constructor(
    private _dialog: MatDialog,
    private functionsServiceRef: FunctionsService,
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private router:Router

  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })
  }

  ngOnInit(): void {
    this.googleSheetAPIServiceRef.setSheetName(this.sheetName)

    this.displayedColumns = this.functionsServiceRef.freebitco_DisplayColumns.Premium;
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, 1, this, this.componentDestroyed$)
      .then((sheetData) => {
        if (sheetData) {
          this.calculateStakingTotals();
        }
      });
  }


  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
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


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, this.currentPage + 1, this, this.componentDestroyed$);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, 200, this.currentPage - 1, this, this.componentDestroyed$);
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




  async updateOrder_Cards(item_ID: any) {
    // Find the item with the matching ID
    let dataToUpdate = this.sheetData.find(ele => ele.ID === item_ID);
  
    if (dataToUpdate) {
      dataToUpdate.Status = 'Matured';
  
      // Convert the found data to FormData
      const formData = new FormData();
      for (const key in dataToUpdate) {
        if (dataToUpdate.hasOwnProperty(key)) {
          formData.append(key, dataToUpdate[key].toString());
        }
      }
      formData.append('action', 'edit');
      formData.append('ExchangeName', this.exchangeName);
      formData.append('SheetName', this.sheetName);
  
      try {
        if (!this.IsMasterControlEnabled) {
          const dialogRef = this._dialog.open(MasterControlComponent, {
            disableClose: false,
            hasBackdrop: true
          });
  
          const dialogResult = await dialogRef.afterClosed().toPromise();
          if (dialogResult) {
            await this.functionsServiceRef.updateOrder_Cards(formData);
            
            // const currentUrl = this.router.url;
            
            // await this.router.navigateByUrl('/', { skipLocationChange: true });
            // await this.router.navigate([currentUrl]);
          }
        } else {
          await this.functionsServiceRef.updateOrder_Cards(formData);
         
          
          // Get the current URL and reload the page
          // const currentUrl = this.router.url;
         
          // await this.router.navigateByUrl('/', { skipLocationChange: true });
          // await this.router.navigate([currentUrl]);
        }

        const currentUrl = this.router.url;
         
        await this.router.navigateByUrl('/', { skipLocationChange: true });
        await this.router.navigate([currentUrl]);

      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  }
  




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


  calculateStakingTotals() {
    // console.log(this.sheetData);
    // Initialize the dataToRender array with the same structure for each element
    this.dataToRender = this.sheetData.map(() => ({
      Invested: 0,
      Earnings: 0,
      MaturityPeriod: 0,
      MaturityAPY: 0.00,
      UnRealizedMaturity: 0,
      RealizedMaturity: 0,
      UcomingMaturityDate: '',
      StartingDate: '',
      Expires_Date: '',
      Status: '',
    }));

    this.sheetData.forEach((element: any, index: number) => {
      // Add to dataToRender
      this.dataToRender[index].Invested = element.Principal;
      this.dataToRender[index].Earnings = element.Maturity;
      this.dataToRender[index].StartingDate = element.Date;
      this.dataToRender[index].Expires_Date = element.Expires_Date;
      this.dataToRender[index].Status = element.Status;
      this.dataToRender[index].MaturityPeriod = element.Days;
      this.dataToRender[index].MaturityAPY = element.APY;
      this.dataToRender[index].ID = element.ID
      if (element.Status == 'Matured') {
        this.dataToRender[index].RealizedMaturity = element.Earning;
      } else if (element.Status == 'Un-Matured') {
        this.dataToRender[index].UnRealizedMaturity = element.Earning;
        this.dataToRender[index].UcomingMaturityDate = element.Expires_Date;
      }
    });

    // Sort dataToRender based on StartingDate in descending order
    this.dataToRender.sort((a, b) => {
      const dateA = new Date(a.Expires_Date).getTime();
      const dateB = new Date(b.Expires_Date).getTime();
      return dateB - dateA; // Descending order
    });

    this.calculateColumnTotals()

    // console.log("ColumnTotal : ", this.dataToRender);
  }

  calculateColumnTotals() {
    this.IsColumnTotalExecuted = false
    this.dataToRender.forEach((ele: any) => {

      this.columnTotals.TotalInvested += ele.Invested;
      this.columnTotals.TotalEarnings += ele.Earnings;
      this.columnTotals.TotalRealizedMaturity += ele.RealizedMaturity;
      this.columnTotals.TotalUnRealizedMaturity += ele.UnRealizedMaturity
    })
    this.IsColumnTotalExecuted = true;
  }





  show_advance_options: boolean = false;
  filterOption: string = 'Un-Matured';
  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options
  }


  filterStakingStats(type: any) {
    this.filterOption = type;
  }

  get filteredDataToRender() {


    let filteredData: any;
    switch (this.filterOption) {
      case 'All': {
        filteredData = this.dataToRender;
        break;
      }
      case 'Matured': {
        filteredData = this.dataToRender.filter((data: any) =>
          data.Status == 'Matured'
        )
        break;
      }
      case 'Un-Matured': {
        filteredData = this.dataToRender.filter((data: any) =>
          data.Status == 'Un-Matured'
        )
        break;
      }
    }





    return filteredData
  }
  checkOrderNeedToUpdate(ExpiresDate: string): boolean {
    if (!ExpiresDate) {
      return false
    }

    // Get the current date and time
    const now = new Date();

    // Convert the ExpiresDate string to a Date object
    const expiresDate = new Date(ExpiresDate);

    // Compare the dates and return the result
    return expiresDate <= now;
  }
}
