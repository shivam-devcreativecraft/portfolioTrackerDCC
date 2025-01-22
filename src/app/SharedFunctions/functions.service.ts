import { Component, Injectable } from '@angular/core';
import {
  ConfirmDialogComponent,
  ConfirmDialogModel,
} from '../SharedComponents/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root',
})
export class FunctionsService {


  constructor(
    private dialog: MatDialog,
    
    private toastr: ToastrService,
    private loaderService: LoaderService

  ) { }

}