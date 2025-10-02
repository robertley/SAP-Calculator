import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SkunkAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SkunkAbility',
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

        let opponent = owner.parent.opponent;
        let highestHealthPetResp = opponent.getHighestHealthPet(undefined, owner);
        let targetPet = highestHealthPetResp.pet;
        if (targetPet == null) {
            return;
        }

        let power = .33 * this.level;
        let reducedTo = Math.max(1, Math.floor(targetPet.health * (1 - power)));

        targetPet.health = reducedTo;
        this.logService.createLog({
            message: `${owner.name} reduced ${targetPet.name} health by ${power * 100}% (${reducedTo})`,
            type: 'ability',
            player: owner.parent,
            randomEvent: highestHealthPetResp.random,
            tiger: tiger
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SkunkAbility {
        return new SkunkAbility(newOwner, this.logService);
    }
}