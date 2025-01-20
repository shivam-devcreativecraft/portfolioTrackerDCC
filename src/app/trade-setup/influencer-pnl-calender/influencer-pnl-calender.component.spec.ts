import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerPnlCalenderComponent } from './influencer-pnl-calender.component';

describe('InfluencerPnlCalenderComponent', () => {
  let component: InfluencerPnlCalenderComponent;
  let fixture: ComponentFixture<InfluencerPnlCalenderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfluencerPnlCalenderComponent]
    });
    fixture = TestBed.createComponent(InfluencerPnlCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
