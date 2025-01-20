import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebitcoFunBuyingComponent } from './freebitco-fun-buying.component';

describe('FreebitcoFunBuyingComponent', () => {
  let component: FreebitcoFunBuyingComponent;
  let fixture: ComponentFixture<FreebitcoFunBuyingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreebitcoFunBuyingComponent]
    });
    fixture = TestBed.createComponent(FreebitcoFunBuyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
