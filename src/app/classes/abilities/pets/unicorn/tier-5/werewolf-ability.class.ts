import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class WerewolfAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'WerewolfAbility',
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

        if (gameApi.day) {
            const manaGain = this.level * 6;
            let targetResp = owner.parent.getThis(owner);
            let target = targetResp.pet;
            if (target == null) {
                return;
            }

            target.increaseMana(manaGain);
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${manaGain} mana.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger
            });
        } else {
            let targetResp = owner.parent.getThis(owner);
            let target = targetResp.pet;
            if (target == null) {
                return;
            }
            let power = this.level * 0.5;
            const attackGain = Math.floor(owner.attack * power);
            const healthGain = Math.floor(owner.health * power);
            let attack = Math.min(50, owner.attack + attackGain);
            let health = Math.min(50, owner.health + healthGain);
            this.logService.createLog({
                message: `${owner.name} increased ${target.name}'s stats by ${power * 100}% (${attack}/${health}).`,
                type: "ability",
                player: owner.parent,
                tiger: tiger
            });
            target.increaseAttack(owner.attack * power);
            target.increaseHealth(owner.health * power);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): WerewolfAbility {
        return new WerewolfAbility(newOwner, this.logService);
    }
}