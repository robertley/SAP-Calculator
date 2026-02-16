import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { buildShareableLink } from '../../shell/state/app.component.share';

@Component({
  selector: 'app-report-a-bug',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-a-bug.component.html',
  styleUrls: ['./report-a-bug.component.scss'],
})
export class ReportABugComponent implements OnInit {
  @Input() calcFormGroup: FormGroup;

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(null, Validators.required),
  });

  reported = false;
  submitted = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  submit() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.formGroup.invalid) {
      return;
    }

    // Reuse the app's canonical share-link format (#c= compact payload).
    let shareableLink: string;
    try {
      if (!this.calcFormGroup) {
        throw new Error('Calculator form is unavailable.');
      }
      const baseUrl = window.location.origin + window.location.pathname;
      shareableLink = buildShareableLink(this.calcFormGroup, baseUrl);
    } catch (e) {
      console.error('Error creating bug report data:', e);
      shareableLink = 'Error: Could not generate shareable link';
    }

    let message = {
      ...this.formGroup.value,
      link: shareableLink,
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post(
        'https://formspree.io/f/mgvzngzp',
        {
          name: 'SAP CALC',
          message: message,
        },
        { headers: headers },
      )
      .subscribe(
        (response) => {
          console.log('Bug report submitted successfully:', response);
          this.reported = true;
        },
        (error) => {
          console.error('Error submitting bug report:', error);
          this.errorMessage =
            'Failed to submit bug report. Please try again or contact the developer directly.';
        },
      );
  }

  back() {
    this.formGroup.reset();
    this.submitted = false;
    this.reported = false;
    this.errorMessage = '';
  }
}
