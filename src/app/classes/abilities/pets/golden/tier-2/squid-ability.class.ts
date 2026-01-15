import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Inked } from "../../../../equipment/ailments/inked.class";

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
            condition: (context: AbilityContext): boolean => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                if (owner.parent.trumpets < 1) {
                    return false;
                }
                true;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;

        let hasTarget = false;
        let excludePets = owner.parent.opponent.getPetsWithEquipment("Inked");
        let targetResp = owner.parent.opponent.getFurthestUpPets(this.level, excludePets, owner);
        let targets = targetResp.pets;

        for (let target of targets) {
            if (target == null) {
                break;
            }
            hasTarget = true;
            target.givePetEquipment(new Inked());
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} Inked.`,
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
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SquidAbility {
        return new SquidAbility(newOwner, this.logService);
    }
}
