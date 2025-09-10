import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tuna extends Pet {
    name = "Tuna";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 5;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let totalHurt = this.timesHurt;
        for (let i = 0; i < totalHurt; i++) {
            const targetResp = this.parent.getRandomPet([this], true, false, true, this);

            if (targetResp.pet == null) {
                continue;
            }

            const buffAmount = this.level;

            this.logService.createLog({
                message: `${this.name} gave ${targetResp.pet.name} +${buffAmount} attack and +${buffAmount} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            targetResp.pet.increaseAttack(buffAmount);
            targetResp.pet.increaseHealth(buffAmount);
        }
        this.superFaint(gameApi, tiger);
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        timesHurt?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
        this.timesHurt = timesHurt ?? 0;
        this.originalTimesHurt = this.timesHurt;
    }
}