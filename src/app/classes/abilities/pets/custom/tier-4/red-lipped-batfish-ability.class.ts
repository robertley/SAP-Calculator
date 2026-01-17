import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";

export class RedLippedBatfishAbility extends Ability {
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, petService: PetService) {
        super({
            name: 'Red Lipped Batfish Ability',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const opponent = owner.parent.opponent;
        if (!opponent) {
            this.triggerTigerExecution(context);
            return;
        }

        const target = opponent.getPetAtPosition(owner.position);
        if (!target || !target.alive) {
            this.triggerTigerExecution(context);
            return;
        }

        const targetTier = Math.max(1, 4 - this.level);
        const newPet = this.petService.getRandomFaintPet(opponent, targetTier);
        opponent.transformPet(target, newPet);

        this.logService.createLog({
            message: `${owner.name} transformed ${target.name} into ${newPet.name} (tier ${targetTier}).`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): RedLippedBatfishAbility {
        return new RedLippedBatfishAbility(newOwner, this.logService, this.petService);
    }
}
