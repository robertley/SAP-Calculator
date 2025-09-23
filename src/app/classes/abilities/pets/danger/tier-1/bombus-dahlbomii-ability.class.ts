import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";

export class BombusDahlbomiiAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'BombusDahlbomiiAbility',
            owner: owner,
            triggers: ['EnemyAttacked2'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        // Set counter event to deal damage
        this.abilityService.setCounterEvent({
            callback: () => {
                let targetResp = owner.parent.opponent.getFurthestUpPet(owner); // First enemy
                let target = targetResp.pet;
                if (target) {
                    let damage = this.level * 1;
                    owner.snipePet(target, damage, targetResp.random, tiger);
                }
            },
            priority: owner.attack,
            pet: owner
        });
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BombusDahlbomiiAbility {
        return new BombusDahlbomiiAbility(newOwner, this.logService, this.abilityService);
    }
}