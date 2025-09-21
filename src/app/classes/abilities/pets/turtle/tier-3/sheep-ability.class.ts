import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Ram } from "../../../../pets/hidden/ram.class";

export class SheepAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SheepAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        for (let i = 0; i < 2; i++) {
            let ram = new Ram(this.logService, this.abilityService, owner.parent, null, null, 0, this.minExpForLevel);

            let summonResult = owner.parent.summonPet(ram, owner.savedPosition, false, owner);

            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} spawned Ram (${ram.attack}/${ram.health}).`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SheepAbility {
        return new SheepAbility(newOwner, this.logService, this.abilityService);
    }
}