import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Coconut } from "../../../../equipment/turtle/coconut.class";

export class WildebeestAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WildebeestAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): boolean => {
                return owner.parent.trumpets >= 2;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetResp = owner.parent.getThis(owner);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }

        target.givePetEquipment(new Coconut());
        this.logService.createLog({
            message: `${owner.name} gave itself a Coconut.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetResp.random
        });

        owner.parent.spendTrumpets(2, owner);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    reset(): void {
        super.reset();
        this.maxUses = this.level;
    }

    copy(newOwner: Pet): WildebeestAbility {
        return new WildebeestAbility(newOwner, this.logService);
    }
}