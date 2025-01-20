import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';
@Component({
  selector: 'app-tracker-act-futures',
  templateUrl: './tracker-act-futures.component.html',
  styleUrls: ['./tracker-act-futures.component.scss'],
})
export class TrackerActFuturesComponent {
  selectedSheetName: string = 'Real_Account';
  // <!-- -----------------------STARTS floating sheet button --------------------------- -->
  public openMenu: boolean = false;
  isOver = false;
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private router: Router
  ) {
    this.googleSheetAPIServiceRef.setSheetName('Real_Account');
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
        this.selectedSheetName = sheetName;
      }
    );
    this.router.navigate([
      'tracker',
      'tracker-act-futures',
      'act_futures-real',
    ]);
  }
  clickMenu() {
    this.openMenu = !this.openMenu;
  }

  async onSheetSelect(sheetName: string) {
    this.googleSheetAPIServiceRef.setSheetName(sheetName);

    switch (sheetName) {
      case 'Real_Account':
        // this.googleSheetApiRef.selectedSheetNameMexc='SIP'
        this.router.navigate([
          'tracker',
          'tracker-act-futures',
          'act_futures-real',
        ]);
        this.openMenu = false;

        break;
      case 'Demo_Account':
        // this.googleSheetApiRef.selectedSheetNameMexc='P2P'

        this.router.navigate([
          'tracker',
          'tracker-act-futures',
          'act_futures-demo',
        ]);
        this.openMenu = false;
        break;
    }
  }
}
