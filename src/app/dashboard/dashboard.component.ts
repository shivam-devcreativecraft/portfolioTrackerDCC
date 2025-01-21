import { Component, OnInit } from '@angular/core';
import { FirebaseDataService } from '../services/firebase-data.service';
import { DatePipe } from '@angular/common';

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
    private datePipe: DatePipe
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
  formatDate(date: any): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'MMM dd, yyyy') || '';
  }

  // Helper function to format numbers
  formatNumber(num: number): string {
    return num?.toFixed(2) || '0.00';
  }

  // Helper to get PNL class
  getPnlClass(pnl: number): string {
    return pnl > 0 ? 'text-success' : pnl < 0 ? 'text-danger' : '';
  }
}
