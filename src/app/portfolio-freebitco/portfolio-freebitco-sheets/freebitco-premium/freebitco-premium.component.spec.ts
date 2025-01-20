import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebitcoPremiumComponent } from './freebitco-premium.component';

describe('FreebitcoPremiumComponent', () => {
  let component: FreebitcoPremiumComponent;
  let fixture: ComponentFixture<FreebitcoPremiumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreebitcoPremiumComponent]
    });
    fixture = TestBed.createComponent(FreebitcoPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
