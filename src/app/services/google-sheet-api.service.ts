import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GoogleSheetApiService {
  constructor(private httpClientRef: HttpClient) { }


// private selectedSheetNameSubject = new BehaviorSubject<string>('');
// selectedSheetName$ = this.selectedSheetNameSubject.asObservable();



  // ------------------------------- SheetName Obervables -------------------------------
  // private selectedSheetNameBybitSubject = new BehaviorSubject<string>('');
  // selectedSheetNameBybit$ = this.selectedSheetNameBybitSubject.asObservable();

  // private selectedSheetNameBinanceSubject = new BehaviorSubject<string>('');
  // selectedSheetNameBinance$ =
  //   this.selectedSheetNameBinanceSubject.asObservable();

  // private selectedSheetNameMexcSubject = new BehaviorSubject<string>('');
  // selectedSheetNameMexc$ = this.selectedSheetNameMexcSubject.asObservable();


  // private selectedSheetNameKucoinSubject = new BehaviorSubject<string>('');
  // selectedSheetNameKucoin$ = this.selectedSheetNameKucoinSubject.asObservable();


  // private selectedSheetNameGateSubject = new BehaviorSubject<string>('');
  // selectedSheetNameGate$ = this.selectedSheetNameGateSubject.asObservable();



  // private selectedSheetNameExnessSubject = new BehaviorSubject<string>('');
  // selectedSheetNameExness$ = this.selectedSheetNameExnessSubject.asObservable();

  // private selectedSheetNameFreebitcoSubject = new BehaviorSubject<string>('');
  // selectedSheetNameFreebitco$ =
  //   this.selectedSheetNameFreebitcoSubject.asObservable();

  // private selectedSheetNameActForexSubject = new BehaviorSubject<string>('');
  // selectedSheetNameActForex$ =
  //   this.selectedSheetNameActForexSubject.asObservable();

  // private selectedSheetNameActFuturesSubject = new BehaviorSubject<string>('');
  // selectedSheetNameActFutures$ =
  //   this.selectedSheetNameActFuturesSubject.asObservable();

  // private selectedSheetNameDeltaSubject = new BehaviorSubject<string>('');
  // selectedSheetNameDelta$ = this.selectedSheetNameDeltaSubject.asObservable();




  // private selectedOpenOrdersAIOExchangeNameSubject = new BehaviorSubject<string>('');
  // selectedOpenOrdersAIOExchangeName$ = this.selectedOpenOrdersAIOExchangeNameSubject.asObservable();



  // ------------------------------- Setting SheetName Observables portfolio-sheets -------------------------------
  // setSheetName(sheetName: string) {
  //   this.selectedSheetNameSubject.next(sheetName);
  // }



  // setBybitSheetName(sheetName: string) {
  //   this.selectedSheetNameBybitSubject.next(sheetName);
  // }
  // setBinanceSheetName(sheetName: string) {
  //   this.selectedSheetNameBinanceSubject.next(sheetName);
  // }

  // setMexcSheetName(sheetName: string) {
  //   this.selectedSheetNameMexcSubject.next(sheetName);
  // }
  // setKucoinSheetName(sheetName: string) {
  //   this.selectedSheetNameKucoinSubject.next(sheetName);
  // }
  // setGateSheetName(sheetName: string) {
  //   this.selectedSheetNameGateSubject.next(sheetName);
  // }

  // setExnessSheetName(sheetName: string) {
  //   this.selectedSheetNameExnessSubject.next(sheetName);
  // }


  // setFreebitcoSheetName(sheetName: string) {
  //   this.selectedSheetNameFreebitcoSubject.next(sheetName);
  // }

  // setActForexSheetName(sheetName: string) {
  //   this.selectedSheetNameActForexSubject.next(sheetName);
  // }

  // setActFuturesSheetName(sheetName: string) {
  //   this.selectedSheetNameActFuturesSubject.next(sheetName);
  // }
  // setDeltaSheetName(sheetName: string) {
  //   this.selectedSheetNameDeltaSubject.next(sheetName);
  // }




  // setOpenOrdersAIOExchangeName(sheetName: string) {
  //   this.selectedOpenOrdersAIOExchangeNameSubject.next(sheetName);
  // }

  // ----------------------------get master control observable------------

  private checkMasterControlSubject = new BehaviorSubject<boolean>(false);
  checkMasterControlSubject$ = this.checkMasterControlSubject.asObservable();


  checkMasterControl(IsEnabled: boolean) {
    this.checkMasterControlSubject.next(IsEnabled);
  }



  // ------------------------------- GET POST Urls -------------------------------

  private baseURL_AIO_Sheets_GET =
    'https://script.google.com/macros/s/AKfycbxbrIwAlksNbF6fg-xPs0CyQIb9q1egyXuZb2A8K_nenRmz_9LvtCLXqRFjHm-taQr6rg/exec?';

    private baseURL_AIO_Sheets_All_Sheets_GET ='https://script.google.com/macros/s/AKfycbyDySzjh2hH6bjEyG7NZN40V-oMmbzYPdWqgGoD9Ey55K4HLyVOT69kH1QTmuxjmr3O/exec?';


  private baseURL_AIO_Sheets_POST =
    'https://script.google.com/macros/s/AKfycbzfv6w1Ri7GDwbH-Dt6wqyXpWMDrvFi8n7_7c7lIGm7DA_w1yPRCasSwkkgiPw5P9mJJQ/exec';
  private baseURL_CRUD_Sheet_POST = 'https://script.google.com/macros/s/AKfycbx57VHFoFrFpQc3P7u-RNS4KN0lSSrO31k4TLeiPqib0O1v53bny4N4-bhWqYaQcZQ/exec';

  private baseURL_MasterControl_Post = 'https://script.google.com/macros/s/AKfycbxadg1Jly-jFe-qGdGSL3o5ZZHVi7ZikIaXD3ejzNTBCfjBK-FTwk44yFGK8EGAs31c/exec'

  private baseURL_SeachCoin_GET = 'https://script.google.com/macros/s/AKfycbyCDrIcFhGxIC8YWcFC2sgOo4vgwHssG3cTM7Dcr2VOpPLPGX3Z2BWRA9-6sPr6LNIQ/exec?'
  // private baseURL_STATS_GET =
  //   'https://script.google.com/macros/s/AKfycbySJ92MXmPsuV7g1ql-A6GZvdIaQKwY3g7OYbILxCXrQsqBHQnpQwORLXfPRIa98puF/exec?'; //this is not used 
  private baseURL_SingleSheet_AIO_Exchanges_GET =
    'https://script.google.com/macros/s/AKfycbxeYgmtnl8MPrfqJl-GKY-0k03m1tK5T6zGA82NmYOiJS2Alw4Tky621laiBob4CD70sg/exec?'; //for stats/exchangeData component
  // ------------------------------- GET Methods portfolio-sheets -------------------------------
  getAIOSheetsData(
    ExchangeName: string,
    SheetName: string,
    Items_Per_Page: number,
    Page: number
  ) {
    return this.httpClientRef.get(
      this.baseURL_AIO_Sheets_GET +
      'ExchangeName=' +
      ExchangeName +
      '&SheetName=' +
      SheetName +
      '&Items_Per_Page=' +
      Items_Per_Page +
      '&Page=' +
      Page
    );
  }



  // ------------------------------- GET Methods watchlist-sheets -------------------------------
  getAIOSheetsData_AllSheets(
    ExchangeName: string

  ) {
    return this.httpClientRef.get(
      this.baseURL_AIO_Sheets_All_Sheets_GET +
      'ExchangeName=' +
      ExchangeName
    );
  }

  // ------------------------------- GET Methods portfolio-dashboard -------------------------------
  


  getBybitAllDataPD() {
    return this.httpClientRef.get(
      'https://script.google.com/macros/s/AKfycbxHD_hyYc8K_SyPnIuGqaYgNKLhr3xpi3lwp5UOae2vEJYP2v-qKKu33qLn9Tvo3FZQ3w/exec'
    );
  }
  getMexcAllDataPD() {
    return this.httpClientRef.get(
      'https://script.google.com/macros/s/AKfycbwTJKiJBwZbfnkhqgewpWQIqmWpy8NWlqwSIfZb0oheicN1BWbKxfQv-ZAuj8VsKPC3/exec'
    );
  }
  getBinanceAllDataPD() {
    return this.httpClientRef.get(
      'https://script.google.com/macros/s/AKfycbwK2SITLxfBrQzfVgSS9Up-w89FOqfa-OmJgxMHpeDbyaCRwzrz2ivOjgVhOtgHWvoN/exec'
    );
  }

  // ------------------------------- Adding Records Methods portfolio-sheets -------------------------------
  //#region Adding Records

  async addNewEntry_AIO(formData: FormData): Promise<any> {
    // Append ExchangeName to the FormData or create a new FormData if needed

    const masterControl_Token = localStorage.getItem('masterControlToken');
    if (masterControl_Token) {
      formData.append('token', masterControl_Token)
    }

    return fetch(this.baseURL_AIO_Sheets_POST, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  //#endregion
  // ------------------------------- Deleting Records Methods portfolio-sheets -------------------------------
  async delete(formData: FormData, ExchangeName: string): Promise<any> {
    formData.append('ExchangeName', ExchangeName);
    const masterControl_Token = localStorage.getItem('masterControlToken');
    if (masterControl_Token) {
      formData.append('token', masterControl_Token)
    }
    return fetch(this.baseURL_AIO_Sheets_POST, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  // ------------------------------- Editing Records Methods portfolio-sheets -------------------------------

  async edit(formData: FormData): Promise<any> {
    const masterControl_Token = localStorage.getItem('masterControlToken');
    if (masterControl_Token) {
      formData.append('token', masterControl_Token)
    }
    return fetch(
      this.baseURL_AIO_Sheets_POST,

      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {

        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }







  //#region  masterControl







  async getMasterControlAccess(formData: FormData, componentRef: any,): Promise<any> {



    return fetch(
      this.baseURL_MasterControl_Post,

      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {

        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });




  }



  //#endregion

























  //#region  Search SIP Coin

  getColumnData(
    ExchangeName: string,
    SheetName: string,
    ColumnNames: string[]
  ) {
    let url: string =
      'https://script.google.com/macros/s/AKfycbwuETOGLYExGahqrJ9Hpz7EgCNvAwUUjMGjR9U4B237u7CFj8n06lnl1lEgxOG24BaWAg/exec?';
    // Convert the array of column names to a JSON string
    let columnsParam = JSON.stringify(ColumnNames);
    return this.httpClientRef.get(
      url +
      `ExchangeName=${ExchangeName}&SheetName=${SheetName}&Columns=${columnsParam}`
    );
  }

  searchCoin(sheetName: string, columnName: string, coinName: string) {

    return this.httpClientRef.get(
      this.baseURL_SeachCoin_GET +
      `sheetName=${sheetName}&columnName=${columnName}&coinName=${coinName}`
    );
  }

  // getExchangeData(
  //   sheetName?: string,
  //   marketColumnName?: string,
  //   directionColumnName?: string,
  //   quantityColumnName?: string
  // ) {
  //   console.log("exchange data alled ")
  //   return this.httpClientRef.get(
  //     this.baseURL_STATS_GET +
  //       `sheetName=${sheetName || ''}&marketColumnName=${
  //         marketColumnName || ''
  //       }&directionColumnName=${directionColumnName || ''}&quantityColumnName=${
  //         quantityColumnName || ''
  //       }`
  //   );
  // }

  getSingleSheetDataAIOExchanges(
    ExchangeName: string,
    SheetName: string,
    Items_Per_Page: number,
    Page: number
  ) {
    return this.httpClientRef.get(
      this.baseURL_SingleSheet_AIO_Exchanges_GET +
      'ExchangeName=' +
      ExchangeName +
      '&SheetName=' +
      SheetName +
      '&Items_Per_Page=' +
      Items_Per_Page +
      '&Page=' +
      Page
    );
  }

  //#endregion


  //#region Sheet Action
  // performSheetAction(
  //   action: string,
  //   sheetName: string, 
  //   newName?: string
  // ) {
  //   const body = { action, sheetName, newName };
  //   return this.httpClientRef.post(this.scriptUrl, body, { responseType: 'text' });
  // }
  //#endregion





  //   action: string,
  //   sheetName: string, 
  //   newName?: string
  async performSheetAction(formData: FormData,): Promise<any> {



    return fetch(
      this.baseURL_CRUD_Sheet_POST,

      {
        method: 'POST',
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {

        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });




  }
















}
