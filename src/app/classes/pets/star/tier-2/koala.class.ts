import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Eucalyptus } from "../../../equipment/puppy/eucalyptus.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Koala extends Pet {
    name = "Koala";
    tier = 2;
    pack: Pack = 'Star';
    attack = 3;
    health = 3;
    abilityUses = 0;
    maxAbilityUses = 0;

    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet === this || this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${target.name} Eucalyptus perk.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.givePetEquipment(new Eucalyptus());

        this.abilityUses++;
        this.superFriendHurt(gameApi, pet, tiger);
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
        this.maxAbilityUses = this.level;
        this.abilityUses = 0;
    }
}