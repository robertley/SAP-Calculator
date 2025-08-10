import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { SmallerSlime } from "../../hidden/smaller-slime.class";

export class Slime extends Pet {
    name = "Slime";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 3;
    health = 3;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let summons = Math.floor(this.battlesFought / 2);
        let power = this.level * 2;

        for (let i = 0; i < summons; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let slime = new SmallerSlime(this.logService, this.abilityService, this.parent, null, null, 0);
            
                    this.logService.createLog(
                        {
                            message: `${this.name} spawned Smaller Slime (${power}/${power}).`,
                            type: "ability",
                            player: this.parent,
                            tiger: tiger,
                            pteranodon: pteranodon
                        }
                    )
    
                    if (this.parent.summonPet(slime, this.savedPosition)) {
                        this.abilityService.triggerSummonedEvents(slime);
                    }
                },
                priority: this.attack
            })
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        battlesFought?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
        this.battlesFought = battlesFought;
    }
}