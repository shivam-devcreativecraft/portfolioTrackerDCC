import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BybitP2pComponent } from './bybit-p2p.component';

describe('BybitP2pComponent', () => {
  let component: BybitP2pComponent;
  let fixture: ComponentFixture<BybitP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BybitP2pComponent]
    });
    fixture = TestBed.createComponent(BybitP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
