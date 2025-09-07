import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class DropBear extends Pet {
    name = "Drop Bear";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 2;
    // TODO check tiger interaction
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.pet0 != null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} pushed itself to the front.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.parent.pushPetToFront(this, true);
        let power = this.level * 3;
        let targetResp = this.parent.opponent.getLastPet();
        if (targetResp.pet == null) {
            return;
        }
        this.snipePet(targetResp.pet, power, targetResp.random, tiger);

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