import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Player } from '../../classes/player.class';
import { Pet } from '../../classes/pet.class';
import { PetService } from '../../services/pet.service';
import { EquipmentService } from '../../services/equipment.service';
import { Equipment } from '../../classes/equipment.class';
import { cloneDeep } from 'lodash';

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
  opponent: Player;
  @Input()
  index: number;
  @Input()
  angler: boolean;
  @Input()
  formGroup: FormGroup;

  equipment: Map<string, Equipment>;
  turtlePackPets: string[];
  pets: Map<number, string[]>;

  showFlyOut = false;

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
    this.pets = this.getPack(this.player);
    if (!this.angler) {
      return;
    }
    if (this.player.pack == this.opponent.pack) {
      return;
    }
    let opponentPack = this.getPack(this.opponent);
    for (let [tier, pets] of opponentPack) {
      this.pets.get(tier).push(...pets);
    }
  }

  getPack(player: Player) {
    let pack;
    if (player.pack == 'Turtle') {
      pack = this.petService.turtlePackPets;
    } else if (player.pack == 'Puppy') {
      pack = this.petService.puppyPackPets;
    } else if (player.pack == 'Star') {
      pack = this.petService.starPackPets;
    } else if (player.pack == 'Golden') {
      pack = this.petService.goldenPackPets;
    }
    return cloneDeep(pack);
  }

  initEquipment() {
    this.equipment = this.equipmentService.getInstanceOfAllEquipment();
  }

  initForm() {
    // this.formGroup = new FormGroup({
    //   name: new FormControl(this.pet?.name),
    //   attack: new FormControl(this.pet?.attack),
    //   health: new FormControl(this.pet?.health),
    //   exp: new FormControl(this.pet?.exp),
    //   equipment: new FormControl(this.pet?.equipment),
    //   belugaSwallowedPet: new FormControl(this.pet?.belugaSwallowedPet)
    // })

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
    this.formGroup.get('belugaSwallowedPet').valueChanges.subscribe((value) => { this.setBelugaSwallow(value) });
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

  setBelugaSwallow(value: string) {
    let pet = this.player.getPet(this.index);
    pet.belugaSwallowedPet = value;
    console.log(pet)
  }

  showFlyOutButton() {
    return this.formGroup.get('name').value == 'Beluga Whale'
  }

  toggleFlyOut() {
    this.showFlyOut = !this.showFlyOut;
  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('attack').setValue(null, {emitEvent: false});
    this.formGroup.get('health').setValue(null, {emitEvent: false});
    this.formGroup.get('exp').setValue(0, {emitEvent: false});
  }


}
