import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ox extends Pet {
    name = "Ox";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 1;
    friendAheadFaints(gameApi, pet, tiger) {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.equipment = new Melon();
        this.increaseAttack(1);
        this.logService.createLog({
            message: `${this.name} gained Melon and 1 attack.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        super.superFriendAheadFaints(gameApi, pet, tiger);
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