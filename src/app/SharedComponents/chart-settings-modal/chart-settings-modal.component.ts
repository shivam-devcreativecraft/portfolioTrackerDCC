import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseDataService } from '../../services/firebase-data.service';
import { NotificationService } from '../../services/notification.service';
import { AnalysisSettings, formatSymbolPair } from '../../models/analysis-settings.model';

@Component({
  selector: 'app-chart-settings-modal',
  templateUrl: './chart-settings-modal.component.html',
  styleUrls: ['./chart-settings-modal.component.scss']
})
export class ChartSettingsModalComponent {
  settingsForm: FormGroup;
  isLoading = false;
  watchlist: string[] = [];
  symbolOverviewList: string[] = [];
  
  // New form groups for watchlist and overview inputs
  watchlistForm = this.fb.group({
    exchange: ['BINANCE', Validators.required],
    symbol: ['', [
      Validators.required,
      Validators.pattern('^[A-Za-z]+(?:\.p)?$|^[A-Za-z]+(?:\.P)?$')
    ]]
  });

  overviewForm = this.fb.group({
    exchange: ['BINANCE', Validators.required],
    symbol: ['', [
      Validators.required,
      Validators.pattern('^[A-Za-z]+(?:\.p)?$|^[A-Za-z]+(?:\.P)?$')
    ]]
  });

  exchanges = [
    { value: 'BINANCE', name: 'Binance' },
    { value: 'MEXC', name: 'MEXC' },
    { value: 'KUCOIN', name: 'KuCoin' },
    { value: 'BYBIT', name: 'Bybit' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChartSettingsModalComponent>,
    private firebaseService: FirebaseDataService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: AnalysisSettings
  ) {
    this.watchlist = [...data.chart_analysis.watchlist];
    this.symbolOverviewList = [...data.symbol_overview_symbols];

    this.settingsForm = this.fb.group({
      exchange: [data.chart_analysis.exchange, Validators.required],
      symbol: [data.chart_analysis.symbol, [
        Validators.required,
        Validators.pattern('^[A-Za-z]+(?:\.p)?$|^[A-Za-z]+(?:\.P)?$')
      ]],
      enabled_charts: this.fb.group({
        trading_view: [data.enabled_charts.trading_view],
        technical_analysis: [data.enabled_charts.technical_analysis],
        symbol_overview: [data.enabled_charts.symbol_overview],
        heatmap: [data.enabled_charts.heatmap],
        top_stories: [data.enabled_charts.top_stories],
        fundamental_data: [data.enabled_charts.fundamental_data],
        economic_calendar: [data.enabled_charts.economic_calendar],
        ticker_tape: [data.enabled_charts.ticker_tape]
      })
    });
  }

  addToWatchlist(): void {
    if (this.watchlistForm.valid) {
      const formValue = this.watchlistForm.value;
      const exchange = formValue.exchange ?? '';
      const symbol = formValue.symbol ?? '';
      
      if (exchange && symbol) {
        // Check if it's a perpetual symbol
        const isPerpetual = symbol.toUpperCase().endsWith('.P');
        // Clean the base symbol (remove .P if exists)
        const baseSymbol = symbol.replace(/\.P$/i, '');
        // Format the final symbol
        const formattedSymbol = `${exchange}:${baseSymbol.toUpperCase()}USDT${isPerpetual ? '.P' : ''}`;
        
        if (!this.watchlist.includes(formattedSymbol)) {
          this.watchlist.push(formattedSymbol);
          this.watchlistForm.get('symbol')?.reset();
          this.notificationService.success('Symbol added to watchlist');
        } else {
          this.notificationService.warning('Symbol already exists in watchlist');
        }
      }
    }
  }

  addToOverviewList(): void {
    if (this.overviewForm.valid) {
      const formValue = this.overviewForm.value;
      const exchange = formValue.exchange ?? '';
      const symbol = formValue.symbol ?? '';
      
      if (exchange && symbol) {
        // Check if it's a perpetual symbol
        const isPerpetual = symbol.toUpperCase().endsWith('.P');
        // Clean the base symbol (remove .P if exists)
        const baseSymbol = symbol.replace(/\.P$/i, '');
        // Format the final symbol
        const formattedSymbol = `${exchange}:${baseSymbol.toUpperCase()}USDT${isPerpetual ? '.P' : ''}`;
        
        if (!this.symbolOverviewList.includes(formattedSymbol)) {
          this.symbolOverviewList.push(formattedSymbol);
          this.overviewForm.get('symbol')?.reset();
          this.notificationService.success('Symbol added to overview list');
        } else {
          this.notificationService.warning('Symbol already exists in overview list');
        }
      }
    }
  }

  removeFromWatchlist(symbol: string): void {
    const index = this.watchlist.indexOf(symbol);
    if (index >= 0) {
      this.watchlist.splice(index, 1);
      this.notificationService.success('Symbol removed from watchlist');
    }
  }

  removeFromOverviewList(symbol: string): void {
    const index = this.symbolOverviewList.indexOf(symbol);
    if (index >= 0) {
      this.symbolOverviewList.splice(index, 1);
      this.notificationService.success('Symbol removed from overview list');
    }
  }

  onSave(): void {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      const formValue = this.settingsForm.value;
      
      const settings: AnalysisSettings = {
        chart_analysis: {
          exchange: formValue.exchange,
          symbol: formValue.symbol.toUpperCase(),
          watchlist: this.watchlist
        },
        symbol_overview_symbols: this.symbolOverviewList,
        enabled_charts: formValue.enabled_charts,
        is_configured: true
      };
      
      this.firebaseService.saveAnalysisSettings(settings).subscribe({
        next: () => {
          this.notificationService.success('Settings saved successfully');
          this.dialogRef.close(settings);
        },
        error: (error: Error) => {
          console.error('Error saving settings:', error);
          this.notificationService.error('Failed to save settings');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 