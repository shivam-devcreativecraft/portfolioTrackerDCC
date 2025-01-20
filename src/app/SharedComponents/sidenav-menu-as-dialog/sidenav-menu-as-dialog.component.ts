import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav-menu-as-dialog',
  templateUrl: './sidenav-menu-as-dialog.component.html',
  styleUrls: ['./sidenav-menu-as-dialog.component.scss']
})
export class SidenavMenuAsDialogComponent {



  constructor(
    @Inject(MAT_DIALOG_DATA) public InjectedData: any,

    public dialogRef: MatDialogRef<SidenavMenuAsDialogComponent>,

  ) { 
    // console.log(InjectedData)
  }
  onClose(): void {

    this.dialogRef.close();
  }
}
