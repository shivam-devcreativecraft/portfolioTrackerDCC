import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logs: any[] = [];

  log(message: string, data: any) {
    this.logs.push({ message, data, timestamp: new Date() });
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}
