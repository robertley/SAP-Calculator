import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class EuropeanMinkAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'EuropeanMinkAbility',
            owner: owner,
            triggers: ['AdjacentFriendAttacked'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 5,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power = this.level;

        // Target ahead with Silly-aware targeting
        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length > 0) {
            let targetAhead = targetsAheadResp.pets[0];
            targetAhead.increaseAttack(power);
            this.logService.createLog({
                message: `${owner.name} gave ${targetAhead.name} ${power} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsAheadResp.random
            });
        }

        // Target behind with Silly-aware targeting
        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner);
        if (targetsBehindResp.pets.length > 0) {
            let targetBehind = targetsBehindResp.pets[0];
            targetBehind.increaseAttack(power);
            this.logService.createLog({
                message: `${owner.name} gave ${targetBehind.name} ${power} attack.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsBehindResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): EuropeanMinkAbility {
        return new EuropeanMinkAbility(newOwner, this.logService);
    }
}