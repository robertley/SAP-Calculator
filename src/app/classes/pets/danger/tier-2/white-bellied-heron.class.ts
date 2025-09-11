import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { MeatBone } from "../../../equipment/turtle/meat-bone.class";

export class WhiteBelliedHeron extends Pet {
    name = "White-Bellied Heron";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 4;
    health = 2;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetResp = this.parent.nearestPetsAhead(1, this);
        if (targetResp.pets.length == 0) {
            return;
        }
        let pet = targetResp.pets[0];
        
        let equipment = new MeatBone();
        equipment.multiplier += this.level - 1;
        pet.givePetEquipment(equipment);
        let effectMessage = ".";
        if (this.level === 2) {
            effectMessage = " twice for double effect.";
        } else if (this.level === 3) {
            effectMessage = " thrice for triple effect.";
        }

        this.logService.createLog({
            message: `${this.name} made ${pet.name} Meat Bone${effectMessage}`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });
    
        this.superStartOfBattle(gameApi, tiger);
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