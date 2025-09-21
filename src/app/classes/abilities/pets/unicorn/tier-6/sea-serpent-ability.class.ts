import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SeaSerpentAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SeaSerpentAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        if (owner.mana == 0) {
            return;
        }

        let power = owner.mana;
        let mana = owner.mana;
        this.logService.createLog({
            message: `${owner.name} spent ${mana} mana.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        owner.mana = 0;

        // First, snipe the most healthy enemy
        let highestHealthResult = owner.parent.opponent.getHighestHealthPet(undefined, owner);
        if (highestHealthResult.pet != null) {
            owner.snipePet(highestHealthResult.pet, power, highestHealthResult.random, tiger, pteranodon);
        }

        // Then snipe level number of random enemies (excluding the first target)
        let randomTargetsResp = owner.parent.opponent.getRandomPets(this.level, [highestHealthResult.pet], null, true, owner);
        for (let target of randomTargetsResp.pets) {
            if (target != null) {
                owner.snipePet(target, power, randomTargetsResp.random, tiger, pteranodon);
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SeaSerpentAbility {
        return new SeaSerpentAbility(newOwner, this.logService);
    }
}