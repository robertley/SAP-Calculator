import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Silly } from "../../../../equipment/ailments/silly.class";

export class TreeKangarooAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'TreeKangarooAbility',
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

        let petsWithPerk = owner.parent.opponent.getPetsWithEquipment('perk');
        let petsWithSilly = owner.parent.opponent.getPetsWithEquipment('Silly');
        let excludePets = [...petsWithPerk, ...petsWithSilly].filter(pet => {return pet.name == 'Tree Kangaroo'});
        let targetResp = owner.parent.opponent.getLastPet(excludePets, owner);
        let targetPet = targetResp.pet;

        if (targetPet) {
            targetPet.givePetEquipment(new Silly());
            this.logService.createLog({
                message: `${owner.name} gave ${targetPet.name} Silly`,
                type: 'ability',
                tiger: tiger,
                player: owner.parent,
                randomEvent: targetResp.random
            });
        }
        for (let i = 0; i < this.level; i++) {
            let activationTargetResp = owner.parent.getSpecificPet(owner,targetPet);
            let activationTarget = activationTargetResp.pet;
            if (activationTarget) {
                this.logService.createLog({
                    message: `${owner.name} activated ${targetPet.name}'s ability.`,
                    type: 'ability',
                    tiger: tiger,
                    player: owner.parent,
                    randomEvent: targetResp.random
                });
                activationTarget.activateAbilities(undefined, gameApi, 'Pet');
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TreeKangarooAbility {
        return new TreeKangarooAbility(newOwner, this.logService);
    }
}