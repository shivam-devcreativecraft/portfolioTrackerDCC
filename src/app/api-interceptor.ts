import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './services/logging.service';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            const message = `Success: ${req.method} ${req.urlWithParams}`;
            const data = { status: event.status, message: event.statusText, body: event.body };
            this.loggingService.log(message, data);
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            const message = `Error: ${req.method} ${req.urlWithParams}`;
            const data = { status: error.status, message: error.message, error: error.error };
            this.loggingService.log(message, data);
          }
        }
      )
    );
  }
}
