import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../../classes/equipment.class";
import { Pack, Pet } from "../../../../classes/pet.class";
import { Player } from "../../../../classes/player.class";
import { LeafySeaDragonAbility } from "../../../abilities/pets/custom/tier-4/leafy-sea-dragon-ability.class";

export class LeafySeaDragon extends Pet {
    name = "Leafy Sea Dragon";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 7;
    health = 2;
    
    override initAbilities(): void {
        this.addAbility(new LeafySeaDragonAbility(this, this.logService));
        super.initAbilities();
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment, triggersConsumed?: number) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}
