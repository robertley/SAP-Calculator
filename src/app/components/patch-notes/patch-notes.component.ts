import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patch-notes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patch-notes.component.html',
  styleUrls: ['./patch-notes.component.scss'],
})
export class PatchNotesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
