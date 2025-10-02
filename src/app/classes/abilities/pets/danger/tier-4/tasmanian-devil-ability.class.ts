import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class TasmanianDevilAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TasmanianDevilAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let percentage = this.level * 0.5; // 50%/100%/150%
        let targetResp = owner.parent.opponent.getLowestAttackPet(undefined, owner);

        if (targetResp.pet && targetResp.pet.alive) {
            let damage = Math.floor(owner.attack * percentage);
            owner.jumpAttackPrep(targetResp.pet)
            if (owner.transformed && owner.transformedInto) {
                damage = Math.floor(owner.transformedInto.attack * percentage);
            }
            owner.jumpAttack(targetResp.pet, tiger, damage, targetResp.random);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TasmanianDevilAbility {
        return new TasmanianDevilAbility(newOwner, this.logService);
    }
}