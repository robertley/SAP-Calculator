import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { AppComponent } from '../app.component';

@Component({
  selector: 'app-shell-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './app-shell-controls.component.html',
})
export class AppShellControlsComponent {
  @Input({ required: true }) app: AppComponent;
}
