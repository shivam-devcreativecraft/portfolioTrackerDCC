import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActFuturesDemoComponent } from './act-futures-demo.component';

describe('ActFuturesDemoComponent', () => {
  let component: ActFuturesDemoComponent;
  let fixture: ComponentFixture<ActFuturesDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActFuturesDemoComponent]
    });
    fixture = TestBed.createComponent(ActFuturesDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
