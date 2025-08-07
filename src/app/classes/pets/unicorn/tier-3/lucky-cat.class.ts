import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class LuckyCat extends Pet {
    name = "Lucky Cat";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    anyoneLevelUp(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet != this) {
            return;
        }

        let power = 2;

        if (this.level == 3) {
            power = 4;
        }

        this.logService.createLog({
            message: `${this.name} gained ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.increaseAttack(power);
        this.increaseHealth(power);

        this.superAnyoneLevelUp(gameApi, pet, tiger);
    }
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
}