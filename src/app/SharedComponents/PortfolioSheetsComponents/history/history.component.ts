import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],

})
export class HistoryComponent {

  IsSelectedSheetDataLoaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public tradingPairDataInjected: any,
    
    public dialogRef: MatDialogRef<HistoryComponent>
  ) {

    if (tradingPairDataInjected) {
      // console.log("Injected Data : ", tradingPairDataInjected)
      this.IsSelectedSheetDataLoaded = true;
    }

  }

// ---------------testing Timer -------------STARTS
getBoughtTime(tradeDate: string): string {
  const currentDate = new Date();
  const tradeDateObj = new Date(tradeDate);
  const diffInMs = Math.abs(currentDate.getTime() - tradeDateObj.getTime());

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  const boughtTime = `${days} D | ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  
  
  return boughtTime;
  
}




// ---------------testing Timer -------------ENDS

  onClose(): void {
    this.dialogRef.close();
  }
}
