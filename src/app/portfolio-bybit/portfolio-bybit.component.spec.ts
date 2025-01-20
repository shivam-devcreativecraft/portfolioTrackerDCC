import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioBybitComponent } from './portfolio-bybit.component';

describe('PortfolioBybitComponent', () => {
  let component: PortfolioBybitComponent;
  let fixture: ComponentFixture<PortfolioBybitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioBybitComponent]
    });
    fixture = TestBed.createComponent(PortfolioBybitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
