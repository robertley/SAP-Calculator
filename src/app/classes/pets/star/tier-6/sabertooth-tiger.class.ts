import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SabertoothTiger extends Pet {
    name = "Sabertooth Tiger";
    tier = 6;
    pack: Pack = 'Star';
    attack = 4;
    health = 5;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let totalHurt = this.timesHurt;
        if (totalHurt > 0) {
            for (let i = 0; i < this.level; i++) { // 1/2/3 Mammoths based on level
                let mammothAttack = Math.min(2 * totalHurt, 50);
                let mammothHealth = Math.min(3 * totalHurt, 50);
                
                let mammoth = this.petService.createPet({
                    name: "Mammoth",
                    attack: mammothAttack,
                    health: mammothHealth,
                    equipment: null,
                    mana: 0,
                    exp: 0
                }, this.parent);

                let summonResult = this.parent.summonPet(mammoth, this.savedPosition, false, this);
                if (summonResult.success) {
                    this.logService.createLog({
                        message: `${this.name} summoned ${mammoth.name} (${mammothAttack}/${mammothHealth}).`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    });

                    this.abilityService.triggerFriendSummonedEvents(mammoth);
                }
            }
        }
        this.superAfterFaint(gameApi, tiger);
    }

    resetPet(): void {
        super.resetPet();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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