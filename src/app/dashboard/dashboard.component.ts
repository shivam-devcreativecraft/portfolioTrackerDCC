import { Component, OnInit } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  futuresTradeData: any[] = [];
  spotTradeData: any[] = [];
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
    
    // Load Futures Trades
    this.firebaseService.getTradeData('Futures_Trades').subscribe({
      next: (data) => {
        this.futuresTradeData = data;
        console.log(this.futuresTradeData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching futures trades:', error);
        this.isLoading = false;
      }
    });

    // Load Spot Trades
    this.firebaseService.getTradeData('Spot_Trades').subscribe({
      next: (data) => {
        this.spotTradeData = data;
        console.log(this.spotTradeData);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching spot trades:', error);
        this.isLoading = false;
      }
    });


    
  }

  switchTab(tab: 'futures' | 'spot') {
    this.activeTab = tab;
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
          this.notificationService.success('Trade deleted successfully');
        } catch (error) {
          console.error('Error deleting trade:', error);
          this.notificationService.error('Error deleting trade');
        }
      }
    });
  }
}
