import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActForexDemoComponent } from './act-forex-demo.component';

describe('ActForexDemoComponent', () => {
  let component: ActForexDemoComponent;
  let fixture: ComponentFixture<ActForexDemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActForexDemoComponent]
    });
    fixture = TestBed.createComponent(ActForexDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
