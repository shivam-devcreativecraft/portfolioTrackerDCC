import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTradingSetupEntryComponent } from './add-trading-setup-entry.component';

describe('AddTradingSetupEntryComponent', () => {
  let component: AddTradingSetupEntryComponent;
  let fixture: ComponentFixture<AddTradingSetupEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTradingSetupEntryComponent]
    });
    fixture = TestBed.createComponent(AddTradingSetupEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
