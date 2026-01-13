import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { Corncob } from "../../../../equipment/custom/corncob.class";
import { LogService } from "app/services/log.service";

export class FarmerDogAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Farmer Dog Ability',
            owner: owner,
            triggers: ['EndTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const effectMultiplier = this.level;
        const friends = owner.parent.petArray.filter((pet) => pet && pet.alive && pet !== owner);
        if (friends.length === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        for (const friend of friends) {
            const cob = new Corncob();
            cob.effectMultiplier = effectMultiplier;
            friend.givePetEquipment(cob);
        }

        this.logService.createLog({
            message: `${owner.name} fed ${effectMultiplier} Corncob${effectMultiplier === 1 ? '' : 's'} to ${friends.length} friend${friends.length === 1 ? '' : 's'}.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon
        });

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FarmerDogAbility {
        return new FarmerDogAbility(newOwner, this.logService);
    }
}
