import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatchNotesListComponent } from './patch-notes-list.component';

@Component({
  selector: 'app-patch-notes',
  standalone: true,
  imports: [CommonModule, PatchNotesListComponent],
  templateUrl: './patch-notes.component.html',
  styleUrls: ['./patch-notes.component.scss'],
})
export class PatchNotesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
