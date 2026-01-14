import { Ability, AbilityContext } from "../../../../ability.class";
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
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        const contextState = context as any;
        const manaSpent = contextState.seaSerpentMana ?? owner.mana;
        if (manaSpent == 0) {
            return;
        }

        if (contextState.seaSerpentMana == null) {
            contextState.seaSerpentMana = manaSpent;
            owner.mana = 0;
        }

        let power = manaSpent;
        let mana = manaSpent;
        this.logService.createLog({
            message: `${owner.name} spent ${mana} mana.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

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
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SeaSerpentAbility {
        return new SeaSerpentAbility(newOwner, this.logService);
    }
}
