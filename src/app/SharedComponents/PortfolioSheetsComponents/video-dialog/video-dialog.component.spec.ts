import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoDialogComponent } from './video-dialog.component';

describe('VideoDialogComponent', () => {
  let component: VideoDialogComponent;
  let fixture: ComponentFixture<VideoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoDialogComponent]
    });
    fixture = TestBed.createComponent(VideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
