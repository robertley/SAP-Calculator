import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { LogService } from "app/services/log.service";

export class StinkySockAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'StinkySockAbility',
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
        const { gameApi, triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;

        // Mirror Stinky Sock toy behavior
        let opponent = owner.parent.opponent;
        let highestHealthPetResp = opponent.getHighestHealthPets(this.level, [], owner);
        let targets = highestHealthPetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            let power = .40;
            let reducedTo = Math.max(1, Math.floor(target.health * (1 - power)));
            target.health = reducedTo;
            this.logService.createLog({
                message: `${owner.name} reduced ${target.name} health by ${power * 100}% (${reducedTo})`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: highestHealthPetResp.random
            });
        }

        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): StinkySockAbility {
        return new StinkySockAbility(newOwner, this.logService);
    }
}