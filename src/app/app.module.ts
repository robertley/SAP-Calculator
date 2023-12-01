import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PetSelectorComponent } from './components/pet-selector/pet-selector.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatchNotesComponent } from './components/patch-notes/patch-notes.component';
import { CustomPackEditorComponent } from './components/custom-pack-editor/custom-pack-editor.component';
import { CustomPackFormComponent } from './components/custom-pack-editor/custom-pack-form/custom-pack-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { InfoComponent } from './components/info/info.component';
import { ImportCalculatorComponent } from './components/import-calculator/import-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    PetSelectorComponent,
    PatchNotesComponent,
    CustomPackEditorComponent,
    CustomPackFormComponent,
    InfoComponent,
    ImportCalculatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
