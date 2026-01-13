import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class PoodleMothAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Poodle Moth Ability',
            owner: owner,
            triggers: ['FriendTransformed'],
            abilityType: 'Pet',
            maxUses: owner.level,
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        if (!triggerPet || triggerPet.parent !== owner.parent) {
            this.triggerTigerExecution(context);
            return;
        }

        const expGain = 3;
        triggerPet.increaseExp(expGain);
        this.logService.createLog({
            message: `${owner.name} gave ${triggerPet.name} +${expGain} experience after transforming.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.triggerTigerExecution(context);
    }

    override copy(newOwner: Pet): PoodleMothAbility {
        return new PoodleMothAbility(newOwner, this.logService);
    }
}
