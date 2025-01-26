import { Component, Inject, NgModule } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterControlService } from 'src/app/services/master-control.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-master-control',
  templateUrl: './master-control.component.html',
  styleUrls: ['./master-control.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DragDropModule
  ]
})
export class MasterControlComponent {
  hide = true;
  isLoading = false;
  formType = 'MasterPassword_Get';
  masterPassword: string = '';
  masterPassword_Existing: string = '';
  masterPassword_New: string = '';
  masterPassword_Verify: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MasterControlComponent>,
    private toastr: ToastrService,
    private masterControlService: MasterControlService
  ) {}

  onClose(): void {
    this.dialogRef.close(false);
  }

  async onSubmit() {
    if (!this.masterPassword) return;
    
    this.isLoading = true;
    try {
      const result = await this.masterControlService.verifyMasterPassword(this.masterPassword);
      if (result.success) {
        this.toastr.success(result.message);
        this.dialogRef.close(true);
      } else {
        this.toastr.error(result.message);
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to verify master password');
    } finally {
      this.isLoading = false;
    }
  }

  forgotMasterPassword(type: string) {
    this.toastr.warning("currently unavailabe !");
  }

  alreadyHavePassword(type: string) {
    this.toastr.warning("currently unavailabe !");
  }
}
