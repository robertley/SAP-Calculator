import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class DoveAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'DoveAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
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

        let excludePets = owner.parent.petArray.filter(pet => {
            return pet == owner || pet.equipment?.name != 'Strawberry'
        });
        let targetResp = owner.parent.getRandomPets(3, excludePets, null, null, owner);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let target of targets) {
            if (target.equipment.name != 'Strawberry') {
                continue;
            }
            this.logService.createLog({
                message: `${owner.name} activated ${target.name}'s Strawberry.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random,
                pteranodon: pteranodon
            });

            let backMostPetResp = target.parent.getLastPet(null, target);
            let backMostPet = backMostPetResp.pet;
            let power = this.level + backMostPet.equipment.multiplier - 1;
            backMostPet.increaseAttack(power);
            backMostPet.increaseHealth(power);
            this.logService.createLog({
                message: `${target.name} gave ${backMostPet.name} ${power} attack ${power} health (Strawberry) (x${this.level} ${owner.name}).`,
                type: 'equipment',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): DoveAbility {
        return new DoveAbility(newOwner, this.logService);
    }
}