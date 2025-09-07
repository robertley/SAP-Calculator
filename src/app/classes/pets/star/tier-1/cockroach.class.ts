import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SummonedCockroach } from "../../hidden/summoned-cockroach.class"; 


export class Cockroach extends Pet {
    name = "Cockroach";
    tier = 1;
    pack: Pack = 'Star';
    attack = 1;
    health = 1;

    afterfaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const expToGain = this.level;
        
        const newCockroach = new SummonedCockroach(this.logService, this.abilityService, this.parent, 1, 1, 0, 0);

        let summonResult = this.parent.summonPet(newCockroach, this.savedPosition, false, this);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${this.name} summoned a 1/1 Cockroach.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            });

            let targetRespt = this.parent.getThis(newCockroach)
            targetRespt.pet.increaseExp(expToGain);
            this.logService.createLog({
                message: `${this.name} gave ${targetRespt.pet.name} +${expToGain} exp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetRespt.random
            });

            this.abilityService.triggerFriendSummonedEvents(newCockroach);
        }

        this.superAfterFaint(gameApi, tiger);
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