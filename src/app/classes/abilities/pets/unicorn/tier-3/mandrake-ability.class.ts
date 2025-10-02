import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Dazed } from "../../../../equipment/ailments/dazed.class";

export class MandrakeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'MandrakeAbility',
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
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let excludePets = owner.parent.opponent.getPetsWithEquipment("Dazed");
        let targetResp = owner.parent.opponent.getTierXOrLowerPet(this.level * 2, excludePets, owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} made ${target.name} Dazed.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            randomEvent: true
        });

        target.givePetEquipment(new Dazed());

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): MandrakeAbility {
        return new MandrakeAbility(newOwner, this.logService);
    }
}