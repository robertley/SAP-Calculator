import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class FossaAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FossaAbility',
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

        const isPlayer = owner.parent === gameApi.player;
        const rollAmount = isPlayer ? gameApi.playerRollAmount : gameApi.opponentRollAmount;

        if (rollAmount <= 0) {
            return;
        }

        const healthToRemove = this.level * rollAmount;

        let targetResp = owner.parent.getFurthestUpPets(2, undefined, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let target of targets) {
            this.logService.createLog({
                message: `${owner.name} removed ${healthToRemove} health from ${target.name}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger
            });

            target.increaseHealth(-healthToRemove);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FossaAbility {
        return new FossaAbility(newOwner, this.logService);
    }
}