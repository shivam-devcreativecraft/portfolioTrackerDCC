import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrdersSheetComponent } from './open-orders-sheet.component';

describe('OpenOrdersSheetComponent', () => {
  let component: OpenOrdersSheetComponent;
  let fixture: ComponentFixture<OpenOrdersSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpenOrdersSheetComponent]
    });
    fixture = TestBed.createComponent(OpenOrdersSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
