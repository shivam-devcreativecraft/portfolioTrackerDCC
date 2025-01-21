import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-trade-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Upload</h2>
    <mat-dialog-content>
      <div class="confirmation-content">
        <h3>The following data will be uploaded:</h3>
        <div class="data-preview">
          <p><strong>ID:</strong> {{data.ID}}</p>
          <p><strong>Date:</strong> {{data.Date}}</p>
          <p><strong>Coin:</strong> {{data.Coin}}</p>
          <p><strong>Type:</strong> {{data.Type}}</p>
          <p><strong>Quantity:</strong> {{data.Quantity}}</p>
          <p><strong>Open Price:</strong> {{data.Open_Price}}</p>
          <p><strong>Open Margin:</strong> {{data.Open_Margin}}</p>
          <p><strong>Close Price:</strong> {{data.Close_Price}}</p>
          <p><strong>Close Margin:</strong> {{data.Close_Margin}}</p>
          <p><strong>PNL:</strong> {{data.Pnl}}</p>
          <p><strong>PNL %:</strong> {{data.Pnl_Percentage}}%</p>
          <p><strong>Influencer:</strong> {{data.Influencer}}</p>
          <p><strong>Sheet Name:</strong> {{data.Sheet_Name}}</p>
          <p><strong>Exchange Name:</strong> {{data.Exchange_Name}}</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="true" color="primary">Confirm Upload</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirmation-content {
      max-height: 400px;
      overflow-y: auto;
      padding: 10px;
    }
    .data-preview {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
    }
    .data-preview p {
      margin: 5px 0;
    }
  `],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule]
})
export class TradeConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'app-trade-details-modal',
  templateUrl: './trade-details-modal.component.html',
  styleUrls: ['./trade-details-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule, MatDialogModule]
})
export class TradeDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TradeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseService: FirebaseDataService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) { 
    this.data = this.data || {};
    console.log('Modal Data:', this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  async uploadToFirebase(): Promise<void> {
    try {
      // Calculate Quantity (Contracts * Lot_Value)
      const quantity = Number(this.data.trade.Contracts) * Number(this.data.trade.Lot_Value);

      // Create trade data using the original values from clicked trade
      const tradeData = {
        ID: String(this.data.trade.ID),
        Sheet_Name: 'Futures_Trades',
        Date: this.data.trade.Date || '',
        Coin: String(this.data.trade.Coin || '').toUpperCase(),
        Type: String(this.data.trade.Type || '').toUpperCase(),
        Quantity: quantity,  // Using calculated quantity instead of Contracts
        Open_Price: Number(Number(this.data.trade.Open_Price).toString().match(/^-?\d*\.?\d{0,8}/)?.[0] || this.data.trade.Open_Price) || 0,
        Open_Margin: Number(this.data.trade.Open_Margin) || 0,
        Close_Price: Number(Number(this.data.trade.Close_Price).toString().match(/^-?\d*\.?\d{0,8}/)?.[0] || this.data.trade.Close_Price) || 0,
        Close_Margin: Number(this.data.trade.Close_Margin) || 0,
        Pnl: Number(this.data.trade.Pnl) || 0,
        Pnl_Percentage: Number(this.data.trade.Pnl_Percentage) || 0,
        Influencer: String(this.data.trade.Influencer || '').toUpperCase(),
        Exchange_Name: 'Delta_Exchange',
        Leverage: Number(this.data.trade.Leverage) || 0,
        Lot_Value: Number(this.data.trade.Lot_Value) || 0
      };

      // Open confirmation dialog
      const dialogRef = this.dialog.open(TradeConfirmationDialogComponent, {
        width: '500px',
        data: tradeData
      });

      // Wait for user confirmation
      const result = await dialogRef.afterClosed().toPromise();
      
      if (result) {
        console.log('Uploading trade data:', tradeData);
        await this.firebaseService.uploadTradeData(tradeData);
        this.notificationService.success('Trade data uploaded to Firebase successfully');
        this.dialogRef.close();
      }
    } catch (error: any) {
      console.error('Error uploading trade data:', error);
      this.notificationService.error(error.message || 'Failed to upload trade data to Firebase');
    }
  }
}