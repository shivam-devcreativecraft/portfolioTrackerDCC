import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../services/notification.service';
import { TradeDetailsModalComponent } from '../SharedComponents/trade-details-modal/trade-details-modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {
  tradeData: any[] = [];  // Single array to hold current tab's data
  sortedData: any[] = []; // Array to hold sorted data
  isLoading: boolean = true;
  activeTab: 'futures' | 'spot' = 'futures';

  // Pagination properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50, 100, 200, 500, 1000];

  // Initial sort state
  initialSort: Sort = { active: 'date', direction: 'desc' };

  constructor(
    private firebaseService: FirebaseDataService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private overlay: Overlay
  ) {
    this.sortedData = this.tradeData.slice();
  }

  ngOnInit() {
    this.loadTradeData();
  }

  ngAfterViewInit() {
    // Set initial sort after view is initialized
    if (this.sort) {
      this.sort.active = this.initialSort.active;
      this.sort.direction = this.initialSort.direction;
    }
  }

  loadTradeData() {
    this.isLoading = true;
    const sheetName = this.activeTab === 'futures' ? 'Futures_Trades' : 'Spot_Trades';
    
    this.firebaseService.getTradeData(sheetName).subscribe({
      next: (data) => {
        this.tradeData = data;
        // Apply initial sort
        this.sortData(this.initialSort);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error fetching ${sheetName}:`, error);
        this.notificationService.error(`Failed to load ${sheetName} data`);
        this.isLoading = false;
      }
    });
  }

  // Sorting function
  sortData(sort: Sort) {
    const data = this.tradeData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'date':
          return this.compare(new Date(a.Date).getTime(), new Date(b.Date).getTime(), isAsc);
        case 'coin':
          return this.compare(a.Coin || a.Market, b.Coin || b.Market, isAsc);
        case 'type':
          return this.compare(a.Type || a.Direction, b.Type || b.Direction, isAsc);
        case 'quantity':
          return this.compare(this.parseNumber(a.Quantity), this.parseNumber(b.Quantity), isAsc);
        case 'openPrice':
          return this.compare(this.parseNumber(a.Open_Price), this.parseNumber(b.Open_Price), isAsc);
        case 'openMargin':
          return this.compare(this.parseNumber(a.Open_Margin), this.parseNumber(b.Open_Margin), isAsc);
        case 'closePrice':
          return this.compare(this.parseNumber(a.Close_Price), this.parseNumber(b.Close_Price), isAsc);
        case 'closeMargin':
          return this.compare(this.parseNumber(a.Close_Margin), this.parseNumber(b.Close_Margin), isAsc);
        case 'pnl':
          return this.compare(this.parseNumber(a.Pnl), this.parseNumber(b.Pnl), isAsc);
        case 'pnlPercentage':
          return this.compare(this.parseNumber(a.Pnl_Percentage), this.parseNumber(b.Pnl_Percentage), isAsc);
        case 'influencer':
          return this.compare(a.Influencer, b.Influencer, isAsc);
        case 'sheetName':
          return this.compare(a.Sheet_Name || a.SheetName, b.Sheet_Name || b.SheetName, isAsc);
        case 'exchangeName':
          return this.compare(a.Exchange_Name || a.ExchangeName, b.Exchange_Name || b.ExchangeName, isAsc);
        default:
          return 0;
      }
    });
  }

  // Helper function for sorting
  private compare(a: number | string, b: number | string, isAsc: boolean) {
    if (a === null || a === undefined) a = isAsc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    if (b === null || b === undefined) b = isAsc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // Helper function to parse numbers safely
  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  switchTab(tab: 'futures' | 'spot') {
    this.activeTab = tab;
    this.loadTradeData();
    if (this.paginator) {
      this.paginator.firstPage();
    }
    if (this.sort) {
      // Reset to initial sort when switching tabs
      this.sort.active = this.initialSort.active;
      this.sort.direction = this.initialSort.direction;
    }
  }

  // Helper function to format date
  formatDate(date: string): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }

  // Helper function to format numbers
  formatNumber(value: number, decimals: number = 8): string {
    if (value === null || value === undefined) return '';
    return Number(value).toFixed(decimals);
  }

  // Helper to get PNL class
  getPnlClass(value: number): string {
    if (!value) return '';
    return value > 0 ? 'text-success' : value < 0 ? 'text-danger' : '';
  }

  async deleteTrade(tradeId: string) {
    // Show confirm dialog
    const dialogData = new ConfirmDialogModel(
      "Confirm Delete",
      "Are you sure you want to delete this trade?"
    );

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult) {
        try {
          const collectionName = this.activeTab === 'futures' ? 'Futures_Trades' : 'Spot_Trades';
          await this.firebaseService.deleteTrade(collectionName, tradeId);
          this.notificationService.success(`Trade deleted successfully from ${collectionName}`);
          this.loadTradeData(); // Reload data after deletion
        } catch (error: any) {
          console.error('Error deleting trade:', error);
          this.notificationService.error(error.message || 'Error deleting trade');
        }
      }
    });
  }

  openTradeDetails(trade: any): void {
    const dialogRef = this.dialog.open(TradeDetailsModalComponent, {
      data: {
        trade: trade,
        sheetName: this.activeTab === 'futures' ? 'Futures_Trades' : 'Spot_Trades'
      },
      width: '600px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: true,
      restoreFocus: true,
      hasBackdrop: false,
      panelClass: ['custom-dialog-container', 'no-scroll-overlay'],
      backdropClass: 'dialog-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.noop(),
    });

    // Reload data if trade was deleted
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.loadTradeData();
      }
    });
  }

  // Pagination handler
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
  }
}
