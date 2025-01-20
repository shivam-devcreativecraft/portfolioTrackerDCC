import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurbitFuturesComponent } from './ourbit-futures.component';

describe('OurbitFuturesComponent', () => {
  let component: OurbitFuturesComponent;
  let fixture: ComponentFixture<OurbitFuturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurbitFuturesComponent]
    });
    fixture = TestBed.createComponent(OurbitFuturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
