import { Component, OnInit } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  tradeData: any[] = [];  // Single array to hold current tab's data
  isLoading: boolean = true;
  activeTab: 'futures' | 'spot' = 'futures';

  constructor(
    private firebaseService: FirebaseDataService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTradeData();
  }

  loadTradeData() {
    this.isLoading = true;
    const sheetName = this.activeTab === 'futures' ? 'Futures_Trades' : 'Spot_Trades';
    
    this.firebaseService.getTradeData(sheetName).subscribe({
      next: (data) => {
        this.tradeData = data;
        // console.log(`${sheetName} data:`, this.tradeData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(`Error fetching ${sheetName}:`, error);
        this.notificationService.error(`Failed to load ${sheetName} data`);
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'futures' | 'spot') {
    this.activeTab = tab;
    this.loadTradeData(); // Reload data when tab changes
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
        } catch (error: any) {
          console.error('Error deleting trade:', error);
          this.notificationService.error(error.message || 'Error deleting trade');
        }
      }
    });
  }
}
