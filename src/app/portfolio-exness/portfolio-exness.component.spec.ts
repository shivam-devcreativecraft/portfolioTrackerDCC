import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioExnessComponent } from './portfolio-exness.component';

describe('PortfolioExnessComponent', () => {
  let component: PortfolioExnessComponent;
  let fixture: ComponentFixture<PortfolioExnessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioExnessComponent]
    });
    fixture = TestBed.createComponent(PortfolioExnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
