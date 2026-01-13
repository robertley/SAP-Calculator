import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class LynxAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Lynx Ability',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const friendlyLevelSum = owner.parent.petArray.reduce((sum, pet) => sum + (pet?.level ?? 0), 0);

        if (friendlyLevelSum <= 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const targetCount = this.level;
        const selectedTargets: Pet[] = [];

        for (let i = 0; i < targetCount; i++) {
            const targetResp = owner.parent.opponent.getRandomPet(selectedTargets, false, false, false, owner);
            if (!targetResp.pet) {
                break;
            }
            selectedTargets.push(targetResp.pet);
            owner.snipePet(targetResp.pet, friendlyLevelSum, targetResp.random);
        }

        this.logService.createLog({
            message: `${owner.name} dealt ${friendlyLevelSum} damage to ${selectedTargets.length} enemy${selectedTargets.length === 1 ? '' : 'ies'}.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): LynxAbility {
        return new LynxAbility(newOwner, this.logService);
    }
}
