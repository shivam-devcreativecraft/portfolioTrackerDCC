import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeltaOptionsComponent } from './delta-options.component';

describe('DeltaOptionsComponent', () => {
  let component: DeltaOptionsComponent;
  let fixture: ComponentFixture<DeltaOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeltaOptionsComponent]
    });
    fixture = TestBed.createComponent(DeltaOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
