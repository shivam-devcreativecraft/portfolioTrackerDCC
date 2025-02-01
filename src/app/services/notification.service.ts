import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      panelClass: ['success-snackbar', 'snackbar-margin'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  error(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      panelClass: ['error-snackbar', 'snackbar-margin'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  warning(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      panelClass: ['warning-snackbar', 'snackbar-margin'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  info(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      panelClass: ['info-snackbar', 'snackbar-margin'],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
} 