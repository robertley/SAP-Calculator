import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DropBearAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DropBearAbility',
            owner: owner,
            triggers: ['ClearFront'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (context: AbilityContext) => {
                const owner = this.owner;
                // Check if first pet is null (front space is empty)
                return owner.parent.pet0 == null;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        this.logService.createLog({
            message: `${owner.name} pushed itself to the front.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        owner.parent.pushPetToFront(owner, true);
        let power = this.level * 3;
        let targetResp = owner.parent.opponent.getLastPet();
        if (targetResp.pet == null) {
            return;
        }
        owner.snipePet(targetResp.pet, power, targetResp.random, tiger);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): DropBearAbility {
        return new DropBearAbility(newOwner, this.logService);
    }
}