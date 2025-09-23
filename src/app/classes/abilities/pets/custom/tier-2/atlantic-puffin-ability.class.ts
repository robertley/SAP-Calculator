import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AtlanticPuffinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AtlanticPuffinAbility',
            owner: owner,
            triggers: ['FriendAttacked'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): boolean => {
                if (!triggerPet || triggerPet.equipment?.name != 'Strawberry') {
                    return;
                }
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        this.logService.createLog({
            message: `${owner.name} removed ${triggerPet.name}'s ${triggerPet.equipment.name}.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
        });

        triggerPet.removePerk();
        let power = 2 * owner.level;
        let targetResp = owner.parent.opponent.getLastPet();
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        owner.snipePet(target, power, targetResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AtlanticPuffinAbility {
        return new AtlanticPuffinAbility(newOwner, this.logService);
    }
}