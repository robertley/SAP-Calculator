import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { Rock } from "../../../../pets/hidden/rock.class";

export class CockatriceAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService) {
        super({
            name: 'CockatriceAbility',
            owner: owner,
            triggers: ['StartBattle'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targets = owner.parent.opponent.petArray.reverse();
        let target = null;
        for (let pet of targets) {
            if (pet.level <= this.level) {
                target = pet;
                break;
            }
        }
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${owner.name} transformed ${target.name} into a Rock.`,
            type: 'ability',
            player: owner.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });
        let rock = new Rock(this.logService, this.abilityService, target.parent, target.health, target.attack, target.mana, target.exp, target.equipment);
        let position = target.position;
        owner.parent.opponent.setPet(position, rock, false);

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): CockatriceAbility {
        return new CockatriceAbility(newOwner, this.logService, this.abilityService);
    }
}