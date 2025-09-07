import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    faint(gameApi, tiger, pteranodon?: boolean) {
        let power: Power = this.level == 1 ? { health: 1, attack: 1 } :
            this.level == 2 ? { health: 2, attack: 2 } : { health: 3, attack: 3 };

        let boostResp = this.parent.getRandomPet([this], true, false, true, this);
        if (boostResp.pet == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${boostResp.pet.name} ${power.attack} attack and ${power.health} health.`,
            type: "ability",
            randomEvent: boostResp.random,
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        })

        boostResp.pet.increaseAttack(power.attack);
        boostResp.pet.increaseHealth(power.health);

        this.superFaint(gameApi, tiger);
        this.done = true;
    }

}