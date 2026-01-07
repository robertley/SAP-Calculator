import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class DobermanAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DobermanAbility',
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

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        let power = this.level * 8;
        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseAttack(power);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} attack.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // check if all friends are higher tier
        let lowestTier = true;
        for (let pet of owner.parent.petArray) {
            if (pet == owner) {
                continue;
            }
            if (pet.tier <= owner.tier) {
                lowestTier = false;
                break;
            }
        }

        if (!lowestTier) {
            this.triggerTigerExecution(context);
            return;
        }

        let coconutTargetResp = owner.parent.getThis(owner);
        let coconutTarget = coconutTargetResp.pet;
        if (coconutTarget == null) {
            return;
        }
        coconutTarget.givePetEquipment(new Coconut());
        this.logService.createLog({
            message: `${owner.name} gave ${coconutTarget.name} Coconut.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: coconutTargetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DobermanAbility {
        return new DobermanAbility(newOwner, this.logService);
    }
}