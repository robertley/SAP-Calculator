import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { PetService } from 'app/integrations/pet/pet.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { ItemSelectionDialogComponent } from '../item-selection-dialog/item-selection-dialog.component';
import { PetLevelSelectorComponent } from './sub-components/pet-level-selector.component';
import { PetStatsSelectorComponent } from './sub-components/pet-stats-selector.component';
import { PetEquipmentSelectorComponent } from './sub-components/pet-equipment-selector.component';
import { SwallowedPetSelectorComponent } from './sub-components/swallowed-pet-selector.component';
import { PetSelectorComponentBase } from './pet-selector.component.base';

@Component({
  selector: 'app-pet-selector',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule,
    ItemSelectionDialogComponent,
    PetLevelSelectorComponent,
    PetStatsSelectorComponent,
    PetEquipmentSelectorComponent,
    SwallowedPetSelectorComponent,
  ],
  templateUrl: './pet-selector.component.html',
  styleUrls: ['./pet-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PetSelectorComponent extends PetSelectorComponentBase {
  constructor(
    petService: PetService,
    equipmentService: EquipmentService,
    cdr: ChangeDetectorRef,
  ) {
    super(petService, equipmentService, cdr);
  }
}
