import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavMenuAsDialogComponent } from './sidenav-menu-as-dialog.component';

describe('SidenavMenuAsDialogComponent', () => {
  let component: SidenavMenuAsDialogComponent;
  let fixture: ComponentFixture<SidenavMenuAsDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavMenuAsDialogComponent]
    });
    fixture = TestBed.createComponent(SidenavMenuAsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
