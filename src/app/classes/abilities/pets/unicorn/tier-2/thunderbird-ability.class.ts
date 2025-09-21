import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ThunderbirdAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ThunderbirdAbility',
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

        let targetsResp = owner.parent.nearestPetsAhead(2, owner);
        let targets = targetsResp.pets;
        if (targets.length < 2) {
            return;
        }
        let target = targetsResp.pets[1];
        if (target == null) {
            return;
        }

        let power = this.level * 3;
        this.logService.createLog({
            message: `${owner.name} gave ${target.name} ${power} mana.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetsResp.random
        });
        target.increaseMana(power);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ThunderbirdAbility {
        return new ThunderbirdAbility(newOwner, this.logService);
    }
}