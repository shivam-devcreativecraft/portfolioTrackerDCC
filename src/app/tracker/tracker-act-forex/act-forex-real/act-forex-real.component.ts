import { Component, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/SharedComponents/confirm-dialog/confirm-dialog.component';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
@Component({
  selector: 'app-act-forex-real',
  templateUrl: './act-forex-real.component.html',
  styleUrls: ['./act-forex-real.component.scss']
})
export class ActForexRealComponent  implements OnDestroy{
  IsSelectedSheetDataLoaded: boolean = false;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
constructor(private googleSheetAPIServiceRef : GoogleSheetApiService){
  this.loadSheetData('ACT_Forex_Real', 50, 1)


}

isDestroyed: boolean = false;

ngOnDestroy(): void {
  this.isDestroyed = true;
}
sheetData: any[] = [];
currentPage = 1;
totalPages = 1;
pagesLoaded = 0;
pageSizeOptions = 0;


loadSheetData(sheetName: string, itemsPerPage: number, page: number) {
  if (!this.isDestroyed) {
    this.googleSheetAPIServiceRef.getAIOSheetsData('Exness',sheetName, itemsPerPage, page).subscribe((data: any) => {

      if (data) {
        const newDataArray: any[] = Object.values(data.data);
        this.sheetData = [...this.sheetData, ...newDataArray];
        this.dataSource = new MatTableDataSource([...this.sheetData]);

        this.pageSizeOptions = Math.floor(this.sheetData.length)

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.currentPage = page;
        this.totalPages = data.totalPages; // Assuming your API provides total pages

        this.pagesLoaded++;

        if (this.currentPage < this.totalPages) {
          // Make the next API call recursively
          this.loadSheetData('ACT_Forex_Real', 50, this.currentPage + 1);
        } else if (this.pagesLoaded === this.totalPages) {


          // All pages have been loaded, show Toastr notification
          // this.calculateColumnTotals()
          this.IsSelectedSheetDataLoaded = true;
// console.log(this.sheetData)
          // this.toastr.success('Complete History Loaded', 'Successfull !');

        }
      }
    });
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.loadSheetData('ACT_Forex_Real', 50, this.currentPage + 1);
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.loadSheetData('ACT_Forex_Real', 50, this.currentPage - 1);
  }
}
}

