import { Directive } from '@angular/core';
import { PetSelectorComponentBehavior } from './pet-selector.component.behavior';

@Directive()
export class PetSelectorComponentBase extends PetSelectorComponentBehavior {}
