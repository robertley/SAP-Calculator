import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { Strawberry } from "../../../../equipment/star/strawberry.class";
import { logAbility, resolveFriendSummonedTarget } from "../../../ability-helpers";

export class PheasantAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    reset(): void {
        this.maxUses = this.level;
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

        const targetResp = resolveFriendSummonedTarget(owner, triggerPet);
        if (!targetResp.pet) {
            return;
        }

        const target = targetResp.pet;
        logAbility(
            this.logService,
            owner,
            `${owner.name} gave ${target.name} a Strawberry.`,
            tiger,
            pteranodon,
            { randomEvent: targetResp.random }
        );

        target.givePetEquipment(new Strawberry(this.logService));

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): PheasantAbility {
        return new PheasantAbility(newOwner, this.logService, this.abilityService);
    }
}
