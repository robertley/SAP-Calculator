import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Boitata extends Pet {
    name = "Boitata";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 2;
    health = 9;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let target = this.parent.opponent.furthestUpPet;
        this.logService.createLog({
            message: `${this.name} gave ${target.name} Crisp.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        target.givePetEquipment(new Crisp());
        this.abilityUses++;

        this.superBeforeAttack(gameApi, tiger);
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