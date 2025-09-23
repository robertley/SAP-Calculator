import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Ink } from "../../../../equipment/ailments/ink.class";

export class SquidAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SquidAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): boolean => {
                if (owner.parent.trumpets < 1) {
                    return false;
                }
                true;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let hasTarget = false;
        let excludePets = owner.parent.opponent.getPetsWithEquipment("Ink");
        let targetResp = owner.parent.opponent.getFurthestUpPets(this.level, excludePets, owner);
        let targets = targetResp.pets;

        for (let target of targets) {
            if (target == null) {
                break;
            }
            hasTarget = true;
            target.givePetEquipment(new Ink());
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} Ink.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetResp.random
            });
        }

        if (hasTarget) {
            owner.parent.spendTrumpets(1, owner, pteranodon);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): SquidAbility {
        return new SquidAbility(newOwner, this.logService);
    }
}