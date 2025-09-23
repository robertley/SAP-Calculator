import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SalmonOfKnowledgeAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SalmonOfKnowledgeAbility',
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
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let power = this.level * 2;
        let targets = [];

        // Get 2 furthest up pets from friendly team
        let friendlyTargets = owner.parent.getFurthestUpPets(2, [owner], owner);
        targets.push(...friendlyTargets.pets);

        // Get 2 furthest up pets from enemy team
        let enemyTargets = owner.parent.opponent.getFurthestUpPets(2, undefined, owner);
        targets.push(...enemyTargets.pets);

        for (let target of targets) {
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${power} exp.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: friendlyTargets.random || enemyTargets.random
            });
            target.increaseExp(power);
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SalmonOfKnowledgeAbility {
        return new SalmonOfKnowledgeAbility(newOwner, this.logService);
    }
}