// bybit.service.ts
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js'; // Import the crypto-js library
import axios, { AxiosRequestConfig } from 'axios';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BybitAPICopyTradingAccountService {

  private apiKey = environment.BYBIT_API_KEY_Copy_Trading_Master;
  private secret = environment.BYBIT_SECRETE_Copy_Trading_Master;
  private recvWindow = 5000000;
  private timestamp = Date.now().toString();
  private url = 'https://api.bybit.com'; // You can switch to the mainnet URL when ready

constructor(private httpClientRef:HttpClient){}







// --------------generating params ---------------------STARTS----
  private generateSignature(parameters: string): string {
    const hmac = CryptoJS.HmacSHA256(
      this.timestamp + this.apiKey + this.recvWindow + parameters,
      this.secret
    );
    return CryptoJS.enc.Hex.stringify(hmac);
  }

  async http_request(
    endpoint: string,
    method: string,
    data: string,
    info: string
  ): Promise<void> {
    const sign = this.generateSignature(data);
    let fullEndpoint: string;

    if (method === 'POST') {
      fullEndpoint = this.url + endpoint;
    } else {
      fullEndpoint = this.url + endpoint + '?' + data;
      data = '';
    }

    const headers: any = {
      'X-BAPI-SIGN-TYPE': '2',
      'X-BAPI-SIGN': sign,
      'X-BAPI-API-KEY': this.apiKey,
      'X-BAPI-TIMESTAMP': this.timestamp,
      'X-BAPI-RECV-WINDOW': this.recvWindow.toString(),
    };

    if (method === 'POST') {
      headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    const config: AxiosRequestConfig = {
      method: method,
      url: fullEndpoint,
      headers: headers,
      data: data,
    };

    // console.log(info + ' Calling....');
    try {
      const response = await axios(config);
      // console.log(info + ' Response:', response); // Log the response
      return response.data; // Return the response data
    } catch (error: any) {
      console.error(info + ' Error:', error.response.data);
      throw error; // Rethrow the error if needed
    }
  }
// --------------generating params ---------------------ENDS----


// --------------methods (endpoints) ---------------------STARTS----


  async getWalletBalance(accountType: string, coin?: string): Promise<void> {
    const endpoint = '/v5/account/wallet-balance';
    let data = `accountType=${accountType}`;
    if (coin) {
      data += `&coin=${coin}`;
    }

    await this.http_request(endpoint, 'GET', data, 'Get Wallet Balance');
  }

  async getAllCoinBalance(accountType: string, coin?: string): Promise<any> {
    const endpoint = '/v5/account/wallet-balance';
    let data = `accountType=${accountType}`;
    if (coin) {
      data += `&coin=${coin}`;
    }
  
    try {
      const response:any = await this.http_request(endpoint, 'GET', data, 'Get Wallet Balance');
      return response; // Assuming the data is in the 'data' property of the response
    } catch (error) {
      console.error('Error in getAllCoinBalance:', error);
      throw error; // Rethrow the error to be caught by the caller
    }
  }
  async getAssetInfoSpot(accountType: string): Promise<void> {
    const endpoint = '/v5/asset/transfer/query-asset-info';
    let data = `acountType=${accountType}`;
    await this.http_request(endpoint, 'GET', data, 'Get Asset Info Spot');
  }
  
  async getPositions(coin: string): Promise<void> {
    const endpoint = '/v5/position/list';
    let data = `category=linear`;
    data += `&settleCoin=${coin}`;
    await this.http_request(endpoint, 'GET', data, 'Get Asset Info Spot');
  }
  // async getClosedPnl(): Promise<void> {
  //   const endpoint = '/v5/position/closed-pnl';
  //   let data = `category=linear`;
  //   data += `&limit=100`; 
  //   await this.http_request(endpoint, 'GET', data, 'Get closed  pnl');
  // }
  // async getExecution(): Promise<void> {
  //   const endpoint = '/v5/execution/list';
  //   let data = `category=linear`;
  //   data += `&limit=100`; 
  //   await this.http_request(endpoint, 'GET', data, 'Get closed  pnl');
  // }

  async getClosedPnl_Bybit(category: string, limit?: number): Promise<any> {
    try {
      const endpoint = '/v5/position/closed-pnl';

      let data = `category=${category}`;
      data += limit ? `&limit=${limit}` : 100;
      // data += `&limit=1`;
      const response: any = await this.http_request(endpoint, 'GET', data, 'Get closed pnl');
      if (response.retMsg == 'OK')
        // Assuming your API response is an object with the data property
        return response.result.list; // Adjust this based on your API response structure
      else
        alert(response.retMsg)
      
    } catch (error) {
      console.error('Error fetching open orders:', error);
      throw error; // You can handle the error as needed in your component
    }
  }







  async getTradeHistory_Bybit(category: string, limit?: number): Promise<any> {
    try {
      const endpoint = '/v5/execution/list';
      let data = `category=${category}`;
      data += limit ? `&limit=${limit}` : 100;
      // data += `&limit=1`;
      const response: any = await this.http_request(endpoint, 'GET', data, 'Get Trade History');
      if (response.retMsg == 'OK')
        // Assuming your API response is an object with the data property
        return response.result.list; // Adjust this based on your API response structure
      else
        alert(response.retMsg)
      
    } catch (error) {
      console.error('Error fetching open orders:', error);
      throw error; // You can handle the error as needed in your component
    }
  }
  
  async getOrderHistory(category:string): Promise<void> {
    try {
      const endpoint = '/v5/order/history';
      let data = `category=${category}`;
      
      data += `&limit=5000`;
      const response: any = await this.http_request(endpoint, 'GET', data, 'Get Trade History');
      if (response.retMsg == 'OK')
        // Assuming your API response is an object with the data property
        return response.result.list; // Adjust this based on your API response structure
      else
        alert(response.retMsg)
      
    } catch (error) {
      console.error('Error fetching open orders:', error);
      throw error; // You can handle the error as needed in your component
    }
  }

  async getOpenOrders(category:string): Promise<void> {
  try {
      const endpoint = '/v5/order/realtime';
      let data = `category=${category}`;
      
      data += `&limit=5000`;
      const response: any = await this.http_request(endpoint, 'GET', data, 'Get Trade History');
      if (response.retMsg == 'OK')
        // Assuming your API response is an object with the data property
        return response.result.list; // Adjust this based on your API response structure
      else
        alert(response.retMsg)
      
    } catch (error) {
      console.error('Error fetching open orders:', error);
      throw error; // You can handle the error as needed in your component
    }
  }
  getPriceBybit(ticker: string) {

    return this.httpClientRef.get(this.url+'/v5/market/tickers?category=spot&symbol=' + ticker + 'USDT');
  }

// --------------methods (endpoints) ---------------------ENDS----



}
