import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioOurbitComponent } from './portfolio-ourbit.component';

describe('PortfolioOurbitComponent', () => {
  let component: PortfolioOurbitComponent;
  let fixture: ComponentFixture<PortfolioOurbitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioOurbitComponent]
    });
    fixture = TestBed.createComponent(PortfolioOurbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
