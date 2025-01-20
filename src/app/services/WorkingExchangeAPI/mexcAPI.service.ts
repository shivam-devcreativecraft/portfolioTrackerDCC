import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class MexcAPIService {
  private baseURL = environment.BACKEND_URL;
  private MEXC_apiUrl = '/api/mexc'

  constructor(private httpClientRef: HttpClient) { }





  // --------------generating params ---------------------STARTS----

  // private getHeaders(): HttpHeaders {
  //   return new HttpHeaders({
  //     'X-MEXC-APIKEY': environment.MEXC_API_KEY,
  //     'Content-Type': 'application/json',
  //   });
  // }

  // private getTimestamp(): number {
  //   return Date.now();
  // }


  // private generateSignature(totalParams: string): string {
  //   const secretKey = environment.MEXC_SECRETE;
  //   const signature = CryptoJS.HmacSHA256(totalParams, secretKey).toString(CryptoJS.enc.Hex);
  //   return signature;
  // }

  // private buildTotalParams(params: HttpParams): string {
  //   const paramsString = params.toString();
  //   // You may need to sort the parameters alphabetically if required by the API
  //   return paramsString;
  // }




  // --------------generating params ---------------------ENDS----

  // getAccountDetails(): Observable<any> { //working
  //   const timestamp = this.getTimestamp();
  //   const recvWindow = 500000;
  //   const params = new HttpParams()
  //     .set('timestamp', timestamp.toString())
  //     .set('recvWindow', recvWindow.toString());

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/account`, { headers, params: signedParams });
  // }
  // //#region currency info
  // getCurrencyInformation(): Observable<any> { //Working
  //   const timestamp = this.getTimestamp();
  //   const recvWindow = 5000;
  //   const params = new HttpParams()
  //     .set('timestamp', timestamp.toString())
  //     .set('recvWindow', recvWindow.toString());

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/capital/config/getall`, { headers, params: signedParams });
  // }
  // getAllOrders(startTime?: number, endTime?: number, limit?: number): Observable<any> { //WORKING BUT RESPONSE NULL
  //   const symbol = "ETHUSDT"
  //   const timestamp = this.getTimestamp();
  //   const params = new HttpParams()
  //     .set('symbol', symbol)
  //     .set('timestamp', timestamp.toString())  // Include the timestamp

  //   // .set('limit', limit ? limit.toString() : '500');  // Default to 500 if not provided

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/allOrders`, { headers, params: signedParams });
  // }

  // getCurrentOpenOrders(): Observable<any> { //Working
  //   const symbol = "ETHUSDT"

  //   const timestamp = this.getTimestamp();
  //   const params = new HttpParams()
  //     .set('symbol', symbol)
  //     .set('timestamp', timestamp.toString());  // Include the timestamp

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/openOrders`, { headers, params: signedParams });
  // }
  // getAccountTradeList(orderId?: string, startTime?: number, endTime?: number, limit?: number): Observable<any> { //WORKING BUT RESPONSE NULL
  //   const symbol = "ETHUSDT"

  //   const timestamp = this.getTimestamp();
  //   const params = new HttpParams()
  //     .set('symbol', symbol)
  //     .set('timestamp', timestamp.toString())  // Include the timestamp
  //     .set('orderId', orderId ? orderId : '')
  //     .set('startTime', startTime ? startTime.toString() : '')
  //     .set('endTime', endTime ? endTime.toString() : '')
  //     .set('limit', limit ? limit.toString() : '500');  // Default to 500 if not provided

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/myTrades`, { headers, params: signedParams });
  // }

  // queryOrder(orderId?: string, origClientOrderId?: string): Observable<any> { //WORKING
  //   const symbol = "ETHUSDT"

  //   const timestamp = this.getTimestamp();
  //   const params = new HttpParams()
  //     .set('symbol', symbol)
  //     .set('timestamp', timestamp.toString())  // Include the timestamp
  //     .set('orderId', orderId ? orderId : '')
  //     .set('origClientOrderId', origClientOrderId ? origClientOrderId : '');

  //   const totalParams = this.buildTotalParams(params);
  //   const signature = this.generateSignature(totalParams);

  //   const headers = this.getHeaders()
  //     .set('X-MEXC-TIMESTAMP', timestamp.toString())
  //     .set('X-MEXC-SIGNATURE', signature);

  //   // Include the signature in the query string
  //   const signedParams = params.append('signature', signature);

  //   return this.httpClientRef.get(`${this.MEXC_apiUrl}/v3/order`, { headers, params: signedParams });
  // }

  //#endregion
  //#endregion













  // ---------------------------------------methods----------------------STARTS------



  getPriceMexc(symbol: string) {
    const MEXC_apiUrl = symbol ? `${this.MEXC_apiUrl}/price?symbol=${symbol}` : `${this.MEXC_apiUrl}/price`;
    return this.httpClientRef.get(`${this.baseURL}${MEXC_apiUrl}`);


  }



 
  // getPriceMexcFutures(symbol: string) {
  //   // Create HttpParams object to add query parameters
  //   const params = new HttpParams().set('symbol', symbol);

  //   // Construct the full URL (you might not need to concatenate baseURL with MEXC_apiUrl)
  //   const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}`;

  //   // Make the GET request with the query parameter
  //   return this.httpClientRef.get(fullUrl, { params });
  // }
  




  getAccountMexc() {
    const MEXC_apiUrl = '/account'; // Mexc API endpoint for account information
    const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${MEXC_apiUrl}`;

    return this.httpClientRef.get(fullUrl);
  }

  // getAccountMexcFutures(){
  //   const MEXC_apiUrl = '/assets-detail-futures'; // Mexc API endpoint for account information
  //   const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${MEXC_apiUrl}`;

  //   return this.httpClientRef.get(fullUrl);
  // }




  async getOpenPositionsMexcFutures() {
    try {
      const MEXC_apiUrl = '/position-open-futures'; // Mexc API endpoint for account information

      const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${MEXC_apiUrl}`;

      

      const response: any = await this.httpClientRef.get(fullUrl).toPromise();


      // Assuming your API response is an object with the data property
      if (response.openPositionInfo.success) {
        return response.openPositionInfo.data; // Adjust this based on your API response structure
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching position history:', error);
      throw error; // You can handle the error as needed in your component
    }
  }

  async getPriceBySymbol(symbol: string): Promise<any> {
    try {
      const endpoint = '/price-futures'; // API route for price futures
      const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${endpoint}`;
  
      // Set up the query params
      const params = new HttpParams().set('symbol', symbol);
  
      // Make the request with symbol as a query parameter
      const response: any = await this.httpClientRef.get(fullUrl, { params }).toPromise();
  
      // Assuming the API returns a successful response with the desired price data
      if (response.price.success) {
        return response.price.data.fairPrice; // Adjust this based on your API response structure
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error(`Error fetching price for symbol ${symbol}:`, error);
      throw error; // Handle error as needed
    }
  }
  


  async getPositionHistoryMexcFutures(): Promise<any> {
    try {
      const endpoint = '/position-history-futures';
      const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${endpoint}`;

      const response: any = await this.httpClientRef.get(fullUrl).toPromise();

      // Assuming your API response is an object with the data property
      if (response.positionInfo.success) {
        return response.positionInfo.data; // Adjust this based on your API response structure
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching position history:', error);
      throw error; // You can handle the error as needed in your component
    }
  }


  async getAccountMexcFutures(): Promise<any> {
    try {
      const endpoint = '/assets-detail-futures'; // Mexc API endpoint for account information
      const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${endpoint}`;

      const response: any = await this.httpClientRef.get(fullUrl).toPromise();


      if (response.assetsInfo.success) {
        return response.assetsInfo.data;
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Error fetching futures account info:', error);
      throw error
    }
  }



  // getTransferRecordsMexcFutures() {
  //   const MEXC_apiUrl = '/transfers-futures'; // Mexc API endpoint for account information
  //   const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${MEXC_apiUrl}`;

  //   return this.httpClientRef.get(fullUrl);
  // }



  async getTransferRecordsMexcFutures(): Promise<any> {

    try {
      const endpoint = '/transfers-futures'; // Mexc API endpoint for tranfer records information
      const fullUrl = `${this.baseURL}${this.MEXC_apiUrl}${endpoint}`;

      const response: any = await this.httpClientRef.get(fullUrl).toPromise();

      if (response.transferRecords.success) {
        return response.transferRecords.data;
      } else {
        throw new Error(response.error);
      }

    } catch (error) {
      console.error('Error fetching futures account info:', error);
      throw error
    }




  }





  // getBTCUSDTPrice(pair: string) {
  //   // const response = await axios.get(`${this.baseUrl}/ticker/price?symbol=BTCUSDT`);
  //   console.log('Mexc');
  //   return this.httpClientRef.get('/api/v3/allOrders')
  //   // return this.httpClientRef.get(
  //   //   '/api/v3/ticker/price?symbol=' + pair + 'USDT'
  //   // );
  // }




  // ---------------------------------------methods----------------------ENDS------



}
