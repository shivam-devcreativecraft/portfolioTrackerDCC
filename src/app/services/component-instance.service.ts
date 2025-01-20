import { Injectable } from '@angular/core';
import { AssetsDetailExchangeComponent } from '../assets-detail/assetsDetailExchange/assets-detail-exchange.component';

@Injectable({
  providedIn: 'root'
})
export class ComponentInstanceService {

  private componentInstance_AssetsDetailExchangeComponent: any;
  private componentInstance_AssetsDetailHistoryComponent: any;





  private componentInstance: any;


  setComponentInstance(component: string, instance: any) {

    switch (component){

      case 'AssetsDetailExchangeComponent':{
        this.componentInstance_AssetsDetailExchangeComponent = instance
        break;
      }
      case 'AssetsDetailHistoryComponent':{
        this.componentInstance_AssetsDetailHistoryComponent = instance
        break;
      }

    }

    // this.componentInstance = instance;
  }

  getComponentInstance(ComponentName: string) {

    switch (ComponentName) {
      case 'AssetsDetailExchangeComponent': {
        this.componentInstance=this.componentInstance_AssetsDetailExchangeComponent
        break;
      }
      case 'AssetsDetailHistoryComponent': {
        this.componentInstance=this.componentInstance_AssetsDetailHistoryComponent
        break;
      }
    }

    return this.componentInstance;



  }
}
