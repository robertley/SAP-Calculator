import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Flamingo extends Pet {
    name = "Flamingo";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 3;

    faint(gameApi, tiger) {
        let power: Power = {
            attack: this.level,
            health: this.level
        }
        let pets = this.parent.petArray;

        let index;
        for (let i in pets) {
            let pet = pets[+i]
            if (pet == this) {
                index = +i;
            }
        }
        let pet1;
        let pet2;
        for (let i = index; i < 5; i++) {
            let pet = pets[i];
            if (pet == null) {
                continue;
            }
            if (pet.health > 0) {
                if (pet1 == null) {
                    pet1 = pet;
                    continue;
                }
                pet2 = pet;
                break;
            }
        }
        if (pet1) {
            let boostPet = pet1;
            boostPet.increaseAttack(this.level);
            boostPet.increaseHealth(this.level);
            this.logService.createLog({
                message: `${this.name} gave ${boostPet.name} ${this.level} attack and ${this.level} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }
        if (pet2) {
            let boostPet = pet2;
            boostPet.increaseAttack(this.level);
            boostPet.increaseHealth(this.level);
            this.logService.createLog({
                message: `Flamingo gave ${boostPet.name} ${this.level} attack and ${this.level} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }

        super.superFaint(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}