import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-teamwood-import',
  templateUrl: './teamwood-import.component.html',
  styleUrls: ['./teamwood-import.component.scss']
})
export class TeamwoodImportComponent {
  @Output() importData = new EventEmitter<any>();

  importForm = new FormGroup({
    jsonData: new FormControl('')
  });

  onSubmit() {
    try {
      const parsedData = JSON.parse(this.importForm.get('jsonData').value);
      this.importData.emit(parsedData);
    } catch (error) {
      console.error('Invalid JSON data', error);
      // Handle error (e.g., show an error message to the user)
    }
  }
}