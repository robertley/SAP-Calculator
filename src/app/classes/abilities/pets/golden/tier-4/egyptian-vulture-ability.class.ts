import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class EgyptianVultureAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'EgyptianVultureAbility',
            owner: owner,
            triggers: ['ThisKilledEnemy'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        let excludePets = owner.parent.petArray.filter(pet => {return !pet.isFaintPet()});
        let targetsBehindResp = owner.parent.nearestPetsBehind(1, owner, excludePets);
        let friendBehind = targetsBehindResp.pets[0];

        this.logService.createLog({
            message: `${owner.name} activated ${friendBehind.name}'s ability.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsBehindResp.random
        });

        friendBehind.activateAbilities(undefined, gameApi, 'Pet');

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    reset(): void {
        super.reset();
        this.maxUses = this.level;
    }

    copy(newOwner: Pet): EgyptianVultureAbility {
        return new EgyptianVultureAbility(newOwner, this.logService);
    }
}