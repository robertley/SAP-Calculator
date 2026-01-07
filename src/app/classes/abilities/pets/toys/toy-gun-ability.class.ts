import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class ToyGunAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ToyGunAbility',
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
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Toy Gun toy behavior
        let opponent = owner.parent.opponent;
        for (let i = 0; i < this.level; i++) {
            let targetResp = opponent.getLastPet();
            if (targetResp.pet == null) {
                return;
            }
            owner.snipePet(targetResp.pet, 5, targetResp.random, tiger);
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): ToyGunAbility {
        return new ToyGunAbility(newOwner, this.logService);
    }
}