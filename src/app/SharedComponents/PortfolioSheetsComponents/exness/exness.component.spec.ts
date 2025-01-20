import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExnessComponent } from './exness.component';

describe('ExnessComponent', () => {
  let component: ExnessComponent;
  let fixture: ComponentFixture<ExnessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExnessComponent]
    });
    fixture = TestBed.createComponent(ExnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
