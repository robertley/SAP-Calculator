import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Orca extends Pet {
    name = "Orca";
    tier = 6;
    pack: Pack = 'Star';
    attack = 4;
    health = 8;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            let faintPet = this.petService.getRandomFaintPet(this.parent);
    
            this.logService.createLog(
                {
                    message: `${this.name} spawned ${faintPet.name}.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    randomEvent: true,
                    pteranodon: pteranodon
                }
            )

            if (this.parent.summonPet(faintPet, this.savedPosition)) {
                this.abilityService.triggerFriendSummonedEvents(faintPet);
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