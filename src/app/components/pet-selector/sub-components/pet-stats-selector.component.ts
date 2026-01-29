import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-stats-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <!-- Tuna specific -->
      <div class="col-12 mb-2" *ngIf="petName === 'Tuna'">
        <label for="timesHurt">Times Hurt</label>
        <input
          class="form-control"
          formControlName="timesHurt"
          type="number"
          min="0"
          max="99"
        />
      </div>

      <!-- Friends Died (Vulture etc.) -->
      <div class="col-12 mb-2" *ngIf="shouldShowFriendsDiedInput()">
        <label class="swallowed-label" for="friendsDiedBeforeBattle"
          >Friends Fainted in Shop</label
        >
        <input
          class="form-control"
          type="number"
          min="0"
          max="5"
          formControlName="friendsDiedBeforeBattle"
        />
      </div>

      <!-- Mana and Triggers -->
      <ng-container *ngIf="mana || triggersConsumed">
        <div class="col-12" *ngIf="mana && !triggersConsumed">
          <div class="stat-tile stat-mana">
            <input
              class="form-control stat-input select-mana"
              formControlName="mana"
              type="number"
              min="0"
              max="50"
              placeholder="Mana"
            />
          </div>
        </div>
        <div class="col-12" *ngIf="!mana && triggersConsumed">
          <input
            class="form-control select-triggers-consumed single-stat-input"
            formControlName="triggersConsumed"
            type="number"
            min="0"
            max="10"
            placeholder="Triggers Consumed"
          />
        </div>
        <ng-container *ngIf="mana && triggersConsumed">
          <div class="col-6">
            <div class="stat-tile stat-mana">
              <input
                class="form-control stat-input select-mana"
                formControlName="mana"
                type="number"
                min="0"
                max="50"
                placeholder="Mana"
              />
            </div>
          </div>
          <div class="col-6">
            <input
              class="form-control select-triggers-consumed"
              formControlName="triggersConsumed"
              type="number"
              min="0"
              max="10"
              placeholder="Triggers Consumed"
            />
          </div>
        </ng-container>
      </ng-container>

      <!-- Attack and Health -->
      <div class="col-6">
        <div class="stat-tile stat-attack">
          <input
            class="form-control stat-input select-attack"
            formControlName="attack"
            type="number"
            min="1"
            [max]="attackHealthMax"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="stat-tile stat-health">
          <input
            class="form-control stat-input select-health"
            formControlName="health"
            type="number"
            min="1"
            [max]="attackHealthMax"
          />
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['../pet-selector.component.scss'],
  host: { style: 'display: contents' },
})
export class PetStatsSelectorComponent {
  @Input() formGroup!: FormGroup;
  @Input() petName: string | null = null;
  @Input() mana = false;
  @Input() triggersConsumed = false;
  @Input() attackHealthMax = 100;

  private friendsDiedCaps = new Map<string, number>([
    ['Vulture', 1],
    ['Saiga Antelope', 1],
    ['Secretary Bird', 1],
    ['Mimic', 2],
  ]);

  shouldShowFriendsDiedInput(): boolean {
    return this.petName ? this.friendsDiedCaps.has(this.petName) : false;
  }

  getFriendsDiedMax(): number {
    return this.petName ? (this.friendsDiedCaps.get(this.petName) ?? 5) : 5;
  }
}
