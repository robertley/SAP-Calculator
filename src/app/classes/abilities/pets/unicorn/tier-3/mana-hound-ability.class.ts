import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ManaHoundAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ManaHoundAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let isPlayer = owner.parent == gameApi.player;
        let rollAmount;
        if (isPlayer) {
            rollAmount = gameApi.playerRollAmount;
        } else {
            rollAmount = gameApi.opponentRollAmount;
        }

        rollAmount = Math.min(rollAmount, 5);

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        let manaAmt = rollAmount * this.level;
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${manaAmt} mana.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsAheadResp.random
        });

        target.increaseMana(manaAmt);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ManaHoundAbility {
        return new ManaHoundAbility(newOwner, this.logService);
    }
}