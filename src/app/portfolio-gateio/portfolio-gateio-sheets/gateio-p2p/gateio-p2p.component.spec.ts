import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateP2pComponent } from './gateio-p2p.component';

describe('GateP2pComponent', () => {
  let component: GateP2pComponent;
  let fixture: ComponentFixture<GateP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GateP2pComponent]
    });
    fixture = TestBed.createComponent(GateP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
