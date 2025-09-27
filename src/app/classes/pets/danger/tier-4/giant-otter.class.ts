import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GiantOtterStartOfBattleAbility } from "../../../abilities/pets/danger/tier-4/giant-otter-start-of-battle-ability.class";
export class GiantOtter extends Pet {
    name = "Giant Otter";
    tier = 4;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;

    // Track which friends received buffs and how much
    private buffedFriends: Map<Pet, {attack: number, health: number}> = new Map();
    initAbilities(): void {
        this.addAbility(new GiantOtterStartOfBattleAbility(this, this.logService));
        super.initAbilities();
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