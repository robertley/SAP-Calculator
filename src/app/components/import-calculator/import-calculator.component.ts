import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-import-calculator',
  templateUrl: './import-calculator.component.html',
  styleUrls: ['./import-calculator.component.scss']
})
export class ImportCalculatorComponent implements OnInit {

  @Input()
  importFunc: (importVal: string) => boolean;

  formGroup: FormGroup = new FormGroup({
    calcCode: new FormControl(null)
  })

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    let message = '';
    if (this.importFunc(this.formGroup.value.calcCode)) {
      message = 'Import successful';
    } else {
      message = 'Import failed';
    }
    alert(message);
  }

}
