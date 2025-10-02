import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AmamiRabbitAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmamiRabbitAbility',
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

        let attackGain = this.level * 1;
        let targetResp = owner.parent.opponent.getHighestAttackPet(undefined, owner);

        // Then jump-attack the highest attack enemy
        if (targetResp.pet && targetResp.pet.alive) {
            owner.jumpAttackPrep(targetResp.pet);

            // Apply attack gain to transformed pet if transformed, otherwise to target pet
            if (owner.transformed && owner.transformedInto) {
                let selfTargetResp = owner.parent.getThis(owner.transformedInto);
                if (selfTargetResp.pet) {
                    owner.transformedInto.increaseAttack(attackGain);
                    this.logService.createLog({
                        message: `${owner.name} gave ${owner.transformedInto.name} ${attackGain} attack`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            } else {
                let selfTargetResp = owner.parent.getThis(owner);
                if (selfTargetResp.pet) {
                    selfTargetResp.pet.increaseAttack(attackGain);
                    this.logService.createLog({
                        message: `${owner.name} gave ${selfTargetResp.pet.name} ${attackGain} attack`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        randomEvent: selfTargetResp.random
                    });
                }
            }
        }
        owner.jumpAttack(targetResp.pet, tiger, undefined, targetResp.random);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AmamiRabbitAbility {
        return new AmamiRabbitAbility(newOwner, this.logService);
    }
}