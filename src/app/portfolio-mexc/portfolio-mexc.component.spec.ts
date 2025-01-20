import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioMexcComponent } from './portfolio-mexc.component';

describe('PortfolioMexcComponent', () => {
  let component: PortfolioMexcComponent;
  let fixture: ComponentFixture<PortfolioMexcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioMexcComponent]
    });
    fixture = TestBed.createComponent(PortfolioMexcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
