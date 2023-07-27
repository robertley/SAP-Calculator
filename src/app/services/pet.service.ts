import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { Ant } from "../classes/pets/ant.class";
import { LogService } from "./log.servicee";
import { Cricket } from "../classes/pets/cricket.class";
import { Fish } from "../classes/pets/fish.class";
import { Horse } from "../classes/pets/horse.class";
import { Mosquito } from "../classes/pets/mosquito.class";
import { FaintService } from "./faint.service";
import { Player } from "../classes/player.class";
import { SummonedService } from "./summoned.service";
import { Equipment } from "../classes/equipment.class";

@Injectable({
    providedIn: 'root'
})
export class PetService {

    constructor(private logService: LogService,
        private faintService: FaintService,
        private summonedService: SummonedService
    ) {}

    createPet(petForm: PetForm, parent: Player): Pet {
        switch(petForm.name) {
            case 'Ant':
                return new Ant(this.logService, this.faintService, this.summonedService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Cricket':
                return new Cricket(this.logService, this.faintService, this.summonedService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Fish':
                return new Fish(this.logService, this.faintService, this.summonedService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Horse':
                return new Horse(this.logService, this.faintService, this.summonedService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mosquito':
                return new Mosquito(this.logService, this.faintService, this.summonedService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        }
    }
}

export interface PetForm {
    name: string;
    attack: number;
    health: number;
    exp: number;
    equipment: Equipment;
}