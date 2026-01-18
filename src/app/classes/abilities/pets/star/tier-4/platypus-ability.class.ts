import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Beaver } from "../../../../pets/turtle/tier-1/beaver.class";
import { Duck } from "../../../../pets/turtle/tier-1/duck.class";

export class PlatypusAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PlatypusAbility',
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
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let attackPower = 3 * this.level;
        let healthPower = 2 * this.level;

        let duck = new Duck(this.logService, this.abilityService, owner.parent, healthPower, attackPower, 0, this.minExpForLevel);
        let beaver = new Beaver(this.logService, this.abilityService, owner.parent, healthPower, attackPower, 0, this.minExpForLevel);

        let duckSummonResult = owner.parent.summonPet(duck, owner.savedPosition, false, owner);
        if (duckSummonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned ${attackPower}/${healthPower} Duck level ${this.level}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: duckSummonResult.randomEvent
            });
        }

        let beaverSummonResult = owner.parent.summonPet(beaver, owner.savedPosition, false, owner);
        if (beaverSummonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned ${attackPower}/${healthPower} Beaver level ${this.level}`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: beaverSummonResult.randomEvent
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PlatypusAbility {
        return new PlatypusAbility(newOwner, this.logService, this.abilityService);
    }
}