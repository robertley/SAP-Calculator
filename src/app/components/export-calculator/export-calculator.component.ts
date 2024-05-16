import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-export-calculator',
  templateUrl: './export-calculator.component.html',
  styleUrls: ['./export-calculator.component.scss']
})
export class ExportCalculatorComponent implements OnInit {

  @Input()
  formGroup: FormGroup;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit(): void {
  }

  formGroupValueString() {
    return JSON.stringify(this.formGroup.value);
  }

  copyToClipboard() {
    this.localStorageService.setFormStorage(this.formGroup);
    
    let calc = JSON.stringify(this.formGroup.value);
    // copy to clipboard
    navigator.clipboard.writeText(calc).then(() => {
      alert('Copied to clipboard');
    })
    
  }

}
