import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class HammerheadSharkAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Hammerhead Shark Ability',
            owner: owner,
            triggers: ['StartTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const hasLevel3Friend = owner.parent.petArray.some((pet) => pet && pet !== owner && pet.level === 3);
        if (!hasLevel3Friend) {
            this.triggerTigerExecution(context);
            return;
        }

        const goldGain = this.level * 3;
        const player = owner.parent as any;
        player.gold = (player.gold ?? 0) + goldGain;

        this.logService.createLog({
            message: `${owner.name} gained +${goldGain} gold from level 3 friends.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): HammerheadSharkAbility {
        return new HammerheadSharkAbility(newOwner, this.logService);
    }
}
