import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Orangutang } from "../../star/tier-4/orangutang.class";
import { PetService } from "../../../../services/pet.service";

export class Wolf extends Pet {
    name = "Wolf";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 4;
    health = 4;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power: Power = {
            attack: this.level * 3,
            health: this.level * 2
        }
        for (let i = 0; i < 3; i++) {
            let pig = this.petService.createPet({
                attack: power.attack,
                equipment: null,
                exp: this.minExpForLevel,
                health: power.health,
                name: 'Pig',
                mana: 0
            }, this.parent);
    
            this.logService.createLog(
                {
                    message: `${this.name} spawned ${pig.name} ${power.attack}/${power.health}`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                }
            )

            if (this.parent.summonPet(pig, this.savedPosition)) {
                this.abilityService.triggerFriendSummonedEvents(pig);
            }
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
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