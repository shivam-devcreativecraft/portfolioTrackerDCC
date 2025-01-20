import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Component({
  selector: 'app-tracker-act-forex',
  templateUrl: './tracker-act-forex.component.html',
  styleUrls: ['./tracker-act-forex.component.scss'],
})
export class TrackerActForexComponent {
  selectedSheetName: string = '';
  // <!-- -----------------------STARTS floating sheet button --------------------------- -->
  public openMenu: boolean = false;
  isOver = false;
  constructor(
    private googleSheetAPIServiceRef: GoogleSheetApiService,
    private router: Router
  ) {
    this.googleSheetAPIServiceRef.setSheetName('Demo_Account');
    this.googleSheetAPIServiceRef.selectedSheetName$.subscribe(
      (sheetName) => {
        this.selectedSheetName = sheetName;
      }
    );
    this.router.navigate([
      'tracker',
      'tracker-act-forex',
      'act_forex-demo',
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
          'tracker-act-forex',
          'act_forex-real',
        ]);
        this.openMenu = false;

        break;
      case 'Demo_Account':
        // this.googleSheetApiRef.selectedSheetNameMexc='P2P'

        this.router.navigate([
          'tracker',
          'tracker-act-forex',
          'act_forex-demo',
        ]);
        this.openMenu = false;
        break;
    }
  }
}
