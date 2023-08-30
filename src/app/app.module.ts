import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PetSelectorComponent } from './components/pet-selector/pet-selector.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatchNotesComponent } from './components/patch-notes/patch-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    PetSelectorComponent,
    PatchNotesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
