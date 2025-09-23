import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class ChameleonAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'ChameleonAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                return owner.parent.toy != null;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let toy = owner.parent.toy;
        let toyLevel = toy.level;
        toy.level = this.level;
        this.logService.createLog({
            message: `${owner.name} activated ${toy.name}.`,
            type: 'ability',
            player: owner.parent,
            pteranodon: pteranodon,
        });
        //TO DO: This logic would trigger puma
        if (toy.onBreak) {
            owner.parent.breakToy(true);
        }
        if (toy.startOfBattle) {
            toy.startOfBattle(gameApi);
        }
        toy.level = toyLevel;

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): ChameleonAbility {
        return new ChameleonAbility(newOwner, this.logService);
    }
}