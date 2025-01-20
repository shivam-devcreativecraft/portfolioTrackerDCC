import { Component, Input, OnInit } from '@angular/core';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent implements OnInit {
  logs: any[] = [];
  successLogs: any[] = [];
  errorLogs: any[] = [];
  @Input() IsViaDialog: string = '';

  constructor(private loggingService: LoggingService) {}

  ngOnInit() {
    this.logs = this.loggingService.getLogs();
    this.successLogs = this.logs.filter(log => log.message.startsWith('Success'));
    this.errorLogs = this.logs.filter(log => log.message.startsWith('Error'));
  }

  clearLogs() {
    this.loggingService.clearLogs();
    this.logs = [];
    this.successLogs = [];
    this.errorLogs = [];
  }
}
