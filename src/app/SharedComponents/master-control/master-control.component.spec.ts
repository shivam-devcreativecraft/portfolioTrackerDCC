import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterControlComponent } from './master-control.component';

describe('MasterControlComponent', () => {
  let component: MasterControlComponent;
  let fixture: ComponentFixture<MasterControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterControlComponent]
    });
    fixture = TestBed.createComponent(MasterControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
