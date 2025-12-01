import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";
import { clone } from "lodash";

export class TapirAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'TapirAbility',
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

        let excludePets = owner.parent.petArray.filter(pet => {
            return pet.name == "Tapir";
        });
        let targetResp = owner.parent.getRandomPet(excludePets, true, false, false, owner);
        if (targetResp.pet == null) {
            return;
        }

        //TO DO, check if clone operates correctly
        let target = clone(targetResp.pet);

        target.exp = owner.minExpForLevel;
        let spawnPet = this.petService.createDefaultVersionOfPet(target);

        let summonResult = owner.parent.summonPet(spawnPet, owner.savedPosition, false, owner);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${owner.name} spawned a ${spawnPet.name} level ${spawnPet.level}.`,
                type: "ability",
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: true
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): TapirAbility {
        return new TapirAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}