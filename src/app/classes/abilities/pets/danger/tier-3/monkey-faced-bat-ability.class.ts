import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class MonkeyFacedBatAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MonkeyFacedBatAbility',
            owner: owner,
            triggers: ['AnyoneBehindHurt'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 3,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;
        // Get 2 random friends (excluding self)
        let targetsResp = owner.parent.getRandomPets(2, [owner], true, false, owner);

        for (let target of targetsResp.pets) {
            if (target != null) {
                let power = this.level; // 1/2/3 based on level
                target.increaseAttack(power);
                target.increaseHealth(power);

                this.logService.createLog({
                    message: `${owner.name} gave ${target.name} ${power} attack and ${power} health`,
                    type: 'ability',
                    player: owner.parent,
                    randomEvent: targetsResp.random,
                    tiger: tiger
                });
            }
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MonkeyFacedBatAbility {
        return new MonkeyFacedBatAbility(newOwner, this.logService);
    }
}