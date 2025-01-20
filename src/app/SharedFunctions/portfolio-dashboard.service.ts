import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GoogleSheetApiService } from 'src/app/services/google-sheet-api.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDashboardService {

  private allSheetsLoaded$: Subject<void> = new Subject<void>();
  private loadedSheetsCount: number = 0;

  constructor(private googleSheetAPIServiceRef: GoogleSheetApiService) { }

  public getAllSheetsLoadedObservable(): Observable<void> {
    return this.allSheetsLoaded$.asObservable();
  }

  async loadSheetData(componentRef: any, exchangeName: string, sheetName: string, itemsPerPage: any, page: number, targetKey: string, componentDestroyed$: Subject<void>): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      if (!itemsPerPage) {
        itemsPerPage = 500
      }
      if (!componentRef.isDestroyed) {
        this.googleSheetAPIServiceRef
          .getAIOSheetsData(exchangeName, sheetName, itemsPerPage, page)
          .pipe(takeUntil(componentDestroyed$))
          .subscribe((data: any) => {
            if (data) {
              const newDataArray: any[] = Object.values(data.data);
              const currentData = componentRef.sheetData[targetKey]?.data || [];
              componentRef.sheetData[targetKey] = {
                data: [...currentData, ...newDataArray],
                pageSizeOptions: Math.ceil((currentData.length + newDataArray.length) / itemsPerPage),
                currentPage: page,
                totalPages: data.totalPages,
                pagesLoaded: (componentRef.sheetData[targetKey]?.pagesLoaded || 0) + 1,
                dataLength: currentData.length + newDataArray.length
              };

              if (componentRef.sheetData[targetKey].currentPage < componentRef.sheetData[targetKey].totalPages) {
                this.loadSheetData(componentRef, exchangeName, sheetName, itemsPerPage, componentRef.sheetData[targetKey].currentPage + 1, targetKey, componentDestroyed$)
                  .then((loadedData) => {
                    resolve(loadedData);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } else if (componentRef.sheetData[targetKey].pagesLoaded === componentRef.sheetData[targetKey].totalPages) {
                this.loadedSheetsCount++;
                if (this.loadedSheetsCount === componentRef.totalSheets) {
                  this.allSheetsLoaded$.next(); // Emit the value only when all sheets' data is loaded
                }
                resolve(componentRef.sheetData[targetKey].data);
              }
            }
          });
      } else {
        reject('Component is destroyed, further recursive API calls blocked.');
      }
    });
  }
}
