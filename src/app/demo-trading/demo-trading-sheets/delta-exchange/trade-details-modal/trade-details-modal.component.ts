import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-trade-details-modal',
  templateUrl: './trade-details-modal.component.html',
  styleUrls: ['./trade-details-modal.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatButtonModule]
})
export class TradeDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<TradeDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    // Initialize with default empty values if data is undefined
    this.data = this.data || {};
    console.log('Modal Data:', this.data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
