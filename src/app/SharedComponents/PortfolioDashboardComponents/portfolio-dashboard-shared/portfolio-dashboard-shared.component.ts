import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-portfolio-dashboard-shared',
  templateUrl: './portfolio-dashboard-shared.component.html',
  styleUrls: ['./portfolio-dashboard-shared.component.scss']
})
export class PortfolioDashboardSharedComponent {
  @Input() exchangeName: string = '';


}
