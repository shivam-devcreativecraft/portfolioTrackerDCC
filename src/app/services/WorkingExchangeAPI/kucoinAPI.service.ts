import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class KucoinAPIService {
  private baseURL=environment.BACKEND_URL;
  constructor(private httpClientRef: HttpClient) { }



  getPriceKucoin(symbol:string): Observable<any> {
    
    // const symbol='BTC-USDT'
    const apiUrl = '/api/kucoin/price'; // Update the endpoint
    const params = new HttpParams().set('symbol', symbol);
  
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`, { params });
  
  }
  getKucoinWSAccessToken() {
    const apiUrl  ='/api/kucoin/access-token';
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`);
  }


  getAssetDetailsKucoin(): Observable<any> {
    
    // const symbol='BTC-USDT'
    const apiUrl = '/api/kucoin/account'; // Update the endpoint
    // const params = new HttpParams().set('symbol', symbol);
  
    return this.httpClientRef.get(`${this.baseURL}${apiUrl}`);
  
  }



}
