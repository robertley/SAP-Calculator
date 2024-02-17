import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';
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
  allPets: boolean;
  @Input()
  mana: boolean;
  @Input()
  formGroup: FormGroup;
  @Input()
  customPacks: AbstractControl;//FormArray;

  equipment: Map<string, Equipment>;
  turtlePackPets: string[];
  pets: Map<number, string[]>;
  startOfBattlePets: Map<number, string[]>;

  showFlyOut = false;
  attackHealthMax = 50;

  @Input()
  showTokenPets = false;
  tokenPets: string[] = [
    'Bee',
    'Bus',
    'Chick',
    'Dirty Rat',
    'Lizard Tail',
    'Ram',
    'Smaller Slug',
    'Smallest Slug',
    'Zombie Cricket',
    'Zombie Fly',
    'Chim-Goat',
    'Chim-Lion',
    'Chim-Snake',
    'Daycrawler',
    'Head',
    'Monty',
    'Nessie?',
    'Smaller Slime',
    'Young Phoenix',
    'Good Dog',
  ];

  constructor(private petService: PetService, private equipmentService: EquipmentService) {

  }

  ngOnInit(): void {
    this.initSelector();

    this.fixLoadEquipment();

    if (this.pet?.name == 'Behemoth') {
      this.attackHealthMax = 100;
    }
  }

  initSelector() {
    this.initPets();
    this.initEquipment();
    this.initForm();
  }

  initPets() {
    this.pets = new Map();
    for (let i = 1; i <= 6; i++) {
      this.pets.set(i, []);
    }
    for (let [tier, pets] of this.petService.turtlePackPets) {
      this.pets.get(tier).push(...pets);
    }
    for (let [tier, pets] of this.petService.puppyPackPets) {
      this.pets.get(tier).push(...pets);
    }
    for (let [tier, pets] of this.petService.starPackPets) {
      this.pets.get(tier).push(...pets);
    }
    for (let [tier, pets] of this.petService.goldenPackPets) {
      this.pets.get(tier).push(...pets);
    }
    for (let [tier, pets] of this.petService.unicornPackPets) {
      this.pets.get(tier).push(...pets);
    }
    for (let [tier, pets] of this.petService.customPackPets) {
      this.pets.get(tier).push(...pets);
    }
    // remove duplicates from each tier
    for (let [tier, pets] of this.pets) {
      this.pets.set(tier, [...new Set(pets)]);
    }

    this.initStartOfBattlePets();

    console.log('pets', this.pets);
  }

  initStartOfBattlePets() {
    this.startOfBattlePets = new Map();
    for (let i = 1; i <= 6; i++) {
      let SOBpets = [];
      for (let pet of this.pets.get(i)) {
        if (this.petService.startOfBattlePets.includes(pet)) {
          SOBpets.push(pet);
        }
      }
      this.startOfBattlePets.set(i, SOBpets);
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
    } else if (player.pack == 'Unicorn') {
      pack = this.petService.unicornPackPets;
    } else {
      try {
        pack = this.buildCustomPack(player.pack)
      } catch {
        pack = this.petService.turtlePackPets;
      }
    }

    // console.log('pack', pack);
    return cloneDeep(pack);
  }

  buildCustomPack(name: string) {
    // find customPack with name
    let customPack;
    for (let pack of (this.customPacks as FormArray).controls) {
      if (pack.get('name').value == name) {
        customPack = pack;
        break;
      }
    }
    let pack = new Map<number, string[]>();
    for (let i = 1; i <= 6; i++) {
      pack.set(i, customPack.get(`tier${i}Pets`).value);
    }
    return pack;
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
    this.formGroup.get('equipment').valueChanges.subscribe((value) => {
      if (value != null && value.reset == null) {
        let equipment = this.equipment.get(value.name);
        this.formGroup.get('equipment').setValue(equipment, {emitEvent: false});
      }
      this.substitutePet(false)
    });
    this.formGroup.get('belugaSwallowedPet').valueChanges.subscribe((value) => { this.setBelugaSwallow(value) });
    this.formGroup.get('abominationSwallowedPet1').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet2').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('abominationSwallowedPet3').valueChanges.subscribe((value) => { this.setSwallowedPets(value) });
    this.formGroup.get('mana').valueChanges.subscribe(() => { this.substitutePet(false) });
    this.formGroup.get('battlesFought').valueChanges.subscribe((value) => { this.setBattlesFought(value) });
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
        formValue.mana = null;
      }
      let equipment = formValue.equipment;
      if (equipment != null) {
        formValue.equipment = this.equipment.get(equipment.name);
      }

      let pet = this.petService.createPet(formValue, this.player);
      this.player.setPet(this.index, pet, true);
  
      // console.log('pet substituted', this.player);
      if (nameChange) {
        this.formGroup.get('attack').setValue(pet.attack, {emitEvent: false});
        this.formGroup.get('health').setValue(pet.health, {emitEvent: false});
        this.formGroup.get('mana').setValue(pet.mana, {emitEvent: false});
      }

      if (this.formGroup.get('name').value == 'Behemoth') {
        this.attackHealthMax = 100;
      } else {
        this.attackHealthMax = 50;
      }
    })

  }

  setBelugaSwallow(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.belugaSwallowedPet = value;
  }

  setSwallowedPets(value: string) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    let swallowedPets = [];
    if (this.formGroup.get('abominationSwallowedPet1').value != null) {
      swallowedPets.push(this.formGroup.get('abominationSwallowedPet1').value);
    }
    if (this.formGroup.get('abominationSwallowedPet2').value != null) {
      swallowedPets.push(this.formGroup.get('abominationSwallowedPet2').value);
    }
    if (this.formGroup.get('abominationSwallowedPet3').value != null) {
      swallowedPets.push(this.formGroup.get('abominationSwallowedPet3').value);
    }
    console.log(swallowedPets)
    pet.abominationSwallowedPet1 = swallowedPets[0];
    pet.abominationSwallowedPet2 = swallowedPets[1];
    pet.abominationSwallowedPet3 = swallowedPets[2];
  }

  setBattlesFought(value: number) {
    let pet = this.player.getPet(this.index);
    if (pet == null) {
      return;
    }
    pet.battlesFought = value;
  }

  showFlyOutButton() {
    let flyOutPets = ['Beluga Whale', 'Abomination', 'Slime'];
    return flyOutPets.includes(this.formGroup.get('name').value);
  }

  toggleFlyOut() {
    this.showFlyOut = !this.showFlyOut;
  }

  removePet() {
    this.player.setPet(this.index, null, true);
    this.formGroup.get('name').setValue(null, {emitEvent: false});
    this.formGroup.get('attack').setValue(0, {emitEvent: false});
    this.formGroup.get('health').setValue(0, {emitEvent: false});
    this.formGroup.get('exp').setValue(0, {emitEvent: false});
    this.formGroup.get('equipment').setValue(null, {emitEvent: false});
    this.formGroup.get('mana').setValue(0, {emitEvent: false});
  }

  optionHidden(option: string) {

    if (this.allPets) {
      return false;
    }

    let pack = this.getPack(this.player);
    for (let [tier, pets] of pack) {
      if (pets.includes(option)) {
        return false;
      }
    }
    if (this.angler) {
      let pack = this.getPack(this.opponent);
      for (let [tier, pets] of pack) {
        if (pets.includes(option)) {
          return false;
        }
      }
    }

    if (this.player.getPet(this.index)?.name == option) {
      return false;
    }

    return true;
  }


  fixLoadEquipment() {
    let equipment = this.formGroup.get('equipment').value;
    if (equipment == null) {
      return;
    }
    this.formGroup.get('equipment').setValue(this.equipment.get(equipment.name));
  }


}
