import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreebitcoBonusComponent } from './freebitco-bonus.component';

describe('FreebitcoBonusComponent', () => {
  let component: FreebitcoBonusComponent;
  let fixture: ComponentFixture<FreebitcoBonusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FreebitcoBonusComponent]
    });
    fixture = TestBed.createComponent(FreebitcoBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
