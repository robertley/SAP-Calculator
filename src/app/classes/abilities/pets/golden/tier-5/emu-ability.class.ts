import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class EmuAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'EmuAbility',
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

        let buffTargetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (buffTargetsAheadResp.pets.length == 0) {
            return;
        }
        let buffTarget = buffTargetsAheadResp.pets[0];
        let power = this.level * 4;
        buffTarget.increaseHealth(power);
        this.logService.createLog({
            message: `${owner.name} gave ${buffTarget.name} ${power} health.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: buffTargetsAheadResp.random
        });

        let targetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetsAheadResp.pets.length === 0) {
            return;
        }
        let target = targetsAheadResp.pets[0];
        owner.parent.pushPet(target, 4);
        this.logService.createLog({
            message: `${owner.name} pushed ${target.name} to the front.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsAheadResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): EmuAbility {
        return new EmuAbility(newOwner, this.logService);
    }
}