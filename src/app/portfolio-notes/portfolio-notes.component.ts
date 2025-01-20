import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleSheetApiService } from '../services/google-sheet-api.service';
import { FunctionsService } from '../SharedFunctions/functions.service';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateEntryComponent } from '../SharedComponents/PortfolioSheetsComponents/update-entry/update-entry.component';
import { MasterControlComponent } from '../SharedComponents/master-control/master-control.component';
import { AddNewComponent } from '../SharedComponents/PortfolioSheetsComponents/add-new/add-new.component';

@Component({
  selector: 'app-notes',
  templateUrl: './portfolio-notes.component.html',
  styleUrls: ['./portfolio-notes.component.scss'],

})
export class PortfolioNotesComponent implements OnInit {
  sortedSheetData: any[] = [];
  currentSort: string = 'desc';  // Tracks current sort order
  IsSheetDataSorted: boolean = false;
  exchangeSearchTerm: string = '';
  sheetSearchTerm: string = '';
  noteSearchTerm: string = '';
  dateSearchTerm: string = '';

  private exchangeName: string = 'Portfolio_Notes';
  private sheetName: string = 'Notes';

  IsMasterControlEnabled: boolean = false;



  constructor(private googleSheetAPIServiceRef: GoogleSheetApiService,
    private functionsServiceRef: FunctionsService,
    private _dialog: MatDialog

  ) { 

    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe((IsEnabled: boolean) => {
      this.IsMasterControlEnabled = IsEnabled;
    })

  }

  ngOnInit(): void {
    this.functionsServiceRef.loadSheetData(this.exchangeName, this.sheetName, '', 1, this, this.componentDestroyed$).then((sheetData) => {
      if (sheetData) {
        // console.log("Loadsheet data  : ", sheetData)
        this.IsSheetDataSorted = false;
        // console.log(sheetData)
        this.sortData('desc');  // Default sorting
      }
    })
  }
  sortData(order: string): void {


    this.currentSort = order;  // Update current sort state
    if (order === 'asc') {
      this.sortedSheetData = this.sheetData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    } else if (order === 'desc') {
      this.sortedSheetData = this.sheetData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    }
    // this.IsSheetDataSorted=true

    this.filterData();
  }

  //   filterData() {
  //     const filteredData = this.sheetData.filter(item => 
  //       item.Exchange_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       item.Sheet_Name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       item.Note.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       item.Date.toLowerCase().includes(this.searchTerm.toLowerCase()) 
  //     );
  //     this.sortedSheetData = this.currentSort === 'asc' ? 
  //       filteredData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()) :
  //       filteredData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
  //       return this.sortedSheetData
  // }
  filterData() {
    let filteredData = [...this.sheetData];


    // Filter by Exchange_Name
    if (this.exchangeSearchTerm) {
      filteredData = filteredData.filter(item => item.Exchange.toLowerCase().includes(this.exchangeSearchTerm.toLowerCase()));
    }

    // Filter by Sheet_Name
    if (this.sheetSearchTerm) {
      filteredData = filteredData.filter(item => item.Sheet.toLowerCase().includes(this.sheetSearchTerm.toLowerCase()));
    }

    // Filter by Note
    if (this.noteSearchTerm) {
      filteredData = filteredData.filter(item => item.Notes.toLowerCase().includes(this.noteSearchTerm.toLowerCase()));
    }

    // Filter by Date
    if (this.dateSearchTerm) {
      filteredData = filteredData.filter(item => item.Date.toLowerCase().includes(this.dateSearchTerm.toLowerCase()));
    }

    this.sortedSheetData = this.currentSort === 'asc' ?
      filteredData.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime()) :
      filteredData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    return this.sortedSheetData;
  }
  isDefaultOption(): boolean {

    if (this.exchangeSearchTerm != '' || this.sheetSearchTerm != '' || this.noteSearchTerm != '' || this.dateSearchTerm != '' || this.currentSort != 'desc')
      return true;
    else return false;
  }
  setDefaultOptions() {
    // this.searchTerm = ''
    this.sortData('desc')
    this.exchangeSearchTerm = '';
    this.sheetSearchTerm = '';
    this.noteSearchTerm = '';
    this.dateSearchTerm = ''

  }


  show_advance_options: boolean = false;
  OnShowAdvanceOptions() {
    this.show_advance_options = !this.show_advance_options;
  }
  //#region Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;


  IsSelectedSheetDataLoaded: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;


  private componentDestroyed$: Subject<void> = new Subject<void>();
  ngOnDestroy(): void {


    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
    // Close all WebSocket connections when the component is destroyed


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


            const dialogRef = this._dialog.open(AddNewComponent, {
              data : {ExchangeName : 'Portfolio_Notes', SheetName : 'Notes'},
              disableClose: false, // Prevent the dialog from closing on click outside
              hasBackdrop: false, // Allow interaction with the underlying page
            });

            dialogRef.afterClosed().subscribe(result => {
              this.IsAddDialogOpened=false

              // Handle any data returned from the dialog if needed
              // console.log('Dialog was closed with result:', result);
            });
          }
        })

      }
    }

    else {

      const dialogRef = this._dialog.open(AddNewComponent, {
        data : {ExchangeName : 'Portfolio_Notes', SheetName : 'Notes'},
        disableClose: false, // Prevent the dialog from closing on click outside
        hasBackdrop: false, // Allow interaction with the underlying page
      });

      dialogRef.afterClosed().subscribe(result => {
        this.IsAddDialogOpened=false

        // Handle any data returned from the dialog if needed
        // console.log('Dialog was closed with result:', result);
      });

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



}
