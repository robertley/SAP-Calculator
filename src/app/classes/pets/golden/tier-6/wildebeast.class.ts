import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class Wildebeast extends Pet {
    name = "Wildebeast";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 8;
    health = 6;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.trumpets < 4) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.givePetEquipment(new Coconut());
        this.logService.createLog({
            message: `${this.name} gave itself a Coconut.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })
        this.parent.spendTrumpets(4, this);

        this.abilityUses++;
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