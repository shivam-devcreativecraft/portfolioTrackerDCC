import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-details-modal',
  templateUrl: './exchange-details-modal.component.html',
  styleUrls: ['./exchange-details-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule
  ]
})
export class ExchangeDetailsModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExchangeDetailsModalComponent>
  ) {
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 