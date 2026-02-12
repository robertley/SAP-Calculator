import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { AppComponent } from '../app.component';

@Component({
  selector: 'app-shell-battle-results',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './app-shell-battle-results.component.html',
})
export class AppShellBattleResultsComponent {
  @Input({ required: true }) app: AppComponent;
}
