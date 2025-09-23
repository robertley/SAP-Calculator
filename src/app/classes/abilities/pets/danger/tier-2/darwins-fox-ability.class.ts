import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DarwinsFoxAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DarwinsFoxAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Pet',
            native: true,
            maxUses: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        // Find who killed the friend
        if (triggerPet?.killedBy && triggerPet?.killedBy.alive) {
            let targetResp = owner.parent.getSpecificPet(owner, triggerPet.killedBy);
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
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }
    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }
    copy(newOwner: Pet): DarwinsFoxAbility {
        return new DarwinsFoxAbility(newOwner, this.logService);
    }
}