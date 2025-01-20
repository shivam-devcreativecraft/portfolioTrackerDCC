import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActForexRealComponent } from './act-forex-real.component';

describe('ActForexRealComponent', () => {
  let component: ActForexRealComponent;
  let fixture: ComponentFixture<ActForexRealComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActForexRealComponent]
    });
    fixture = TestBed.createComponent(ActForexRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
