import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class GeometricTortoiseAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'GeometricTortoiseAbility',
            owner: owner,
            triggers: ['ThisHurt'],
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

        const { gameApi, triggerPet, tiger, pteranodon, damageAmount } = context;
        const owner = this.owner;

        if (damageAmount === undefined || damageAmount <= 0) {
            return;
        }

        // Deal percentage of damage taken as damage to one random enemy
        let reflectPercentage = this.level * 0.33; // 33%/66%/100% based on level
        if (owner.level === 3) {
            reflectPercentage = 1;
        }

        let reflectDamage = Math.floor(damageAmount * reflectPercentage);
        if (reflectDamage > 0) {
            let targetResp = owner.parent.opponent.getRandomPet([], false, true, false, owner);
            if (targetResp.pet) {
                owner.snipePet(targetResp.pet, reflectDamage, targetResp.random, tiger);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): GeometricTortoiseAbility {
        return new GeometricTortoiseAbility(newOwner, this.logService);
    }
}