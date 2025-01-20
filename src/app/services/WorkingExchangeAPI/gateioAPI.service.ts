import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class GateioAPIService {
  private baseURL = environment.BACKEND_URL;

  constructor(private httpClientRef: HttpClient) { }

  getPriceGate(currencyPair: string): Observable<any> {
    const apiUrl = '/api/gate/price';
    const params = new HttpParams().set('currencyPair', currencyPair);

    if (currencyPair === 'ZBC_USDT') {
      // Return an Observable with a static value for ZBC_USDT
      return of([{
        "currencyPair": "ZBC_USDT",
        "last": "0",
        "lowestAsk": "0",
        "highestBid": "0",
        "changePercentage": "-0",
        "baseVolume": "0",
        "quoteVolume": "0",
        "high24h": "0",
        "low24h": "0"
      }]);
    } else {
      // Call the actual API for other currency pairs
      return this.httpClientRef.get(`${this.baseURL}${apiUrl}`, { params }).pipe(
        catchError((error) => {
          console.error(`Error fetching price for ${currencyPair}:`, error);
          // Return default values when an error occurs
          return of([{
            "currencyPair": currencyPair,
            "last": "0",
            "lowestAsk": "0",
            "highestBid": "0",
            "changePercentage": "0",
            "baseVolume": "0",
            "quoteVolume": "0",
            "high24h": "0",
            "low24h": "0"
          }]);
        })
      );
    }
  }

  getListSpotAccounts(): Observable<any> {
    const apiUrl = '/api/gate/account';
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`);
  }
}
