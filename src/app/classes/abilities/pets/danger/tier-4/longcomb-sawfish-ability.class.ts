import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LongcombSawfishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'LongcombSawfishAbility',
            owner: owner,
            triggers: ['EnemyAttacked5'],
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
        let healthGain = this.level * 4; // 4/8/12 health gain based on level
        let healthRemoval = this.level * -4; // 4/8/12 health removal based on level

        // Gain health for self
        let selfTargetResp = owner.parent.getThis(owner);
        let selfTarget = selfTargetResp.pet;
        if (selfTarget) {
            selfTarget.increaseHealth(healthGain);
            this.logService.createLog({
                message: `${owner.name} gave ${selfTarget.name} ${healthGain} health`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: selfTargetResp.random
            });
        }

        // Remove health from all alive enemies
        let targetsResp = owner.parent.opponent.getAll(false, owner);
        let targets = targetsResp.pets;
        for (let targetPet of targets) {
            targetPet.increaseHealth(healthRemoval);
            this.logService.createLog({
                message: `${owner.name} reduced ${targetPet.name} health by ${Math.abs(healthRemoval)}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): LongcombSawfishAbility {
        return new LongcombSawfishAbility(newOwner, this.logService);
    }
}