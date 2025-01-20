import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KucoinP2pComponent } from './kucoin-p2p.component';

describe('KucoinP2pComponent', () => {
  let component: KucoinP2pComponent;
  let fixture: ComponentFixture<KucoinP2pComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KucoinP2pComponent]
    });
    fixture = TestBed.createComponent(KucoinP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
