import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RockhopperPenguin extends Pet {
    name = "Rockhopper Penguin";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 2;
    health = 5;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (this.parent.pet0 != null) {
            return;
        }

        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} jumps to the front!`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // The 'true' argument triggers the 'friendJumped' event.
        this.parent.pushPetToFront(target, true);

        const trumpetsGained = this.level * 12;
        this.parent.gainTrumpets(trumpetsGained, this);

        this.abilityUses++;
        
        this.superEmptyFrontSpace(gameApi, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 1;
    }
}