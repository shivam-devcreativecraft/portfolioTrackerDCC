import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioFreebitcoComponent } from './portfolio-freebitco.component';

describe('PortfolioFreebitcoComponent', () => {
  let component: PortfolioFreebitcoComponent;
  let fixture: ComponentFixture<PortfolioFreebitcoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioFreebitcoComponent]
    });
    fixture = TestBed.createComponent(PortfolioFreebitcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
