import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class FireAntAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FireAntAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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
        let targetsResp = owner.parent.getHighestTierPets(this.level, null, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            target.increaseAttack(owner.attack);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${owner.attack} attack.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetsResp.random,
                pteranodon: pteranodon
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FireAntAbility {
        return new FireAntAbility(newOwner, this.logService);
    }
}