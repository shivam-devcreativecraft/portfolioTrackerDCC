import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebitcoEventsComponent } from './freebitco-events.component';

describe('FreebitcoEventsComponent', () => {
  let component: FreebitcoEventsComponent;
  let fixture: ComponentFixture<FreebitcoEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreebitcoEventsComponent]
    });
    fixture = TestBed.createComponent(FreebitcoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
