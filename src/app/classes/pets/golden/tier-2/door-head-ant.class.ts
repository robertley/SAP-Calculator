import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
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
        this.parent.pushPetToFront(this);
        this.logService.createLog({
            message: `${this.name} pushed itself to the front.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        let power = this.level * 4;
        this.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gained ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}