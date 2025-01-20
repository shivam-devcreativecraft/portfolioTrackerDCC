import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDeltaComponent } from './portfolio-delta.component';

describe('PortfolioDeltaComponent', () => {
  let component: PortfolioDeltaComponent;
  let fixture: ComponentFixture<PortfolioDeltaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioDeltaComponent]
    });
    fixture = TestBed.createComponent(PortfolioDeltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
