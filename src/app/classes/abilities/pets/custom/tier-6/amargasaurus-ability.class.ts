import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AmargasaurusAbility extends Ability {
    private logService: LogService;
    private healthRestoredThisTurn: number = 0;

    reset(): void {
        this.healthRestoredThisTurn = 0;
        super.reset();
    }

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmargasaurusAbility',
            owner: owner,
            triggers: ['FriendHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let currentTargetPet: Pet;
        if (!triggerPet) {
            return;
        }
        // Special handling ONLY for Fairy Armadillo to account for its transformation.
        if (triggerPet.transformed) {
            currentTargetPet = triggerPet.transformedInto;
            currentTargetPet.originalHealth = triggerPet.originalHealth;
        } else {
            currentTargetPet = triggerPet;
        }

        if (!currentTargetPet || !currentTargetPet.alive) {
            return;
        }

        if (currentTargetPet === owner) {
            return;
        }

        const maxHealthToRestore = this.level * 15;
        const healthMissing = currentTargetPet.originalHealth - currentTargetPet.health;

        if (healthMissing <= 0 || this.healthRestoredThisTurn >= maxHealthToRestore) {
            return;
        }

        const remainingRestorePower = maxHealthToRestore - this.healthRestoredThisTurn;
        const healthToRestore = Math.min(healthMissing, remainingRestorePower);

        if (healthToRestore > 0) {
            let targetResp = owner.parent.getSpecificPet(owner, currentTargetPet);
            let target = targetResp.pet;
            if (target == null) {
                return;
            }
            this.logService.createLog({
                message: `${owner.name} restored ${healthToRestore} health to ${target.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });

            target.increaseHealth(healthToRestore);
            this.healthRestoredThisTurn += healthToRestore;
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AmargasaurusAbility {
        return new AmargasaurusAbility(newOwner, this.logService);
    }
}