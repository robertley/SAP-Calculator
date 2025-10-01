import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { GiantEyesDog } from "../../../pets/hidden/giant-eyes-dog.class";

export class TinderBoxAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private used: boolean = false;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'TinderBoxAbility',
            owner: owner,
            triggers: [],
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

        // Mirror Tinder Box toy behavior (emptyFromSpace method)
        let power = {
            attack: this.level * 6,
            health: this.level * 6,
        };
        let exp = this.level == 1 ? 0 : this.level == 2 ? 2 : 5;

        let giantEyesDog = new GiantEyesDog(this.logService, this.abilityService, owner.parent, power.health, power.attack, 0, exp);
        let message = `Tinder Box Ability spawned Giant Eyes Dog (${power.attack}/${power.health}).`;
        this.logService.createLog(
            {
                message: message,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

        if (owner.parent.summonPet(giantEyesDog, 0)) {
            this.abilityService.triggerFriendSummonedEvents(giantEyesDog);
        }

        this.used = true;

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TinderBoxAbility {
        return new TinderBoxAbility(newOwner, this.logService, this.abilityService);
    }
}