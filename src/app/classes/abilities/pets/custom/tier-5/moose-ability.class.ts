import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";

export class MooseAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'Moose Ability',
            owner: owner,
            triggers: ['EndTurn'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const owner = this.owner;
        const gameApi = context.gameApi;
        const tierOneCount = gameApi?.playerPetPool?.get(1)?.length ?? 0;
        if (tierOneCount === 0) {
            this.triggerTigerExecution(context);
            return;
        }

        const buffPerPet = 3 * this.level;
        const totalHealth = buffPerPet * tierOneCount;
        const targetResp = owner.parent.getRandomPets(1, [owner], false, false, owner);
        const target = targetResp.pets[0];
        if (!target) {
            this.triggerTigerExecution(context);
            return;
        }

        target.increaseHealth(totalHealth);
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} +${totalHealth} health from ${tierOneCount} Tier 1 shop pets.`,
            type: 'ability',
            player: owner.parent,
            tiger: context.tiger,
            pteranodon: context.pteranodon,
            randomEvent: targetResp.random
        });
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MooseAbility {
        return new MooseAbility(newOwner, this.logService, this.abilityService);
    }
}
