import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { Ant } from "../classes/pets/turtle/tier-1/ant.class";
import { LogService } from "./log.servicee";
import { Player } from "../classes/player.class";
import { Equipment } from "../classes/equipment.class";
import { Cricket } from "../classes/pets/turtle/tier-1/cricket.class";
import { Fish } from "../classes/pets/turtle/tier-1/fish.class";
import { Horse } from "../classes/pets/turtle/tier-1/horse.class";
import { Mosquito } from "../classes/pets/turtle/tier-1/mosquito.class";
import { Duck } from "../classes/pets/turtle/tier-1/duck.class";
import { Beaver } from "../classes/pets/turtle/tier-1/beaver.class";
import { Otter } from "../classes/pets/turtle/tier-1/otter.class";
import { Pig } from "../classes/pets/turtle/tier-1/pig.class";
import { Mouse } from "../classes/pets/turtle/tier-1/mouse.class";
import { Snail } from "../classes/pets/turtle/tier-2/snail.class";
import { Crab } from "../classes/pets/turtle/tier-2/crab.class";
import { Swan } from "../classes/pets/turtle/tier-2/swan.class";
import { Rat } from "../classes/pets/turtle/tier-2/rat.class";
import { Hedgehog } from "../classes/pets/turtle/tier-2/hedgehog.class";
import { AbilityService } from "./ability.service";
import { Peacock } from "../classes/pets/turtle/tier-2/peacock.class";
import { Flamingo } from "../classes/pets/turtle/tier-2/flamingo.class";
import { Worm } from "../classes/pets/turtle/tier-2/worm.class";
import { Kangaroo } from "../classes/pets/turtle/tier-2/kangaroo.class";
import { Spider } from "../classes/pets/turtle/tier-2/spider.class";
import { Dodo } from "../classes/pets/turtle/tier-3/dodo.class";
import { Badger } from "../classes/pets/turtle/tier-3/badger.class";
import { Dolphin } from "../classes/pets/turtle/tier-3/dolphin.class";
import { Giraffe } from "../classes/pets/turtle/tier-3/giraffe.class";
import { Elephant } from "../classes/pets/turtle/tier-3/elephant.class";
import { Camel } from "../classes/pets/turtle/tier-3/camel.class";
import { Rabbit } from "../classes/pets/turtle/tier-3/rabbit.class";
import { Ox } from "../classes/pets/turtle/tier-3/ox.class";
import { Dog } from "../classes/pets/turtle/tier-3/dog.class";
import { Sheep } from "../classes/pets/turtle/tier-3/sheep.class";
import { GameService } from "./game.service";
import { Tiger } from "../classes/pets/turtle/tier-6/tiger.class";
import { Parrot } from "../classes/pets/turtle/tier-4/parrot.class";

@Injectable({
    providedIn: 'root'
})
export class PetService {

    turtlePackPets: Map<number, string[]> = new Map();
    // used for spider / stork
    // TODO configurable
    tier3Pets: string[];

    constructor(private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService
    ) {
        this.turtlePackPets.set(1,
            [
                "Ant",
                "Cricket",
                "Duck",
                "Fish",
                "Horse",
                "Mosquito",
                "Beaver",
                "Otter",
                "Pig",
                "Mouse",
            ]);
        this.turtlePackPets.set(2,
            [
                "Snail",
                "Crab",
                "Swan",
                "Rat",
                "Hedgehog",
                "Peacock",
                "Flamingo",
                "Worm",
                "Kangaroo",
                "Spider"
            ])
        this.turtlePackPets.set(3,
            [
                "Dodo",
                "Badger",
                "Dolphin",
                "Giraffe",
                "Elephant",
                "Camel",
                "Rabbit",
                "Ox",
                "Dog",
                "Sheep"
            ]);
        
        this.turtlePackPets.set(4,
            [
                "Parrot"
            ]);

        this.turtlePackPets.set(6,
            [
                "Tiger"
            ]);

        this.tier3Pets = this.turtlePackPets.get(3);
        this.gameService.setTierGroupPets(this.tier3Pets);
    }

    createPet(petForm: PetForm, parent: Player): Pet {
        switch(petForm.name) {
            case 'Ant':
                return new Ant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Cricket':
                return new Cricket(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Fish':
                return new Fish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Horse':
                return new Horse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mosquito':
                return new Mosquito(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Duck':
                return new Duck(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Beaver':
                return new Beaver(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Otter':
                return new Otter(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Pig':
                return new Pig(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mouse':
                return new Mouse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Snail':
                return new Snail(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Crab':
                return new Crab(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Swan':
                return new Swan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rat':
                return new Rat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Hedgehog':
                return new Hedgehog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Peacock':
                return new Peacock(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Flamingo':
                return new Flamingo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Worm':
                return new Worm(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Kangaroo':
                return new Kangaroo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Spider':
                return new Spider(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dodo':
                return new Dodo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Badger':
                return new Badger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dolphin':
                return new Dolphin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Giraffe':
                return new Giraffe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Elephant':
                return new Elephant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Camel':
                return new Camel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rabbit':
                return new Rabbit(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Ox':
                return new Ox(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dog':
                return new Dog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Sheep':
                return new Sheep(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        
            // tier 4
            case 'Parrot':
                return new Parrot(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);


            // tier 6
            case 'Tiger':
                return new Tiger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
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