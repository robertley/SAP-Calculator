import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class VampireBat extends Pet {
    name = "Vampire Bat";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 5;
    enemyGainedAilment(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 3;
        let petHealthPreSnipe = pet.health;
        let damage = this.snipePet(pet, power, false, tiger);
        let healthGained = Math.min(damage, petHealthPreSnipe);
        this.logService.createLog({
            message: `${this.name} gained ${healthGained} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        this.increaseHealth(healthGained);

        this.superEnemyGainedAilment(gameApi, pet, tiger);
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