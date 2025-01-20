import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { Subject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { TradeDetailsModalComponent } from './trade-details-modal/trade-details-modal.component';

interface GroupedData {
  profitableTrades: any[];
  losedTrades: any[];
  profit: number;
  loss: number;
  totalTrades: number;
  buyTrades: number;
  sellTrades: number;
}

interface DateRange {
  start: string;
  end: string;
  label: string;
}

@Component({
  selector: 'app-delta-exchange',
  templateUrl: './delta-exchange.component.html',
  styleUrls: ['./delta-exchange.component.scss']
})
export class DeltaExchangeComponent implements OnDestroy, OnInit {
  IsMasterControlEnabled: boolean = false;

  exchangeName: string = 'Demo_Trading';
  sheetName: string = 'Delta_Futures';

  //#region Material Table
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('profitPaginator') profitPaginator!: MatPaginator;
  @ViewChild('lossPaginator') lossPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('picker') datePicker!: any;
  @ViewChild('dateInput') dateInput!: ElementRef;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;

  IsSelectedSheetDataLoaded: boolean = false;
  sheetData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  pagesLoaded = 0;
  pageSizeOptions = 0;

  // Pagination for profitable trades
  profitCurrentPage = 1;
  profitItemsPerPage = 5;
  
  // Pagination for loss trades
  lossCurrentPage = 1;
  lossItemsPerPage = 5;

  //#endregion

  selectedDate: string | null = null;
  availableDates: Date[] = [];
  totalStats: GroupedData = {
    profitableTrades: [],
    losedTrades: [],
    profit: 0,
    loss: 0,
    totalTrades: 0,
    buyTrades: 0,
    sellTrades: 0
  };

  sheetDataGrouped: Record<string, GroupedData> = {};
  visibleDates: string[] = [];
  showAllDates: boolean = false;
  private componentDestroyed$: Subject<void> = new Subject<void>();

  selectedDateCategory: string = 'daily';

  dateRanges: DateRange[] = [];
  aggregatedData: Record<string, GroupedData> = {};

  // Pagination properties
  // currentPage = 1;
  itemsPerPage = 10;
  Math = Math;  // Make Math available in template

  Highcharts: typeof Highcharts = Highcharts;
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { }; // Optional callback
  updateFlag = false;

  profitLossChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: { 
      text: 'Profit/Loss Distribution',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: ['Profit', 'Loss', 'Net P/L'],
      labels: {
        style: {
          color: '#666'
        }
      }
    },
    yAxis: {
      title: { 
        text: 'Amount ($)',
        style: {
          color: '#666'
        }
      },
      labels: {
        formatter: function() {
          return '$' + Highcharts.numberFormat(Math.abs(this.value as number), 0, '.', ',');
        }
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        groupPadding: 0.2,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          style: {
            textOutline: 'none'
          }
        }
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const point = this.point as any;
        const value = this.y || 0;
        const prefix = value >= 0 ? '+' : '-';
        let color;
        
        // Set color based on point type
        if (point.custom?.type === 'profit') {
          color = '#4caf50';  // Always green for profit
        } else if (point.custom?.type === 'loss') {
          color = '#ef5350';  // Always red for loss
        } else {
          color = value >= 0 ? '#28a745' : '#dc3545';  // Dynamic for net P/L
        }
        
        return `<div style="color: ${color}">
                <b>${this.x}</b><br/>
                ${prefix}$${Highcharts.numberFormat(Math.abs(value), 3, '.', ',')}
                </div>`;
      }
    },
    series: [{
      type: 'column',
      name: 'Trading Results',
      data: []
    }]
  };

  tradeCountChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { 
      text: 'Trade Distribution',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      categories: ['Total', 'Buy', 'Sell'],
      labels: {
        style: { color: '#666' }
      }
    },
    yAxis: {
      title: { 
        text: 'Number of Trades',
        style: { color: '#666' }
      },
      labels: {
        formatter: function() {
          return Highcharts.numberFormat(this.value as number, 0);
        }
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        groupPadding: 0.2,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          formatter: function() {
            return Highcharts.numberFormat(this.y as number || 0, 0);
          }
        }
      }
    },
    tooltip: {
      formatter: function() {
        return '<b>' + this.x + '</b><br/>' +
               Highcharts.numberFormat(this.y as number || 0, 0) + ' trades';
      }
    },
    series: [{
      type: 'column',
      name: 'Trades',
      color: '#6c757d',
      data: []
    }]
  };

  tradePieChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'pie',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { 
      text: 'Trade Performance',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f}%',
          distance: -30,
          style: {
            textOutline: 'none'
          }
        },
        showInLegend: true,
        startAngle: 180,
        endAngle: 540,
        center: ['50%', '50%']
      }
    },
    tooltip: {
      pointFormat: '{point.name}: <b>{point.y} trades ({point.percentage:.1f}%)</b>'
    },
    series: [{
      type: 'pie',
      name: 'Trades',
      data: []
    }]
  };

  trendChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'inherit'
      }
    },
    title: { 
      text: 'Trading Performance Over Time',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'datetime',
      labels: {
        style: {
          color: '#666'
        },
        formatter: function() {
          return Highcharts.dateFormat('%Y-%m-%d', this.value as number);
        }
      }
    },
    yAxis: {
      title: { 
        text: 'Cumulative P/L ($)',
        style: {
          color: '#666'
        }
      },
      labels: {
        formatter: function() {
          return '$' + Highcharts.numberFormat(this.value as number, 0, '.', ',');
        }
      }
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.color('#28a745').setOpacity(0.5).get('rgba') as string],
            [1, Highcharts.color('#28a745').setOpacity(0).get('rgba') as string]
          ]
        },
        marker: {
          radius: 4
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        }
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        const point = this.points?.[0];
        if (!point) return '';
        const xValue = point.x as number;
        return `<b>${Highcharts.dateFormat('%Y-%m-%d', xValue)}</b><br/>
                Net P/L: $${Highcharts.numberFormat(point.y || 0, 0, '.', ',')}`;
      }
    },
    series: [{
      type: 'area',
      name: 'Net P/L',
      data: [],
      color: '#28a745'
    }]
  };

  // Selected period chart options
  selectedProfitLossChartOptions: Highcharts.Options = {
    ...this.profitLossChartOptions,
    title: { 
      text: 'Period Profit/Loss Distribution',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        groupPadding: 0.2,
        pointWidth: 40,
        dataLabels: {
          enabled: true,
          style: {
            textOutline: 'none'
          }
        }
      }
    },
    tooltip: {
      useHTML: true,
      formatter: function(this: Highcharts.TooltipFormatterContextObject): string {
        const point = this.point as any;
        const value = this.y || 0;
        const prefix = value >= 0 ? '+' : '-';
        let color;
        
        // Set color based on point type
        if (point.custom?.type === 'profit') {
          color = '#4caf50';  // Always green for profit
        } else if (point.custom?.type === 'loss') {
          color = '#ef5350';  // Always red for loss
        } else {
          color = value >= 0 ? '#28a745' : '#dc3545';  // Dynamic for net P/L
        }
        
        return `<div style="color: ${color}">
                <b>${this.x}</b><br/>
                ${prefix}$${Highcharts.numberFormat(Math.abs(value), 3, '.', ',')}
                </div>`;
      }
    }
  };

  selectedTradeCountChartOptions: Highcharts.Options = {
    ...this.tradeCountChartOptions,
    title: { 
      text: 'Period Trade Distribution',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    }
  };

  selectedTradePieChartOptions: Highcharts.Options = {
    ...this.tradePieChartOptions,
    title: { 
      text: 'Period Trade Performance',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    }
  };

  // Add new chart configuration for PnL per trade
  pnlPerTradeChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { 
      text: 'PnL Per Trade',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      categories: [],
      labels: {
        style: { color: '#666' },
        rotation: -45
      }
    },
    yAxis: {
      title: { 
        text: 'PnL ($)',
        style: { color: '#666' }
      },
      labels: {
        formatter: function() {
          return '$' + Highcharts.numberFormat(this.value as number, 2);
        }
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        groupPadding: 0.2,
        dataLabels: {
          enabled: true,
          formatter: function() {
            const value = this.y as number || 0;
            const prefix = value >= 0 ? '+' : '';
            return prefix + '$' + Highcharts.numberFormat(value, 2);
          },
          style: {
            textOutline: 'none'
          }
        }
      }
    },
    tooltip: {
      formatter: function(this: Highcharts.TooltipFormatterContextObject) {
        const point = this.point as any;
        const value = this.y as number || 0;
        const prefix = value >= 0 ? '+' : '';
        const color = value >= 0 ? '#28a745' : '#dc3545';
        return `<div style="color: ${color}">
                <b>Trade ${point.index + 1}</b><br/>
                Date: ${point.date}<br/>
                Time: ${point.time}<br/>
                Coin: ${point.coin}<br/>
                Type: ${point.type}<br/>
                Contracts: ${point.contracts}<br/>
                Leverage: ${point.leverage}x<br/>
                Entry: $${point.openPrice}<br/>
                Exit: $${point.closePrice}<br/>
                PnL: ${prefix}$${Highcharts.numberFormat(value, 2)}<br/>
                PnL %: ${prefix}${Highcharts.numberFormat(point.pnlPercentage, 2)}%
                </div>`;
      },
      useHTML: true
    },
    series: [{
      type: 'column',
      name: 'PnL',
      data: []
    }]
  };

  // Add new chart configuration for daily performance tracking
  dailyPerformanceChartOptions: Highcharts.Options = {
    credits: { enabled: false },
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      style: { fontFamily: 'inherit' }
    },
    title: { 
      text: 'Per Trade Performance',
      style: {
        color: '#333',
        fontWeight: 'bold'
      }
    },
    xAxis: {
      type: 'category',
      categories: [],
      labels: {
        style: { color: '#666' },
        rotation: -45
      }
    },
    yAxis: {
      title: { 
        text: 'Trade PnL ($)',
        style: { color: '#666' }
      },
      labels: {
        formatter: function() {
          const value = this.value as number;
          const prefix = value >= 0 ? '+' : '';
          return prefix + '$' + Highcharts.numberFormat(value, 2);
        }
      }
    },
    plotOptions: {
      area: {
        marker: {
          radius: 4,
          fillColor: '#FFFFFF',
          lineWidth: 2,
          lineColor: undefined,
          states: {
            hover: {
              lineWidth: 3
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(this: Highcharts.PointLabelObject): string {
            const value = this.y || 0;
            const prefix = value >= 0 ? '+' : '';
            const color = value >= 0 ? '#28a745' : '#dc3545';
            return `<span style="color: ${color}">${prefix}$${Highcharts.numberFormat(value, 2)}</span>`;
          },
          useHTML: true,
          style: {
            textOutline: 'none',
            fontWeight: 'bold'
          }
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 3
          }
        },
        threshold: 0,
        fillOpacity: 0.3
      }
    },
    tooltip: {
      formatter: function(this: Highcharts.TooltipFormatterContextObject) {
        const point = this.point as any;
        const value = this.y as number || 0;
        const prefix = value >= 0 ? '+' : '';
        const color = value >= 0 ? '#28a745' : '#dc3545';
        return `<div style="color: ${color}">
                <b>Trade ${point.index + 1}</b><br/>
                Date: ${point.date}<br/>
                Time: ${point.time}<br/>
                Coin: ${point.coin}<br/>
                Type: ${point.type}<br/>
                Contracts: ${point.contracts}<br/>
                Leverage: ${point.leverage}x<br/>
                Entry: $${point.openPrice}<br/>
                Exit: $${point.closePrice}<br/>
                PnL: ${prefix}$${Highcharts.numberFormat(value, 2)}<br/>
                PnL %: ${prefix}${Highcharts.numberFormat(point.pnlPercentage, 2)}%
                </div>`;
      },
      useHTML: true
    },
    series: [{
      type: 'area',
      name: 'Trade PnL',
      data: [],
      zones: [{
        value: 0,
        color: '#dc3545',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color('#dc3545').setOpacity(0.3).get('rgba') as string],
            [1, Highcharts.color('#dc3545').setOpacity(0).get('rgba') as string]
          ]
        }
      }, {
        color: '#28a745',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color('#28a745').setOpacity(0.3).get('rgba') as string],
            [1, Highcharts.color('#28a745').setOpacity(0).get('rgba') as string]
          ]
        }
      }]
    }]
  };

  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private toastr: ToastrService,
    private _dialog: MatDialog,
    private functionsServiceRef: FunctionsService
  ) {
    this.googleSheetAPIServiceRef.checkMasterControlSubject$.subscribe(
      (IsEnabled: boolean) => {
        this.IsMasterControlEnabled = IsEnabled;
      }
    );
  }

  ngOnInit(): void {
    this.functionsServiceRef
      .loadSheetData(
        this.exchangeName,
        this.sheetName,
        500,
        1,
        this,
        this.componentDestroyed$
      )
      .then((sheetData) => {
        if (sheetData) {
          this.sheetDataGrouped = this.groupDataByDate(sheetData);
          this.calculateTotalStats();
          this.initializeAvailableDates();
          this.setInitialVisibleDates();
          this.toggleDatesView(true);
          
          // Initialize charts after data is loaded
          this.initializeCharts();
          
          // Update charts with initial data
          this.updateCharts();
          
          this.onDateCategoryChanged({ value: 'daily' });
          this.toastr.success('Sheet Data Loaded Successfully', 'Success');
          this.currentPage = 1;
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  private calculateTotalStats(): void {
    this.totalStats = {
      profitableTrades: [],
      losedTrades: [],
      profit: 0,
      loss: 0,
      totalTrades: 0,
      buyTrades: 0,
      sellTrades: 0
    };
    Object.values(this.sheetDataGrouped).forEach(dateData => {
      this.totalStats.profit += dateData.profit;
      this.totalStats.loss += dateData.loss;
      this.totalStats.totalTrades += dateData.totalTrades;
      this.totalStats.buyTrades += dateData.buyTrades;
      this.totalStats.sellTrades += dateData.sellTrades;
      this.totalStats.profitableTrades.push(...dateData.profitableTrades);
      this.totalStats.losedTrades.push(...dateData.losedTrades);
    });
  }

  private initializeAvailableDates(): void {
    this.availableDates = Object.keys(this.sheetDataGrouped)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => b.getTime() - a.getTime()); // Sort in descending order
  }

  private setInitialVisibleDates(): void {
    const sortedDates = Object.keys(this.sheetDataGrouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Set the most recent date as selected by default
    if (sortedDates.length > 0) {
      this.selectedDate = sortedDates[0];
    }

    this.visibleDates = this.showAllDates ? sortedDates : sortedDates.slice(0, 2);
  }

  onDatePillClick(date: string): void {
    if (this.selectedDate === date) {
      this.selectedDate = null;
      // Clear date picker value when deselecting
      if (this.dateInput) {
        this.dateInput.nativeElement.value = '';
      }
    } else {
      // Select the new date
      this.selectedDate = date;
      // Update date picker value
      if (this.dateInput) {
        this.dateInput.nativeElement.value = date;
      }
    }
    this.updateCharts();
  }

  onDateSelected(event: MatDatepickerInputEvent<Date>): void {
    
    if (event.value) {
      this.selectedDate = this.selectedDateCategory = 'daily';
      this.onDateCategoryChanged({ value: this.selectedDate });
      const selectedDateStr = this.formatDate(event.value);
      if (this.sheetDataGrouped[selectedDateStr]) {
        this.selectedDate = selectedDateStr;
      }
    }
    this.updateCharts();
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const dateStr = this.formatDate(date);

    return Object.keys(this.sheetDataGrouped).includes(dateStr);
  };

  private formatDate(date: Date): string {
    // Convert to Indian timezone
    const indiaDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000)); // Adding 5:30 hours for IST
    const year = indiaDate.getFullYear();
    const month = String(indiaDate.getMonth() + 1).padStart(2, '0');
    const day = String(indiaDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private groupDataByDate(data: any[]): Record<string, GroupedData> {
    const grouped: Record<string, GroupedData> = {};
    data.forEach(trade => {
      if (!grouped[trade.Date]) {
        grouped[trade.Date] = {
          profitableTrades: [],
          losedTrades: [],
          profit: 0,
          loss: 0,
          totalTrades: 0,
          buyTrades: 0,
          sellTrades: 0
        };
      }

      if (trade.Pnl >= 0) {
        grouped[trade.Date].profitableTrades.push(trade);
        grouped[trade.Date].profit += trade.Pnl;
      } else {
        grouped[trade.Date].losedTrades.push(trade);
        grouped[trade.Date].loss += trade.Pnl;
      }

      grouped[trade.Date].totalTrades++;
      
      // Count buy and sell trades based on Side
      if ((trade.Type).toUpperCase() === 'BUY') {
        grouped[trade.Date].buyTrades++;
      } else if ((trade.Type).toUpperCase() === 'SELL') {
        grouped[trade.Date].sellTrades++;
      }
    });

    return grouped;
  }

  toggleDatesView(showAll: boolean): void {
    this.showAllDates = showAll;
    const sortedDates = Object.keys(this.sheetDataGrouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    this.visibleDates = showAll ? sortedDates : sortedDates.slice(0, 2);

    // Clear datepicker
    if (this.dateInput) {
      this.dateInput.nativeElement.value = '';
    }

    // Select the most recent date if no date is currently selected
    if (!this.selectedDate && sortedDates.length > 0) {
      this.selectedDate = sortedDates[0];
    }
  }

  onPageChange(page: number): void {
    if (page >= 1 && this.selectedDate && 
        (this.aggregatedData[this.selectedDate]?.profitableTrades?.length > 0 || 
         this.aggregatedData[this.selectedDate]?.losedTrades?.length > 0)) {
      this.currentPage = page;
    }
  }

  onProfitPageChange(event: any): void {
    this.profitCurrentPage = event.pageIndex + 1;
    this.profitItemsPerPage = event.pageSize;
  }

  onLossPageChange(event: any): void {
    this.lossCurrentPage = event.pageIndex + 1;
    this.lossItemsPerPage = event.pageSize;
  }

  private aggregateDataForRange(startDate: string, endDate: string): GroupedData {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    const result: GroupedData = {
      profitableTrades: [],
      losedTrades: [],
      profit: 0,
      loss: 0,
      totalTrades: 0,
      buyTrades: 0,
      sellTrades: 0
    };

    Object.entries(this.sheetDataGrouped).forEach(([date, data]) => {
      const currentDate = new Date(date);
      if (currentDate >= start && currentDate <= end) {
        result.profitableTrades.push(...data.profitableTrades);
        result.losedTrades.push(...data.losedTrades);
        result.profit += data.profit;
        result.loss += data.loss;
        result.totalTrades += data.totalTrades;
        result.buyTrades += data.buyTrades;
        result.sellTrades += data.sellTrades;
      }
    });

    return result;
  }

  onDateCategoryChanged(event: any): void {
    const category = event.value;
    const dates = Object.keys(this.sheetDataGrouped);
    const currentDate = new Date('2025-01-07');
  
    // Sort dates in descending order (newest first)
    dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
    this.dateRanges = [];
    this.aggregatedData = {};

    switch (category) {
      case 'daily':
        // Show all dates that have trades
        dates.forEach(date => {
          this.dateRanges.push({
            start: date,
            end: date,
            label: date
          });
        });
        break;

      case 'weekly':
        // Group by weeks
        const weeklyMap = new Map<string, DateRange>();
        dates.forEach(date => {
          const dateObj = new Date(date);
          const day = dateObj.getDay();
          const diff = dateObj.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(dateObj.setDate(diff));
          const sunday = new Date(monday);
          sunday.setDate(sunday.getDate() + 6);
        
          const weekKey = monday.toISOString().split('T')[0];
          if (!weeklyMap.has(weekKey) && weeklyMap.size < 4) {
            weeklyMap.set(weekKey, {
              start: monday.toISOString().split('T')[0],
              end: sunday.toISOString().split('T')[0],
              label: `Week of ${monday.toISOString().split('T')[0]}`
            });
          }
        });
        this.dateRanges = Array.from(weeklyMap.values());
        break;

      case 'monthly':
        // Group by months
        const monthlyMap = new Map<string, DateRange>();
        dates.forEach(date => {
          const dateObj = new Date(date);
          const firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
          const lastDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
        
          const monthKey = firstDay.toISOString().split('T')[0];
          if (!monthlyMap.has(monthKey) && monthlyMap.size < 6) {
            monthlyMap.set(monthKey, {
              start: firstDay.toISOString().split('T')[0],
              end: lastDay.toISOString().split('T')[0],
              label: `${firstDay.toLocaleString('default', { month: 'long' })} ${firstDay.getFullYear()}`
            });
          }
        });
        this.dateRanges = Array.from(monthlyMap.values());
        break;

      case 'yearly':
        // Group by years
        const yearlyMap = new Map<string, DateRange>();
        dates.forEach(date => {
          const dateObj = new Date(date);
          const firstDay = new Date(dateObj.getFullYear(), 0, 1);
          const lastDay = new Date(dateObj.getFullYear(), 11, 31);
        
          const yearKey = firstDay.getFullYear().toString();
          if (!yearlyMap.has(yearKey) && yearlyMap.size < 3) {
            yearlyMap.set(yearKey, {
              start: firstDay.toISOString().split('T')[0],
              end: lastDay.toISOString().split('T')[0],
              label: firstDay.getFullYear().toString()
            });
          }
        });
        this.dateRanges = Array.from(yearlyMap.values());
        break;
    }

    // Aggregate data for each date range
    this.dateRanges.forEach(range => {
      this.aggregatedData[range.label] = this.aggregateDataForRange(range.start, range.end);
    });

    // Update visible dates to show the labels
    this.visibleDates = this.dateRanges.map(range => range.label);

    // Select the first date range if available
    if (this.visibleDates.length > 0) {
      this.selectedDate = this.visibleDates[0];
      // Update date picker value when category changes
      if (this.dateInput && category === 'daily') {
        this.dateInput.nativeElement.value = this.selectedDate;
      } else if (this.dateInput) {
        // Clear date picker for non-daily categories
        this.dateInput.nativeElement.value = '';
      }
    } else {
      this.selectedDate = null;
      if (this.dateInput) {
        this.dateInput.nativeElement.value = '';
      }
    }
    this.updateCharts();
  }

  openTradeDetails(trade: any): void {
    this._dialog.open(TradeDetailsModalComponent, {
      data: trade,
      width: '500px',
      panelClass: 'trade-details-modal'
    });
  }

  updateCharts() {
    if (!this.totalStats) return;

    // Get the selected period data
    const selectedData = this.selectedDate ? 
      this.aggregatedData[this.selectedDate] : this.totalStats;

    if (selectedData) {
      // Update Overall Profit/Loss Chart
      const netPL = this.totalStats.profit + this.totalStats.loss;
      const profitLossSeries = {
        type: 'column' as const,
        name: 'Trading Results',
        data: [
          { 
            y: Math.abs(this.totalStats.profit), 
            color: '#4caf50',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                return '$' + Highcharts.numberFormat(Math.abs(this.y || 0), 3, '.', ',');
              }
            },
            custom: { type: 'profit' }  // Add custom type for tooltip
          },
          { 
            y: Math.abs(this.totalStats.loss), 
            color: '#ef5350',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                return '$' + Highcharts.numberFormat(Math.abs(this.y || 0), 3, '.', ',');
              }
            },
            custom: { type: 'loss' }  // Add custom type for tooltip
          },
          { 
            y: netPL, 
            color: netPL >= 0 ? '#28a745' : '#dc3545',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                const value = this.y || 0;
                const prefix = value >= 0 ? '+' : '-';
                return prefix + '$' + Highcharts.numberFormat(Math.abs(value), 3, '.', ',');
              }
            },
            custom: { type: 'net' }  // Add custom type for tooltip
          }
        ]
      };
      this.profitLossChartOptions.series = [profitLossSeries];

      // Update Overall Trade Count Chart
      const tradeCountSeries = {
        type: 'column' as const,
        name: 'Trades',
        data: [
          { y: this.totalStats.totalTrades, color: '#5c6bc0' },
          { y: this.totalStats.buyTrades, color: '#4caf50' },
          { y: this.totalStats.sellTrades, color: '#ef5350' }
        ]
      };
      this.tradeCountChartOptions.series = [tradeCountSeries];

      // Update Overall Trade Pie Chart
      const tradePieSeries = {
        type: 'pie' as const,
        name: 'Trades',
        data: [
          {
            name: 'Profitable',
            y: this.totalStats.profitableTrades.length,
            color: '#4caf50'
          },
          {
            name: 'Lossed',
            y: this.totalStats.losedTrades.length,
            color: '#ef5350'
          }
        ]
      };
      this.tradePieChartOptions.series = [tradePieSeries];

      // Update Trading Performance Over Time Chart
      const overallPerformanceData = this.calculatePerformanceData();
      const trendSeries = {
        type: 'area' as const,
        name: 'Net P/L',
        data: overallPerformanceData,
        color: '#28a745'
      };
      this.trendChartOptions.series = [trendSeries];

      // Update Selected Period Charts
      const selectedNetPL = selectedData.profit + selectedData.loss;
      const selectedProfitLossSeries = {
        type: 'column' as const,
        name: 'Trading Results',
        data: [
          { 
            y: Math.abs(selectedData.profit), 
            color: '#4caf50',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                return '$' + Highcharts.numberFormat(Math.abs(this.y || 0), 3, '.', ',');
              }
            },
            custom: { type: 'profit' }
          },
          { 
            y: Math.abs(selectedData.loss), 
            color: '#ef5350',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                return '$' + Highcharts.numberFormat(Math.abs(this.y || 0), 3, '.', ',');
              }
            },
            custom: { type: 'loss' }
          },
          { 
            y: selectedNetPL, 
            color: selectedNetPL >= 0 ? '#28a745' : '#dc3545',
            dataLabels: {
              formatter: function(this: Highcharts.PointLabelObject): string {
                const value = this.y || 0;
                const prefix = value >= 0 ? '+' : '-';
                return prefix + '$' + Highcharts.numberFormat(Math.abs(value), 3, '.', ',');
              }
            },
            custom: { type: 'net' }
          }
        ]
      };
      this.selectedProfitLossChartOptions.series = [selectedProfitLossSeries];

      const selectedTradeCountSeries = {
        type: 'column' as const,
        name: 'Trades',
        data: [
          { y: selectedData.totalTrades, color: '#5c6bc0' },
          { y: selectedData.buyTrades, color: '#4caf50' },
          { y: selectedData.sellTrades, color: '#ef5350' }
        ]
      };
      this.selectedTradeCountChartOptions.series = [selectedTradeCountSeries];

      const selectedTradePieSeries = {
        type: 'pie' as const,
        name: 'Trades',
        data: [
          {
            name: 'Profitable',
            y: selectedData.profitableTrades.length,
            color: '#4caf50'
          },
          {
            name: 'Lossed',
            y: selectedData.losedTrades.length,
            color: '#ef5350'
          }
        ]
      };
      this.selectedTradePieChartOptions.series = [selectedTradePieSeries];

      // Get all trades for the selected period and sort them chronologically
      let allTrades: any[] = [];
      
      console.log('=== Selected Category:', this.selectedDateCategory, '===');
      console.log('Selected Date/Period:', this.selectedDate);
      
      if (this.selectedDateCategory === 'daily') {
        // For daily view, combine profitable and loss trades
        const profitableTrades = selectedData.profitableTrades.map(trade => ({...trade, isProfit: true}));
        const lossTrades = selectedData.losedTrades.map(trade => ({...trade, isProfit: false}));
        allTrades = [...profitableTrades, ...lossTrades];
      } else {
        const selectedRange = this.dateRanges.find(range => range.label === this.selectedDate);
        if (selectedRange) {
          console.log('Date Range:', selectedRange.start, 'to', selectedRange.end);
          const startDate = new Date(selectedRange.start);
          const endDate = new Date(selectedRange.end);
          
          // Collect all trades within the date range
          Object.entries(this.sheetDataGrouped).forEach(([date, data]) => {
            const currentDate = new Date(date);
            if (currentDate >= startDate && currentDate <= endDate) {
              const profitableTrades = data.profitableTrades.map(trade => ({...trade, isProfit: true}));
              const lossTrades = data.losedTrades.map(trade => ({...trade, isProfit: false}));
              allTrades.push(...profitableTrades, ...lossTrades);
            }
          });
        }
      }

      // Sort trades by ID
      allTrades.sort((a, b) => {
        // Extract numeric ID from the ID string (assuming format like "1737...")
        const idA = parseInt(a.ID);
        const idB = parseInt(b.ID);
        return idA - idB;
      });

      console.log('\n=== Trade Sequence ===');
      allTrades.forEach((trade, index) => {
        console.log(`Trade ${index + 1}:`, {
          id: trade.ID,
          date: trade.Date,
          time: trade.Time,
          coin: trade.Coin,
          type: trade.Type,
          pnl: trade.Pnl,
          isProfit: trade.isProfit
        });
      });

      // Update PnL per trade chart
      const pnlPerTradeData = allTrades.map((trade, index) => ({
        y: trade.Pnl,
        coin: trade.Coin,
        index: index,
        color: trade.Pnl >= 0 ? '#28a745' : '#dc3545',
        date: trade.Date,
        time: trade.Time,
        type: trade.Type,
        contracts: trade.Contracts,
        leverage: trade.Leverage,
        openPrice: trade.Open_Price,
        closePrice: trade.Close_Price,
        pnlPercentage: trade.Pnl_Percentage
      }));

      const pnlSeries = this.pnlPerTradeChartOptions.series?.[0] as Highcharts.SeriesColumnOptions;
      if (pnlSeries) {
        pnlSeries.data = pnlPerTradeData;
      }

      const xAxis = this.pnlPerTradeChartOptions.xAxis as Highcharts.XAxisOptions;
      if (xAxis) {
        xAxis.categories = allTrades.map((_, i) => `Trade ${i + 1}`);
      }

      // Update daily performance chart using individual trade PnL
      const dailyPerformanceData = allTrades.map((trade, index) => {
        return {
          y: trade.Pnl,  // Use individual trade PnL instead of cumulative
          coin: trade.Coin,
          index: index,
          color: trade.Pnl >= 0 ? '#28a745' : '#dc3545',
          date: trade.Date,
          time: trade.Time,
          type: trade.Type,
          contracts: trade.Contracts,
          leverage: trade.Leverage,
          openPrice: trade.Open_Price,
          closePrice: trade.Close_Price,
          pnlPercentage: trade.Pnl_Percentage
        };
      });

      console.log('\n=== Performance Data ===');
      dailyPerformanceData.forEach((data, index) => {
        console.log(`Trade ${index + 1}:`, {
          coin: data.coin,
          pnl: data.y
        });
      });

      const performanceSeries = this.dailyPerformanceChartOptions.series?.[0] as Highcharts.SeriesAreaOptions;
      if (performanceSeries) {
        performanceSeries.data = dailyPerformanceData;
      }

      const performanceXAxis = this.dailyPerformanceChartOptions.xAxis as Highcharts.XAxisOptions;
      if (performanceXAxis) {
        performanceXAxis.categories = allTrades.map((_, i) => `Trade ${i + 1}`);
      }
    }

    // Force chart update
    this.updateFlag = true;
    setTimeout(() => {
      this.updateFlag = false;
    }, 0);
  }

  calculatePerformanceData(): [number, number][] {
    if (!this.sheetDataGrouped) return [];

    const sortedDates = Object.keys(this.sheetDataGrouped).sort();
    let cumulativePL = 0;
  
    return sortedDates.map(date => {
      const dayData = this.sheetDataGrouped[date];
      cumulativePL += (dayData.profit + dayData.loss);
      return [new Date(date).getTime(), cumulativePL];
    });
  }

  initializeCharts() {
    // Set up chart update on window resize
    const resizeObserver = new ResizeObserver(() => {
      this.updateFlag = true;
      setTimeout(() => {
        this.updateFlag = false;
      }, 0);
    });
  
    const chartElements = document.querySelectorAll('.chart-wrapper');
    chartElements.forEach(element => resizeObserver.observe(element));
  }
}
