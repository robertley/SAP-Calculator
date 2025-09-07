import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Melon } from "../../../equipment/turtle/melon.class";

export class Crane extends Pet {
    name = "Crane";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 6;
    health = 5;
    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet != this.petAhead) {
            return;
        }

        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let attackTargetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (attackTargetsAheadResp.pets.length == 0) {
            return
        }
        let attackTarget = attackTargetsAheadResp.pets[0];
        attackTarget.increaseAttack(5);
        this.logService.createLog({
            message: `${this.name} gave ${attackTarget.name} 5 attack.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: attackTargetsAheadResp.random
        })
        let equipmentTargetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (equipmentTargetsAheadResp.pets.length == 0) {
            return;
        }
        let equipmentTarget = equipmentTargetsAheadResp.pets[0];
        equipmentTarget.givePetEquipment(new Melon());
        this.logService.createLog({
            message: `${this.name} gave ${equipmentTarget.name} Melon.`,
            type: "ability",
            player: this.parent,
            tiger: tiger,
            randomEvent: equipmentTargetsAheadResp.random
        })
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
    }
}