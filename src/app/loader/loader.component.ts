import { Component } from '@angular/core';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-loader',
  // template: `
  //   <div *ngIf="isLoading | async" class="loader-overlay">
  //     <div class="loader"></div>
  //   </div>
  // `,

templateUrl:'./loader.component.html',
  // template:`<div class="loader-div d-flex justify-content-center align-items-center flex-column" *ngIf="isLoading | async">
  // <div class="spinner-border" role="status">
  //   <span class="visually-hidden">Loading...</span>
  // </div>
  // <span class="pt-2">Loading ...</span>
  
  // </div>`,
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  isLoading = this.loaderService.loading$;

  constructor(private loaderService: LoaderService) {}
}
