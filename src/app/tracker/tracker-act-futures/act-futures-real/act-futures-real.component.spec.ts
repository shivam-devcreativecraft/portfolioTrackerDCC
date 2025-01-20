import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActFuturesRealComponent } from './act-futures-real.component';

describe('ActFuturesRealComponent', () => {
  let component: ActFuturesRealComponent;
  let fixture: ComponentFixture<ActFuturesRealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActFuturesRealComponent]
    });
    fixture = TestBed.createComponent(ActFuturesRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
