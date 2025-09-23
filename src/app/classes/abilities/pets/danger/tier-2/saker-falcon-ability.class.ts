import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class SakerFalconAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'SakerFalconAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 3,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        // Check if outnumbered by comparing team sizes (petArray already excludes dead pets)
        let myAlivePets = owner.parent.petArray.length;
        let enemyAlivePets = owner.parent.opponent.petArray.length;

        if (myAlivePets < enemyAlivePets) {
            let targetResp = owner.parent.getThis(owner);
            let target = targetResp.pet;

            if (!target) {
                return;
            }

            let power = this.level * 2;
            target.increaseAttack(power);
            target.increaseHealth(power);

            this.logService.createLog({
                message: `${owner.name} gave ${target.name} ${power} attack and ${power} health (outnumbered)`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): SakerFalconAbility {
        return new SakerFalconAbility(newOwner, this.logService);
    }
}