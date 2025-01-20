import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToGoogledriveComponent } from './add-to-googledrive.component';

describe('AddToGoogledriveComponent', () => {
  let component: AddToGoogledriveComponent;
  let fixture: ComponentFixture<AddToGoogledriveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddToGoogledriveComponent]
    });
    fixture = TestBed.createComponent(AddToGoogledriveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
