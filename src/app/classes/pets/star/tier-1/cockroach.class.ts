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

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const expToGain = this.level;
        
        const newCockroach = new SummonedCockroach(this.logService, this.abilityService, this.parent, 1, 1, 0, 0);

        this.logService.createLog({
            message: `${this.name} fainted and summoned a 1/1 Cockroach.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        if (this.parent.summonPet(newCockroach, this.savedPosition)) {
            this.logService.createLog({
                message: `The summoned ${newCockroach.name} gained +${expToGain} experience.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
            newCockroach.increaseExp(expToGain);
            
            this.abilityService.triggerFriendSummonedEvents(newCockroach);
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
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}