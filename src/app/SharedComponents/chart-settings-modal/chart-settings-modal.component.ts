import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirebaseDataService } from '../../services/firebase-data.service';
import { NotificationService } from '../../services/notification.service';
import { AnalysisSettings } from '../../models/analysis-settings.model';

@Component({
  selector: 'app-chart-settings-modal',
  templateUrl: './chart-settings-modal.component.html',
  styleUrls: ['./chart-settings-modal.component.scss']
})
export class ChartSettingsModalComponent {
  settingsForm: FormGroup;
  isLoading = false;

  exchanges = [
    { value: 'BINANCE', name: 'Binance' },
    { value: 'MEXC', name: 'MEXC' },
    { value: 'KUCOIN', name: 'KuCoin' },
    { value: 'BYBIT', name: 'Bybit' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChartSettingsModalComponent>,
    private firebaseService: FirebaseDataService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: AnalysisSettings
  ) {
    this.settingsForm = this.fb.group({
      exchange: [data.exchange || 'BINANCE', Validators.required],
      symbol: [data.symbol || '', [Validators.required, Validators.minLength(1)]]
    });
  }

  onSave(): void {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      const settings: AnalysisSettings = this.settingsForm.value;
      
      this.firebaseService.saveAnalysisSettings(settings).subscribe({
        next: () => {
          this.notificationService.success('Settings saved successfully');
          this.dialogRef.close(settings);
        },
        error: (error: Error) => {
          console.error('Error saving settings:', error);
          this.notificationService.error('Failed to save settings');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 