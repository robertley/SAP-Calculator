import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { MeatBone } from "../../../../equipment/turtle/meat-bone.class";

export class WhiteBelliedHeronAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WhiteBelliedHeronAbility',
            owner: owner,
            triggers: ['StartBattle'],
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

        let targetResp = owner.parent.nearestPetsAhead(1, owner);
        if (targetResp.pets.length == 0) {
            return;
        }
        let pet = targetResp.pets[0];

        let equipment = new MeatBone();
        equipment.multiplier += this.level - 1;
        pet.givePetEquipment(equipment);
        let effectMessage = ".";
        if (this.level === 2) {
            effectMessage = " twice for double effect.";
        } else if (this.level === 3) {
            effectMessage = " thrice for triple effect.";
        }

        this.logService.createLog({
            message: `${owner.name} made ${pet.name} Meat Bone${effectMessage}`,
            type: "ability",
            player: owner.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WhiteBelliedHeronAbility {
        return new WhiteBelliedHeronAbility(newOwner, this.logService);
    }
}