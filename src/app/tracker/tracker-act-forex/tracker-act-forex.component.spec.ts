import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerActForexComponent } from './tracker-act-forex.component';

describe('TrackerActForexComponent', () => {
  let component: TrackerActForexComponent;
  let fixture: ComponentFixture<TrackerActForexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerActForexComponent]
    });
    fixture = TestBed.createComponent(TrackerActForexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
