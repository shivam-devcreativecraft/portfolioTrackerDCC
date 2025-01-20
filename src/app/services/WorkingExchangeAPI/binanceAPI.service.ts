

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class BinanceAPIService {
  private baseURL = environment.BACKEND_URL;

  private URL_Binance = 'https://api.binance.com/api/v3/ticker/price?';

  constructor(private httpClientRef: HttpClient) { }

  getPrices([tickers]: any[]) {
    return this.httpClientRef.get(this.URL_Binance + 'symbols=' + '[' + tickers + ']');
  }
  getPrice(ticker: string) {
    return this.httpClientRef.get(this.URL_Binance + 'symbol=' + ticker + 'USDT').pipe(
      catchError((error) => {
        console.error(`Error fetching price for ${ticker}:`, error);
        return of({ price: 0 }); // Return an observable with price set to 0 in case of error
      })
    );
  }
  getAssettDetails() {
    const apiUrl = '/api/binance/account';
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`);

  }

  getOpenOrders() {
    const apiUrl = '/api/binance/openOrders';
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`);

  }

}
