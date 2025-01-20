import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingToolsComponent } from './trading-tools.component';

describe('TradingToolsComponent', () => {
  let component: TradingToolsComponent;
  let fixture: ComponentFixture<TradingToolsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradingToolsComponent]
    });
    fixture = TestBed.createComponent(TradingToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
