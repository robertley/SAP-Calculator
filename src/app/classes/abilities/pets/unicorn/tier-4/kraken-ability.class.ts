import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class KrakenAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'KrakenAbility',
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

        let targetsResp = owner.parent.getAll(true, owner, true);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let targetPet of targets) {
            // multiplying has a weird bug with 0.33 * 2 = 0.6600000000000001 type ish
            let power = this.level == 1 ? .15 : this.level == 2 ? .3 : .45;
            let reducedTo = Math.max(1, Math.floor(targetPet.health * (1 - power)));
            targetPet.health = reducedTo;
            this.logService.createLog({
                message: `${owner.name} reduced ${targetPet.name} health by ${(power * 100).toFixed(0)}% (${reducedTo})`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): KrakenAbility {
        return new KrakenAbility(newOwner, this.logService);
    }
}