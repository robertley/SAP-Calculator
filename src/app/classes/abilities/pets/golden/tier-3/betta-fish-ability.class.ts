import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Guava } from "../../../../equipment/custom/guava.class";

export class BettaFishAbility extends Ability {
    private logService: LogService;
    private targetedPets: Set<Pet> = new Set();

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Betta Fish Ability',
            owner: owner,
            triggers: ['FriendLostPerk'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (context: AbilityContext) => {
                const { triggerPet } = context;
                return !!triggerPet && triggerPet !== owner && !this.targetedPets.has(triggerPet);
            },
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    reset(): void {
        this.targetedPets.clear();
        this.maxUses = this.level;
        super.reset();
    }

    initUses(): void {
        this.targetedPets.clear();
        this.maxUses = this.level;
        super.initUses();
    }

    private executeAbility(context: AbilityContext): void {
        const { triggerPet, tiger, pteranodon } = context;
        if (!triggerPet) {
            return;
        }
        const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.targetedPets.add(triggerPet);

        target.givePetEquipment(new Guava());
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} Guava.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): BettaFishAbility {
        return new BettaFishAbility(newOwner, this.logService);
    }
}
