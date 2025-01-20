import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioKucoinComponent } from './portfolio-kucoin.component';

describe('PortfolioKucoinComponent', () => {
  let component: PortfolioKucoinComponent;
  let fixture: ComponentFixture<PortfolioKucoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioKucoinComponent]
    });
    fixture = TestBed.createComponent(PortfolioKucoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
