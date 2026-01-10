import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Power } from "app/interfaces/power.interface";
import { Guava } from "../../../../equipment/custom/guava.class";

export class BettaFishAbility extends Ability {
    private logService: LogService;
    private targetedPets: Set<Pet> = new Set();

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BettaFishAbility',
            owner: owner,
            triggers: ['FriendLostPerk'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    reset(): void {
        this.maxUses = this.level;
        this.targetedPets.clear();
        super.reset();
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        if (!triggerPet || triggerPet == owner) {
            return;
        }

        // Check if we already targeted this pet this turn (for "different friends" logic)
        if (this.targetedPets.has(triggerPet)) {
            return;
        }

        this.targetedPets.add(triggerPet);

        triggerPet.givePetEquipment(new Guava());

        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} Guava.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BettaFishAbility {
        return new BettaFishAbility(newOwner, this.logService);
    }
}