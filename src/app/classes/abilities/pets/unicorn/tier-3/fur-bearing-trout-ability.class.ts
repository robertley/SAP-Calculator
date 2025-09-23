import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Rambutan } from "../../../../equipment/unicorn/rambutan.class";

export class FurBearingTroutAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'FurBearingTroutAbility',
            owner: owner,
            triggers: ['BeforeThisDies'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targets = [];

        let tempPet: Pet = owner;
        while (targets.length < this.level) {
            let target: Pet = tempPet.petBehind();

            if (target == null) {
                break;
            }

            if (target.equipment instanceof Rambutan) {
                tempPet = target;
                continue;
            }

            targets.push(target);
            tempPet = target;
        }

        if (targets.length === 0) {
            return;
        }

        for (let target of targets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} a Rambutan.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
            });

            target.givePetEquipment(new Rambutan(this.logService));
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): FurBearingTroutAbility {
        return new FurBearingTroutAbility(newOwner, this.logService);
    }
}