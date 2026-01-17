import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { GreatOne } from "../../../pets/custom/tier-6/great-one.class";

export class EvilBookAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'EvilBookAbility',
            owner: owner,
            triggers: ['ClearFront'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context): boolean => {
                const owner = this.owner;
                return owner.parent.pet0 == null;
            },
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

        // Mirror Evil Book toy behavior (emptyFromSpace method)
        let power = {
            attack: this.level * 6,
            health: this.level * 6,
        };

        let greatOne = new GreatOne(this.logService, this.abilityService, owner.parent, power.health, power.attack, 0, this.minExpForLevel);
        let result = owner.parent.summonPet(greatOne, 0);
        if (result.success) {
            let message = `Evil Book Ability spawned Great One (${power.attack}/${power.health}).`;
            this.logService.createLog(
                {
                    message: message,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    randomEvent: result.randomEvent
                }
            )
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): EvilBookAbility {
        return new EvilBookAbility(newOwner, this.logService, this.abilityService);
    }
}