import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ant extends Pet {

    name = "Ant"
    tier = 1;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }

    faint(gameApi, tiger, pteranodon?: boolean) {
        let power: Power = this.level == 1 ? { health: 1, attack: 1 } :
            this.level == 2 ? { health: 2, attack: 2 } : { health: 3, attack: 3 };

        let boostPet = this.parent.getRandomPet([this], true);
        if (boostPet == null) {
            return;
        }
        boostPet.increaseAttack(power.attack);
        boostPet.increaseHealth(power.health);
        this.logService.createLog({
            message: `${this.name} gave ${boostPet.name} ${power.attack} attack and ${power.health} health.`,
            type: "ability",
            randomEvent: true,
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })

        this.superFaint(gameApi, tiger);
        this.done = true;
    }

}