import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  constructor(private loggingService: LoggingService) {
    this.overrideConsole();
  }

  private overrideConsole() {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args: any[]) => {
      this.loggingService.log('Console Log:', args);
      originalConsoleLog.apply(console, args);
    };

    console.error = (...args: any[]) => {
      this.loggingService.log('Console Error:', args);
      originalConsoleError.apply(console, args);
    };
  }
}
