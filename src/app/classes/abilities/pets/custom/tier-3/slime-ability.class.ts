import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { SmallerSlime } from "../../../../pets/hidden/smaller-slime.class";

export class SlimeAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SlimeAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let summons = Math.floor(owner.battlesFought / 2);
        let power = owner.level * 2;

        for (let i = 0; i < summons; i++) {
            let slime = new SmallerSlime(this.logService, this.abilityService, owner.parent, null, null, 0);

            let summonResult = owner.parent.summonPet(slime, owner.savedPosition, false, owner);

            if (summonResult.success) {
                this.logService.createLog(
                    {
                        message: `${owner.name} spawned Smaller Slime (${power}/${power}).`,
                        type: "ability",
                        player: owner.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    }
                )
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SlimeAbility {
        return new SlimeAbility(newOwner, this.logService, this.abilityService);
    }
}