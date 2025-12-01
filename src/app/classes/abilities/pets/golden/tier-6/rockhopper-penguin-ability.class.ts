import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class RockhopperPenguinAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'RockhopperPenguinAbility',
            owner: owner,
            triggers: ['ClearFront'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 1, // Can only be used once
            condition: (context: AbilityContext) => {
                const owner = this.owner;
                // Check if first pet is null (front space is empty) and haven't exceeded max uses
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

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${owner.name} jumps to the front!`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        // The 'true' argument triggers the 'friendJumped' event.
        owner.parent.pushPetToFront(target, true);

        const trumpetsGained = this.level * 12;
        const trumpetTargetResp = owner.parent.resolveTrumpetGainTarget(owner);
        trumpetTargetResp.player.gainTrumpets(trumpetsGained, owner, pteranodon, undefined, undefined, trumpetTargetResp.random);

        // Note: superEmptyFrontSpace call removed as it's protected and not accessible from ability

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): RockhopperPenguinAbility {
        return new RockhopperPenguinAbility(newOwner, this.logService);
    }
}
