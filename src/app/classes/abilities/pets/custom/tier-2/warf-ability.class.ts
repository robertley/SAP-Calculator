import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WarfAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Warf Ability',
            owner: owner,
            triggers: ['ThisGainedMana'],
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

        const targetResp = owner.parent.opponent.getRandomPet();
        if (targetResp.pet) {
            const target = targetResp.pet;
            const damage = this.level;

            owner.snipePet(target, damage, targetResp.random, tiger, pteranodon);

            this.logService.createLog({
                message: `${owner.name} gained mana and dealt ${damage} damage to ${target.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): WarfAbility {
        return new WarfAbility(newOwner, this.logService);
    }
}