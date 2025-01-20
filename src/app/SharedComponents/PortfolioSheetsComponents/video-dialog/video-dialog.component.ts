import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-video-dialog',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss']
})
export class VideoDialogComponent {
  videoUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.videoUrl = data.videoUrl;
  }
  showFullDescription = false;

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription;
  }
}
