import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown-timer',
  template: '{{ timeRemaining }}',
  styleUrls: ['./countdown-timer.component.scss']
})

export class CountdownTimerComponent implements OnInit {
  @Input() closeDate!: Date;
  timeRemaining!: string;

  ngOnInit() {
    this.updateTimeRemaining();
    setInterval(() => this.updateTimeRemaining(), 1000);
  }

  updateTimeRemaining() {
    const currentTime = new Date();

    this.closeDate = new Date(this.closeDate)
    const timeDiff = this.closeDate.getTime() - currentTime.getTime();
    if (timeDiff > 0) {
      const secondsRemaining = Math.floor(timeDiff / 1000);
      const days = Math.floor(secondsRemaining / (60 * 60 * 24));
      const hours = Math.floor((secondsRemaining % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((secondsRemaining % 3600) / 60);
      const seconds = secondsRemaining % 60;

      this.timeRemaining = `${days} D | ${hours}:${minutes}:${seconds}`;
    } else {
      this.timeRemaining = 'Executed';
    }
  }

}




