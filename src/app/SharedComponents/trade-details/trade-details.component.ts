import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-trade-details',
  templateUrl: './trade-details.component.html',
  styleUrls: ['./trade-details.component.scss']
})
export class TradeDetailsComponent {
  constructor (
    @Inject(MAT_DIALOG_DATA) public tradeData: any,
    public dialogRef :  MatDialogRef<TradeDetailsComponent>) {
      // console.log(tradeData)
    }

  onClose(): void {
    this.dialogRef.close();
  }

}
