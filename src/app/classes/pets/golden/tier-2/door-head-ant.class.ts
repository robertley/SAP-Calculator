import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class DoorHeadAnt extends Pet {
    name = "Door Head Ant";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 2;
    health = 2;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.pet0 != null) {
            return;
        }
        this.parent.pushPetToFront(this, true);
        this.logService.createLog({
            message: `${this.name} pushed itself to the front.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        let power = this.level * 4;
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })
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