import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }


  bybitSheetData: BehaviorSubject<{ Data: any, IsDataPresent: boolean }> = new BehaviorSubject<{ Data: any, IsDataPresent: boolean }>({
    Data: null,
    IsDataPresent: false
  });

  binanceSheetData: BehaviorSubject<{ Data: any, IsDataPresent: boolean }> = new BehaviorSubject<{ Data: any, IsDataPresent: boolean }>({
    Data: null,
    IsDataPresent: false
  });

  mexcSheetData: BehaviorSubject<{ Data: any, IsDataPresent: boolean }> = new BehaviorSubject<{ Data: any, IsDataPresent: boolean }>({
    Data: null,
    IsDataPresent: false
  });



  // -----------------------------------new orders------STARTS---



  private orderHistoryRealtime_NotSaved: any[] = [];
  private setNewOrderSubject = new BehaviorSubject<any[]>([]);
  setNewOrderSubject$ = this.setNewOrderSubject.asObservable();

  updateOrderHistory(newOrders: any[]) {
    this.orderHistoryRealtime_NotSaved = (newOrders[0])
    this.setNewOrderSubject.next(this.orderHistoryRealtime_NotSaved);

    // console.log('UpdateORderHistory (data service) : ', this.orderHistoryRealtime_NotSaved, typeof(this.orderHistoryRealtime_NotSaved))
  }

  getOrderHistory(): any[] {
    // console.log('this.getOrderHistory (called from sideNav) : ', this.orderHistoryRealtime_NotSaved)
    return this.orderHistoryRealtime_NotSaved;
  }


  // --------------------------------------new orders ------ENDS-------

  // -------------------------new orders ngDestroy detection -------------------STARTS
  private destroyObservable = new Subject<any>();

  sendDestroyObservable(flag: boolean) {
    this.destroyObservable.next(flag);
  }

  getDestroyObservable() {
    return this.destroyObservable.asObservable();
  }
  // -------------------------new orders ngDestroy detection -------------------ENDS


  // --------------------------new odrders all upladed detection-------------STARTS
  private allNewOrdersUploadedObservable = new Subject<any>();

  sendAllNewOrdersUploadedObservable(flag: boolean) {
    this.allNewOrdersUploadedObservable.next(flag);
  }

  getAllNewOrdersUploadedObservable() {
    return this.allNewOrdersUploadedObservable.asObservable();
  }
  // --------------------------new odrders all upladed detection-------------ENDS




  //#region Contract value of mexc 

  getStaticSymbolContractValue(volParam: any, symbolParam: any): number {
    const symbol = symbolParam.replace('_USDT', '');
    const closeVol = volParam;

    switch (symbol) {
      case 'BTC':
        return closeVol * 0.0001;
      case 'ETH':
        return closeVol * 0.01;
      case 'PEPE':
        return closeVol * 10000000;
      case 'BAKE':
        return closeVol * 10;
      case 'WIF':
        return closeVol * 10;
      case 'FUN':
        return closeVol * 1000;
      case 'LEVER':
        return closeVol * 1000;
      case 'KAS':
        return closeVol * 1000;
      case 'TURBO':
        return closeVol * 10000;
      case 'PEOPLE':
        return closeVol * 10;
      case 'XAI':
        return closeVol * 10;
      case 'MNT':
        return closeVol * 10;
      case 'FUN':
        return closeVol * 1000;
      case 'OM':
        return closeVol * 10;
      case 'SOL':
        return closeVol * 0.1
      case 'TON':
        return closeVol * 1

      case 'NEAR':
        return closeVol * 1;

      case 'MANA':
        return closeVol * 1
      case 'GRT':
        return closeVol * 1
      case 'MANA':
        return closeVol * 1
      case 'CATI':
        return closeVol * 10
      case 'SUNDOG':
        return closeVol * 100
      case 'APT':
        return closeVol * 0.1
      case 'VANRY':
        return closeVol * 10
      case 'AVAX':
        return closeVol * 0.1
      case 'CARV':
        return closeVol * 10
      case 'TRX':
        return closeVol * 10
      case 'ORDI':
        return closeVol * 0.1
      case 'UNI':
        return closeVol * 0.1
      case 'DOGE':
        return closeVol * 100
      case 'SUSHI':
        return closeVol * 0.1;
      case 'XLM':
        return closeVol * 10;
      case 'TEVA':
        return closeVol * 100;
        case 'TRUMP':
          return closeVol * 0.1
      default:
        return closeVol;
    }
  }



  //#endregion



  //#region  SearchTerm while navigaring from search dialog 

  private searchTermSource = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSource.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSource.next(term);
  }


  //#endregion

  public influencersList: string[] = [
    'Act_Official',
    'Act_Scmr',
    'Star_Bets',
    'Wolf_Of_Crypto',
    'Trade_With_Ash',
    'Me',
    'Wise_Advice',
    'Pushpendra',
    'Gold_VIP',
    'Crypto_Money_Mantra',
    'The_Trade_Room'
  ]


}
