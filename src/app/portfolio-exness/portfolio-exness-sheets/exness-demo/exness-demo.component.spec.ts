import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExnessDemoComponent } from './exness-demo.component';

describe('ExnessDemoComponent', () => {
  let component: ExnessDemoComponent;
  let fixture: ComponentFixture<ExnessDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExnessDemoComponent]
    });
    fixture = TestBed.createComponent(ExnessDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
