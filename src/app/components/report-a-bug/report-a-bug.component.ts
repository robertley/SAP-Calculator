import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { cloneDeep } from 'lodash-es';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  submit() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    // Clean the form data to remove circular references and generate shareable link
    let shareableLink: string;
    try {
      const rawValue = this.calcFormGroup.value;
      const cleanValue = cloneDeep(rawValue);

      const petsToClean = [
        ...(cleanValue.playerPets || []),
        ...(cleanValue.opponentPets || []),
      ];

      for (const pet of petsToClean) {
        if (pet) {
          // Remove properties that are class instances or cause cycles
          delete pet.parent;
          delete pet.logService;
          delete pet.abilityService;
          delete pet.gameService;
          delete pet.petService;

          if (pet.equipment) {
            const equipmentName =
              typeof pet.equipment === 'string'
                ? pet.equipment
                : pet.equipment.name;
            pet.equipment = equipmentName ? { name: equipmentName } : null;
          }
        }
      }

      const calculatorStateString = JSON.stringify(cleanValue);
      const encodedData = encodeURIComponent(calculatorStateString);

      const baseUrl = 'http://localhost:4200/';
      shareableLink = `${baseUrl}?c=${encodedData}`;
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
          replyto: 'Ruihan20080129@gmail.com',
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
          alert(
            'Failed to submit bug report. Please try again or contact the developer directly.',
          );
        },
      );
  }

  back() {
    this.formGroup.reset();
    this.submitted = false;
    this.reported = false;
  }
}
