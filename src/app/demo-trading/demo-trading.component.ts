import { Component } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-demo-trading',
  templateUrl: './demo-trading.component.html',
  styleUrls: ['./demo-trading.component.scss'],
})
export class DemoTradingComponent {
  constructor(
    private notificationService: NotificationService
  ) {}
}