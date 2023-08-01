import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Player } from '../../classes/player.class';
import { Pet } from '../../classes/pet.class';
import { PetService } from '../../services/pet.service';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../classes/equipment.class';

@Component({
  selector: 'app-pet-selector',
  templateUrl: './pet-selector.component.html',
  styleUrls: ['./pet-selector.component.scss']
})
export class PetSelectorComponent implements OnInit {

  @Input()
  pet: Pet;
  @Input()
  player: Player;
  @Input()
  index: number;

  formGroup: FormGroup;
  equipment: Map<string, Equipment>;
  turtlePackPets: string[];
  pets: Map<number, string[]>;


  constructor(private petService: PetService, private equipmentService: EquipmentService) {

  }

  ngOnInit(): void {
    this.initSelector();    
  }

  initSelector() {
    this.initPets();
    this.initEquipment();
    this.initForm();
  }

  initPets() {
    if (this.player.pack == 'Turtle') {
      this.pets = this.petService.turtlePackPets;
    } else if (this.player.pack == 'Puppy') {
      this.pets = this.petService.puppyPackPets;
    }
  }

  initEquipment() {
    this.equipment = this.equipmentService.getInstanceOfAllEquipment();
  }

  initForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.pet?.name),
      attack: new FormControl(this.pet?.attack),
      health: new FormControl(this.pet?.health),
      exp: new FormControl(this.pet?.exp),
      equipment: new FormControl(this.pet?.equipment)
    })

    this.formGroup.get('name').valueChanges.subscribe((value) => {
      if (value == null) {
        this.removePet();
        return;
      }
      this.substitutePet(true)
    });
    this.formGroup.get('attack').valueChanges.subscribe(() => { this.substitutePet(false) });
    this.formGroup.get('health').valueChanges.subscribe(() => { this.substitutePet(false) });
    this.formGroup.get('exp').valueChanges.subscribe(() => { this.substitutePet(false) });
    this.formGroup.get('equipment').valueChanges.subscribe(() => { this.substitutePet(false) });
  }

  setExp(amt: number) {
    this.formGroup.get('exp').setValue(amt);
  }

  getIsSelected(amt: number) {
    return this.formGroup.get('exp').value >= amt;
  }

  showRemoveExp() {
    return this.formGroup.get('exp').value > 0;
  }

  substitutePet(nameChange = false) {
    setTimeout(() => {
      let formValue = this.formGroup.value;
      if (nameChange) {
        formValue.attack = null;
        formValue.health = null;
      }
      let pet = this.petService.createPet(formValue, this.player);
      this.player.setPet(this.index, pet, true);
  
      console.log('pet substituted', this.player);
      if (nameChange) {
        this.formGroup.get('attack').setValue(pet.attack, {emitEvent: false});
        this.formGroup.get('health').setValue(pet.health, {emitEvent: false});
      }
    })

  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('attack').setValue(null, {emitEvent: false});
    this.formGroup.get('health').setValue(null, {emitEvent: false});
    this.formGroup.get('exp').setValue(0, {emitEvent: false});
  }


}
