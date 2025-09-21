import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Rock } from "../../../../pets/hidden/rock.class";

export class BasiliskAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'BasiliskAbility',
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
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        // Target ahead (including opponents if no friendlies available)
        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner, undefined, true);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        if (target == null || !target.alive) {
            return;
        }
        let healthBonus = this.level * 2;
        let health = target.health + healthBonus;
        health = Math.min(health, 50);

        // Create Rock with enhanced health and original stats
        let rock = new Rock(this.logService, this.abilityService, target.parent, health, target.attack, target.mana, target.exp, target.equipment);
        this.logService.createLog({
            message: `${owner.name} turned ${target.name} into a Rock with + ${healthBonus} health.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsAheadResp.random
        });
        // Use proper transformPet method
        target.parent.transformPet(target, rock);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BasiliskAbility {
        return new BasiliskAbility(newOwner, this.logService, this.abilityService);
    }
}