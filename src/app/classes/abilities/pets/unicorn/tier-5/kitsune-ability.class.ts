import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class KitsuneAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'KitsuneAbility',
            owner: owner,
            triggers: ['None'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;
        if (owner.petAhead == null) {
            return;
        }
        let mana = 0;
        for (let pet of owner.parent.petArray) {
            if (pet.mana > 0) {
                mana += pet.mana;
                pet.mana = 0;
                this.logService.createLog({
                    message: `${owner.name} took ${mana} mana from ${pet.name}.`,
                    type: "ability",
                    player: owner.parent,
                    tiger: tiger,
                });
            }
        }

        let buffTargetsAheadResp = owner.parent.nearestPetsAhead(1, owner);
        if (buffTargetsAheadResp.pets.length == null) {
            return;
        }
        let buffTarget = buffTargetsAheadResp.pets[0];
        this.logService.createLog({
            message: `${owner.name} gave ${buffTarget.name} +${mana + owner.level * 2} mana.`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            randomEvent: buffTargetsAheadResp.random
        });

        buffTarget.increaseMana(mana + owner.level * 2);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): KitsuneAbility {
        return new KitsuneAbility(newOwner, this.logService);
    }
}