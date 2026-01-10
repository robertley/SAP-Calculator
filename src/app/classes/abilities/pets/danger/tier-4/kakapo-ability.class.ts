import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { Spooked } from "../../../../equipment/ailments/spooked.class";

// After first attack: Make the highest attack enemy Spooked and push it to the back.
export class KakapoAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'KakapoAbility',
            owner: owner,
            triggers: ['ThisFirstAttack'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 2,
            condition: (context: AbilityContext) => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                return owner.timesAttacked <= 1;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {

        const { gameApi, triggerPet, tiger, pteranodon } = context; const owner = this.owner;
        // Effect 1: Spooked
        let spookTargetsResp = owner.parent.opponent.getHighestAttackPets(this.level, undefined, owner);
        for (let target of spookTargetsResp.pets) {
            target.givePetEquipment(new Spooked());
            this.logService.createLog({
                message: `${owner.name} gave ${target.name} Spooked.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: spookTargetsResp.random
            });
        }
        // Effect 2: Push
        let pushTargetsResp = owner.parent.opponent.getHighestAttackPets(this.level, undefined, owner);
        for (let target of pushTargetsResp.pets) {
            target.parent.pushPetToBack(target);
            this.logService.createLog({
                message: `${owner.name} pushed ${target.name} to the back.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                randomEvent: pushTargetsResp.random
            });
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): KakapoAbility {
        return new KakapoAbility(newOwner, this.logService);
    }
}