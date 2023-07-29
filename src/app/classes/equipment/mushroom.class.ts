import { LogService } from "../../services/log.servicee";
import { Equipment, EquipmentClass } from "../equipment.class";
import { Pet } from "../pet.class";
import { Ant } from "../pets/turtle/tier-1/ant.class";
import { Bee } from "../pets/hidden/bee.class";
import { Cricket } from "../pets/turtle/tier-1/cricket.class";
import { Fish } from "../pets/turtle/tier-1/fish.class";
import { Horse } from "../pets/turtle/tier-1/horse.class";
import { Mosquito } from "../pets/turtle/tier-1/mosquito.class";
import { ZombieCricket } from "../pets/hidden/zombie-cricket.class";
import { Duck } from "../pets/turtle/tier-1/duck.class";
import { Beaver } from "../pets/turtle/tier-1/beaver.class";
import { Otter } from "../pets/turtle/tier-1/otter.class";
import { Pig } from "../pets/turtle/tier-1/pig.class";
import { Mouse } from "../pets/turtle/tier-1/mouse.class";
import { Crab } from "../pets/turtle/tier-2/crab.class";
import { Swan } from "../pets/turtle/tier-2/swan.class";
import { Rat } from "../pets/turtle/tier-2/rat.class";
import { Hedgehog } from "../pets/turtle/tier-2/hedgehog.class";
import { AbilityService } from "../../services/ability.service";
import { Peacock } from "../pets/turtle/tier-2/peacock.class";
import { Flamingo } from "../pets/turtle/tier-2/flamingo.class";
import { Worm } from "../pets/turtle/tier-2/worm.class";
import { Kangaroo } from "../pets/turtle/tier-2/kangaroo.class";
import { Spider } from "../pets/turtle/tier-2/spider.class";
import { Dodo } from "../pets/turtle/tier-3/dodo.class";
import { Badger } from "../pets/turtle/tier-3/badger.class";
import { Dolphin } from "../pets/turtle/tier-3/dolphin.class";
import { Giraffe } from "../pets/turtle/tier-3/giraffe.class";
import { Elephant } from "../pets/turtle/tier-3/elephant.class";
import { Camel } from "../pets/turtle/tier-3/camel.class";
import { Rabbit } from "../pets/turtle/tier-3/rabbit.class";
import { Ox } from "../pets/turtle/tier-3/ox.class";
import { Dog } from "../pets/turtle/tier-3/dog.class";
import { Sheep } from "../pets/turtle/tier-3/sheep.class";
import { PetService } from "../../services/pet.service";
import { Tiger } from "../pets/turtle/tier-6/tiger.class";
import { Parrot } from "../pets/turtle/tier-4/parrot.class";

export class Mushroom extends Equipment {
    name = 'Mushroom';
    equipmentClass = 'faint' as EquipmentClass;
    callback = (pet: Pet) => {
        let newPet;
        if (pet instanceof Ant) {
            newPet = new Ant(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Bee) {
            newPet = new Bee(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Cricket) {
            newPet = new Cricket(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Fish) {
            newPet = new Fish(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Horse) {
            newPet = new Horse(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Mosquito) {
            newPet = new Mosquito(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof ZombieCricket) {
            newPet = new ZombieCricket(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Duck) {
            newPet = new Duck(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Beaver) {
            newPet = new Beaver(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Otter) {
            newPet = new Otter(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Pig) {
            newPet = new Pig(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Mouse) {
            newPet = new Mouse(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Crab) {
            newPet = new Crab(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Swan) {
            newPet = new Swan(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Rat) {
            newPet = new Rat(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Hedgehog) {
            newPet = new Hedgehog(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Peacock) {
            newPet = new Peacock(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Flamingo) {
            newPet = new Flamingo(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Worm) {
            newPet = new Worm(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Kangaroo) {
            newPet = new Kangaroo(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Spider) {
            newPet = new Spider(this.logService, this.abilityService, this.petService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Dodo) {
            newPet = new Dodo(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Badger) {
            newPet = new Badger(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Dolphin) {
            newPet = new Dolphin(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Giraffe) {
            newPet = new Giraffe(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Elephant) {
            newPet = new Elephant(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Camel) {
            newPet = new Camel(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Rabbit) {
            newPet = new Rabbit(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Ox) {
            newPet = new Ox(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Dog) {
            newPet = new Dog(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        if (pet instanceof Sheep) {
            newPet = new Sheep(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }
        
        // tier 4
        if (pet instanceof Parrot) {
            newPet = new Parrot(this.logService, this.abilityService, this.petService, pet.parent, 1, 1, levelToExp(pet.level));
        }

        // tier 6
        if (pet instanceof Tiger) {
            newPet = new Tiger(this.logService, this.abilityService, pet.parent, 1, 1, levelToExp(pet.level));
        }

        this.abilityService.setSpawnEvent({
            callback: () => {
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${newPet.name} (${newPet.level}) (Mushroom)`,
                        type: "ability",
                        player: pet.parent
                    }
                )
        
                if (pet.parent.spawnPet(newPet, pet.savedPosition)) {
                    this.abilityService.triggerSummonedEvents(newPet);
                }
            },
            priority: -1
        })
        
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService
    ) {
        super()
    }
}

function levelToExp(level: number) {
    return level == 1 ? 0 : level == 2 ? 2 : 5;
}