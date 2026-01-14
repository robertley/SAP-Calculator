import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Spooked } from "../../../../equipment/ailments/spooked.class";
import { logAbility, resolveFriendSummonedTarget } from "../../../ability-helpers";

export class AmalgamationAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AmalgamationAbility',
            owner: owner,
            triggers: ['FriendSummoned'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        if (!triggerPet) {
            return;
        }

        const targetResp = resolveFriendSummonedTarget(owner, triggerPet, (o, pet) => o.parent.getThis(pet));
        if (!targetResp.pet) {
            return;
        }

        const target = targetResp.pet;
        const attackAmount = this.level * 3;
        const manaAmount = this.level * 4;

        logAbility(
            this.logService,
            owner,
            `${owner.name} gave ${target.name} +${attackAmount} attack, +${manaAmount} mana, and Spooked.`,
            tiger,
            pteranodon,
            { randomEvent: targetResp.random }
        );

        target.increaseAttack(attackAmount);
        target.increaseMana(manaAmount);
        target.givePetEquipment(new Spooked());

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AmalgamationAbility {
        return new AmalgamationAbility(newOwner, this.logService);
    }
}
