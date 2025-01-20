import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSpotCoinDialogComponent } from './search-spot-coin-dialog.component';

describe('SearchSpotCoinDialogComponent', () => {
  let component: SearchSpotCoinDialogComponent;
  let fixture: ComponentFixture<SearchSpotCoinDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSpotCoinDialogComponent]
    });
    fixture = TestBed.createComponent(SearchSpotCoinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
