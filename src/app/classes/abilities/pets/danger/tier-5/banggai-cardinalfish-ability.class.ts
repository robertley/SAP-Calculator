import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class BanggaiCardinalfishAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'BanggaiCardinalfishAbility',
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

        let attackReduction = this.level * 6; // 6/12/18 based on level
        let minimumAttack = 4;

        let targetResp = owner.parent.getAll(true, owner); // includeOpponent = true
        for (let targetPet of targetResp.pets) {
            let newAttack = Math.max(targetPet.attack - attackReduction, minimumAttack);

            targetPet.attack = newAttack;
            this.logService.createLog({
                message: `${owner.name} reduced ${targetPet.name} attack by ${attackReduction} to (${newAttack}).`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BanggaiCardinalfishAbility {
        return new BanggaiCardinalfishAbility(newOwner, this.logService);
    }
}