import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Strawberry } from "../../../../equipment/star/strawberry.class";

export class PheasantAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    reset(): void {
        this.maxUses = this.owner.level;
        super.reset();
    }
    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'PheasantAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targetResp = owner.parent.getSpecificPet(owner, triggerPet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} gave ${target.name} a Strawberry.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger
        });

        target.givePetEquipment(new Strawberry(this.logService, this.abilityService));

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PheasantAbility {
        return new PheasantAbility(newOwner, this.logService, this.abilityService);
    }
}