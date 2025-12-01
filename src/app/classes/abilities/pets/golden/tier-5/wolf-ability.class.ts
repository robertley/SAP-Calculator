import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";
import { Power } from "app/interfaces/power.interface";

export class WolfAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'WolfAbility',
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
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let power: Power = {
            attack: this.level * 3,
            health: this.level * 2
        }

        for (let i = 0; i < 3; i++) {
            let pig = this.petService.createPet({
                attack: power.attack,
                equipment: null,
                exp: owner.minExpForLevel,
                health: power.health,
                name: 'Pig',
                mana: 0
            }, owner.parent);

            let summonResult = owner.parent.summonPet(pig, owner.savedPosition, false, owner);

            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} spawned ${pig.name} ${power.attack}/${power.health}`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): WolfAbility {
        return new WolfAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}