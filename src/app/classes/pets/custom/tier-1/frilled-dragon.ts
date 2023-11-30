import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class FrilledDragon extends Pet {
    name = "Frilled Dragon";
    tier = 1;
    pack: Pack = 'Custom';
    attack = 1;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = 0;
        for (let pet of this.parent.petArray) {
            if (pet === this) {
                continue
            }
            if (pet.faint != null) {
                power++;
            }
        }
        power *= this.level;
        this.increaseAttack(power);
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
    }
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
}