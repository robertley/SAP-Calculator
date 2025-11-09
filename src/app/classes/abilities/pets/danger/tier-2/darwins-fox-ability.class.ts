import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DarwinsFoxAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DarwinsFoxAbility',
            owner: owner,
            triggers: ['EnemyHurt'],
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

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        // Find who killed the friend
        if (triggerPet && triggerPet.alive) {
            let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
            let target = targetResp.pet;
            if (!target) {
                return;
            }
            owner.jumpAttackPrep(target)
            owner.jumpAttack(target, tiger, undefined, targetResp.random);
        } else {
            let targetResp = owner.parent.opponent.getFurthestUpPet(owner);
            let target = targetResp.pet;
            if (!target) {
                return;
            }
            owner.jumpAttackPrep(target)
            owner.jumpAttack(target, tiger, undefined, targetResp.random)
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }
    reset(): void {
        this.maxUses = this.level;
        super.reset();
    }
    copy(newOwner: Pet): DarwinsFoxAbility {
        return new DarwinsFoxAbility(newOwner, this.logService);
    }
}