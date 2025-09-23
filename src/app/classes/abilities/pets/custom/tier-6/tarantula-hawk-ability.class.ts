import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TarantulaHawkAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TarantulaHawkAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        // Calculate damage per enemy: level * health removed per 10 attack
        let damagePerEnemy = Math.floor(owner.attack / 10) * this.level;

        if (damagePerEnemy <= 0) {
            return;
        }

        // Get all alive enemies
        let enemiesResp = owner.parent.opponent.getAll(false, owner);
        let enemies = enemiesResp.pets;

        if (enemies.length == 0) {
            return;
        }

        // Apply damage to all enemies
        for (let enemy of enemies) {
            enemy.increaseHealth(-damagePerEnemy);
            this.logService.createLog({
                message: `${owner.name} removed ${damagePerEnemy} health from ${enemy.name}`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TarantulaHawkAbility {
        return new TarantulaHawkAbility(newOwner, this.logService);
    }
}