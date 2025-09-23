import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Power } from "app/interfaces/power.interface";
import { CrackedEgg } from "../../../../pets/hidden/cracked-egg.class";

export class SneakyEggAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'SneakyEggAbility',
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
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power: Power = {
            attack: this.level * 4,
            health: this.level * 2
        };

        owner.health = 0;

        let egg = new CrackedEgg(this.logService, this.abilityService, owner.parent, power.health, power.attack, 0);

        let summonResult = owner.parent.summonPet(egg, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned a ${power.attack}/${power.health} Cracked Egg`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                randomEvent: summonResult.randomEvent
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SneakyEggAbility {
        return new SneakyEggAbility(newOwner, this.logService, this.abilityService);
    }
}