import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FunctionsService } from 'src/app/SharedFunctions/functions.service';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-master-control',
  templateUrl: './master-control.component.html',
  styleUrls: ['./master-control.component.scss']
})
export class MasterControlComponent {
  
  hide = true;


  isMasterControlSubmitted: boolean = false;
  isMasterControlVerified: boolean = true;
  formType = 'MasterPassword_Get';
  public masterPassword: string = '';
  public masterPassword_Existing: string = '';
  public masterPassword_New: string = '';
  public masterPassword_Verify: string = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) public InjectedLocation: any,

    public dialogRef: MatDialogRef<MasterControlComponent>,
    private googleSheetAPIServiceRef: GoogleSheetApiService, // Inject DatePipe
    private toastr: ToastrService


  ) { 

  }



  onClose(): void {
    this.dialogRef.close(false);




  }

  onSubmit() {
    this.isMasterControlSubmitted = true;

    const formData = new FormData();
    formData.append('action', 'getMasterControlToken');
    formData.append('masterPassword', this.masterPassword);

    this.googleSheetAPIServiceRef.getMasterControlAccess(formData, this)
      .then((response) => {

        if (response.error) {
          this.toastr.warning(response.error, 'Failed !');
          this.isMasterControlVerified = false;
          this.googleSheetAPIServiceRef.checkMasterControl(false)
        }
        else {

          this.toastr.success(response.message, 'Master Control Enabled !');
          localStorage.setItem('masterControlToken', response.token);
          this.isMasterControlVerified = true;
          this.googleSheetAPIServiceRef.checkMasterControl(true)
          this.dialogRef.close(true)



        }



      })
      .catch((error) => {
        // Handle error or cancellation here
        this.toastr.warning(error, 'Failed !');


      })
      .finally(() => {
        // this.isNewEntrySubmitted = false;
        this.isMasterControlSubmitted = false;

      });

  }


  forgotMasterPassword(type: string) {
    // this.formType = 'MasterPassword_Forgot'
    this.toastr.warning("currently unavailabe !");
  }
  alreadyHavePassword(type: string) {
    // this.formType = 'MasterPassword_Get'
    this.toastr.warning("currently unavailabe !");

  }


}
