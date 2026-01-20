import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Ant } from "../../../pets/turtle/tier-1/ant.class";

export class GrosMichelBananaAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'GrosMichelBananaAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Equipment is used once
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi } = context;
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            // Create Ant with current pet's stats
            let antPet = new Ant(this.logService, this.abilityService, owner.parent, owner.health, owner.attack, owner.mana, owner.exp);

            let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';
            this.logService.createLog({
                message: `${owner.name} transformed into ${antPet.name} (Gros Michel Banana)${multiplierMessage}`,
                type: 'equipment',
                player: owner.parent
            });

            owner.parent.transformPet(owner, antPet);
        }
    }
}