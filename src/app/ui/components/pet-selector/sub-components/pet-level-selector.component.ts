import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-level-selector',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
  template: `
    <ng-container [formGroup]="formGroup">
      <div class="col-12 d-flex level-bar-numbers mb-1">
        <span class="remove-exp spacer" [style.visibility]="showRemoveExp() ? 'visible' : 'hidden'"></span>
        <div class="level-slots-labels d-flex flex-grow-1">
          <span class="level-icon">
            <img
              ngSrc="assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/l1.png"
              width="18"
              height="18"
              loading="lazy"
              decoding="async"
              alt="Level 1"
            />
          </span>
          <span></span>
          <span class="level-icon">
            <img
              ngSrc="assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/l2.png"
              width="18"
              height="18"
              loading="lazy"
              decoding="async"
              alt="Level 2"
            />
          </span>
          <span></span>
          <span class="level-icon level-3">
            <img
              ngSrc="assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/l3.png"
              width="18"
              height="18"
              loading="lazy"
              decoding="async"
              alt="Level 3"
            />
          </span>
        </div>
      </div>
      <div class="col-12 d-flex level-bar mb-2">
        <span (click)="setExp(0)" class="remove-exp" [style.visibility]="showRemoveExp() ? 'visible' : 'hidden'"
          >x</span
        >
        <span (click)="setExp(1)" [class.selected]="getIsSelected(1)"></span>
        <span (click)="setExp(2)" [class.selected]="getIsSelected(1) && getIsSelected(2)"></span>
        <span (click)="setExp(3)" [class.selected]="getIsSelected(1) && getIsSelected(3)"></span>
        <span (click)="setExp(4)" [class.selected]="getIsSelected(1) && getIsSelected(4)"></span>
        <span (click)="setExp(5)" [class.selected]="getIsSelected(1) && getIsSelected(5)"></span>
      </div>
    </ng-container>
  `,
  styleUrls: ['../pet-selector.component.scss'],
  host: { style: 'display: contents' },
})
export class PetLevelSelectorComponent {
  @Input() formGroup!: FormGroup;

  setExp(amt: number) {
    this.formGroup.get('exp')?.setValue(amt);
  }

  getIsSelected(amt: number) {
    return (this.formGroup.get('exp')?.value ?? 0) >= amt;
  }

  showRemoveExp() {
    return (this.formGroup.get('exp')?.value ?? 0) > 0;
  }
}
