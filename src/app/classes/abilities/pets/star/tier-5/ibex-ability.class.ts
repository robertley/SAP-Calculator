import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class IbexAbility extends Ability {
    private logService: LogService;
    private affectedEnemies: Set<Pet> = new Set();
    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'IbexAbility',
            owner: owner,
            triggers: ['EnemyHurt', 'EnemyPushed'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return triggerPet && triggerPet.alive && !this.affectedEnemies.has(triggerPet);
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        // Calculate 70% health reduction
        let healthReduction = Math.floor(triggerPet.health * 0.7);

        // Apply damage
        target.increaseHealth(-healthReduction);

        // Track affected enemy
        this.affectedEnemies.add(target);

        // Log the effect
        this.logService.createLog({
            message: `${owner.name} removed ${healthReduction} health from ${triggerPet.name} (70%)`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): IbexAbility {
        return new IbexAbility(newOwner, this.logService);
    }
}