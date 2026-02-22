import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from 'app/runtime/state/local-storage.service';
import {
  ExportPayloadFormat,
  buildExportPayload,
} from 'app/ui/shell/state/app.component.share';

@Component({
  selector: 'app-export-calculator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-calculator.component.html',
  styleUrls: ['./export-calculator.component.scss'],
})
export class ExportCalculatorComponent implements OnInit {
  @Input()
  formGroup: FormGroup;

  exportFormat: ExportPayloadFormat = 'compressed';
  statusMessage = '';
  statusTone: 'success' | 'error' = 'success';
  private statusTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {}

  get isLegacyJsonExport(): boolean {
    return this.exportFormat === 'legacyJson';
  }

  onExportFormatChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.exportFormat = target?.checked ? 'legacyJson' : 'compressed';
  }

  formGroupValueString() {
    if (!this.formGroup) {
      return '';
    }
    try {
      return buildExportPayload(this.formGroup, this.exportFormat);
    } catch (e) {
      console.error('Error creating export string:', e);
      return 'Error: Could not generate the export data.';
    }
  }

  copyToClipboard() {
    this.localStorageService.setFormStorage(this.formGroup);
    this.clearStatus();

    // Use the cleaned data instead of raw form value to avoid circular references
    const calc = this.formGroupValueString();

    // Check if the data generation failed
    if (calc.startsWith('Error:')) {
      this.setStatus('Failed to export.', 'error');
      return;
    }

    // copy to clipboard
    navigator.clipboard
      .writeText(calc)
      .then(() => {
        this.setStatus('Copied to clipboard.', 'success');
      })
      .catch((error) => {
        console.error('Clipboard error:', error);
        this.setStatus('Failed to copy to clipboard.', 'error');
      });
  }

  private clearStatus() {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
      this.statusTimer = null;
    }
    this.statusMessage = '';
  }

  private setStatus(message: string, tone: 'success' | 'error') {
    this.statusMessage = message;
    this.statusTone = tone;
    if (this.statusTimer) {
      clearTimeout(this.statusTimer);
    }
    this.statusTimer = setTimeout(() => {
      this.statusMessage = '';
      this.statusTimer = null;
    }, 3000);
  }
}

