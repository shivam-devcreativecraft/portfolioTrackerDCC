import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MasterControlService } from 'src/app/services/master-control.service';
import { MasterControlComponent } from '../master-control/master-control.component';

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
  imports: [
    FormsModule, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule, 
    DragDropModule,
    MatTooltipModule
  ]
})
export class TradeDetailsModalComponent implements OnInit, AfterViewInit {
  @ViewChild('dialogContent') dialogContent?: ElementRef;
  isActionsAllowed: boolean = true;
  IsMasterControlEnabled: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TradeDetailsModalComponent>,
    private firebaseService: FirebaseDataService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private masterControlService: MasterControlService
  ) {
    this.data = this.data || {};
    console.log(this.data)

    // Ensure dialog opens at top
    this.dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        const dialogContainer = document.querySelector('.mat-dialog-content');
        if (dialogContainer) {
          dialogContainer.scrollTop = 0;
        }
      });
    });
  }

  ngOnInit() {
    // Subscribe to guest user state
    this.masterControlService.getGuestUserState().subscribe(isGuest => {
      this.isActionsAllowed = !isGuest;
    });

    // Subscribe to master control state
    this.masterControlService.getMasterControlState().subscribe(state => {
      this.IsMasterControlEnabled = state;
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private openMasterControlDialog(): Promise<boolean> {
    return new Promise((resolve) => {
      const dialogRef = this.dialog.open(MasterControlComponent, {
        width: '400px',
        data: { location: 'trade-details' }
      });

      dialogRef.afterClosed().subscribe(result => {
        resolve(result === true);
      });
    });
  }

  async deleteTrade(tradeId: string) {
    if (!this.isActionsAllowed && !this.IsMasterControlEnabled) {
      // Open master control dialog only if not enabled
      const isVerified = await this.openMasterControlDialog();
      if (!isVerified) {
        return;
      }
    }

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
          await this.firebaseService.deleteTrade(this.data.sheetName, tradeId);
          this.notificationService.success(`Trade deleted successfully from ${this.data.sheetName}`);
          this.dialogRef.close('deleted'); // Close the trade details modal with 'deleted' result
        } catch (error: any) {
          console.error('Error deleting trade:', error);
          this.notificationService.error(error.message || 'Error deleting trade');
        }
      }
    });
  }

  async updateTrade() {
    if (!this.isActionsAllowed && !this.IsMasterControlEnabled) {
      // Open master control dialog only if not enabled
      const isVerified = await this.openMasterControlDialog();
      if (!isVerified) {
        return;
      }
    }
    // Implement update logic here
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const dialogContainer = document.querySelector('.mat-dialog-content');
      if (dialogContainer) {
        dialogContainer.scrollTop = 0;
      }
    });
  }
}