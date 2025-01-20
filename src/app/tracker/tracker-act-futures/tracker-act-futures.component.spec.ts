import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerActFuturesComponent } from './tracker-act-futures.component';

describe('TrackerActFuturesComponent', () => {
  let component: TrackerActFuturesComponent;
  let fixture: ComponentFixture<TrackerActFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerActFuturesComponent]
    });
    fixture = TestBed.createComponent(TrackerActFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
