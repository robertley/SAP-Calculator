import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";
import { AbilityService } from "app/services/ability/ability.service";

export class FalconAbility extends Ability {
    private logService: LogService;
    private petService: PetService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, petService: PetService, abilityService: AbilityService) {
        super({
            name: 'FalconAbility',
            owner: owner,
            triggers: ['ThisKilledEnemy'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 3,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.petService = petService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        let power = this.level * 3;
        let summonPet = this.petService.createPet({
            attack: power,
            health: power,
            name: triggerPet.name,
            exp: owner.minExpForLevel,
            equipment: null,
            mana: 0
        }, owner.parent);
        let summonResult = owner.parent.summonPet(summonPet, owner.savedPosition, false, owner)

        if (summonResult.success) {
            this.logService.createLog(
                {
                    message: `${owner.name} spawned ${summonPet.name} ${power}/${power} Level ${this.level}`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                    randomEvent: summonResult.randomEvent
                }
            )
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FalconAbility {
        return new FalconAbility(newOwner, this.logService, this.petService, this.abilityService);
    }
}