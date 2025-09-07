import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Spooked } from "../../../equipment/ailments/spooked.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Amalgamation extends Pet {
    name = "Amalgamation";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    maxAbilityUses = 2;
    abilityUses = 0;

    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let targetResp = this.parent.getThis(pet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        let attackAmount = this.level * 3;
        let manaAmount = this.level * 4;

        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${attackAmount} attack, +${manaAmount} mana, and Spooked.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        target.increaseAttack(attackAmount);
        target.increaseMana(manaAmount);
        target.givePetEquipment(new Spooked());

        this.abilityUses++;
        this.superFriendSummoned(gameApi, pet, tiger);
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
        this.maxAbilityUses = 2;
    }
}