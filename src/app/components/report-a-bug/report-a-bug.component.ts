import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-a-bug',
  templateUrl: './report-a-bug.component.html',
  styleUrls: ['./report-a-bug.component.scss']
})
export class ReportABugComponent implements OnInit {

  @Input() calcFormGroup: FormGroup;

  formGroup: FormGroup = new FormGroup({
    'name': new FormControl(''),
    'description': new FormControl(null, Validators.required)
  });

  reported = false;
  submitted = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  submit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    let message = {
      ...this.formGroup.value,
      code: JSON.stringify(this.calcFormGroup.value)
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.post('https://formspree.io/f/xrgnzkdq',
      { name: 'SAP CALC', replyto: 'robert.ley94@gmail.com', message: message },
      { 'headers': headers }).subscribe(
          response => {
            console.log(response);
          }
      );
    this.reported = true;
  }

  back() {
    this.formGroup.reset();
    this.submitted = false;
    this.reported = false;
  }
}
