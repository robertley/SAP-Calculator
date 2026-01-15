import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Spooked } from "app/classes/equipment/ailments/spooked.class";

export class OlmAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'OlmAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi, tiger, pteranodon } = context;
        const owner = this.owner;

        const rolls = owner.parent === gameApi.player ? (gameApi.playerRollAmount || 0) : (gameApi.opponentRollAmount || 0);
        const excludePets = owner.parent.opponent.getPetsWithEquipment('Spooked');
        const targetResp = owner.parent.opponent.getRandomPet(excludePets, null, true, null, owner);
        const target = targetResp.pet;

        if (!target) {
            return;
        }

        const spooked = new Spooked();
        if (rolls > 0) {
            spooked.multiplier += rolls;
        }
        const multiplierMessage = spooked.multiplier > 1 ? ` ${spooked.multiplier}x` : '';
        this.logService.createLog({
            message: `${owner.name} made ${target.name}${multiplierMessage} Spooked.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });
        target.givePetEquipment(spooked);

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): OlmAbility {
        return new OlmAbility(newOwner, this.logService);
    }
}
