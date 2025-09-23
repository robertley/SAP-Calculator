import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { EthiopianWolf } from "../../../../pets/danger/tier-1/ethiopian-wolf.class";

export class HirolaAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'HirolaAbility',
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

        for (let i = 0; i < this.level; i++) {
            let wolf = new EthiopianWolf(this.logService, this.abilityService, owner.parent, 3, 4, owner.mana, owner.exp);

            let summonResult = owner.parent.summonPet(wolf, owner.savedPosition, false, owner);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} summoned a ${4}/${3} ${wolf.name}.`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });

                this.abilityService.triggerFriendSummonedEvents(wolf);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): HirolaAbility {
        return new HirolaAbility(newOwner, this.logService, this.abilityService);
    }
}