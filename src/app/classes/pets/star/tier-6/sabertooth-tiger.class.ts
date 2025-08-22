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
    timesHurt = 0;
    private hurtThisBattle = this.timesHurt;

    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        this.hurtThisBattle++;
        this.superHurt(gameApi, pet, tiger);
    }

    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let totalHurt = this.hurtThisBattle;
        if (totalHurt > 0) {
            for (let i = 0; i < this.level; i++) { // 1/2/3 Mammoths based on level
                let mammothAttack = 4 + (2 * totalHurt);
                let mammothHealth = 12 + (3 * totalHurt);
                
                let mammoth = this.petService.createPet({
                    name: "Mammoth",
                    attack: mammothAttack,
                    health: mammothHealth,
                    equipment: null,
                    mana: 0,
                    exp: 0
                }, this.parent);

                this.logService.createLog({
                    message: `${this.name} summoned ${mammoth.name} (${mammothAttack}/${mammothHealth}).`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger
                });

                if (this.parent.summonPet(mammoth, this.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(mammoth);
                }
            }
        }
        this.superAfterFaint(gameApi, tiger);
    }

    resetPet(): void {
        this.hurtThisBattle = this.timesHurt;
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
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}