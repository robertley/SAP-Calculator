import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RoyalFlycatcher extends Pet {
    name = "Royal Flycatcher";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 2;
    health = 4;
    enemyFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!tiger) {
            this.abilityCounter++;
        }
        
        if (this.abilityCounter % 3 != 0) {
            return;
        }
        this.abilityService.setCounterEvent({
            callback: () => {
                let power = this.level * 3;
                let targetResp = this.parent.opponent.getRandomPet([], null, true, null, this);
                let target = targetResp.pet;
                if (target == null) {
                    return;
                }
                this.snipePet(target, power, targetResp.random, tiger);
            },
            priority: this.attack,
            pet: this
        });
        this.superenemyFaints(gameApi, pet, tiger);
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