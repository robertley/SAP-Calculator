import { Ability, AbilityContext } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";

export class AxehandleHoundAbility extends Ability {
    private logService: LogService;
    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'AxehandleHoundAbility',
            owner: owner,
            triggers: ['BeforeThisAttacks'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: 1,
            condition: (context: AbilityContext) => {
                const { triggerPet, tiger, pteranodon } = context;
                const owner = this.owner;
                let opponentPets = owner.parent.opponent.petArray;
                let petSet: Set<string> = new Set();
                let duplicate = false;
                for (let pet of opponentPets) {
                    if (petSet.has(pet.name)) {
                        duplicate = true;
                        break;
                    } else {
                        petSet.add(pet.name);
                    }
                }
                if (duplicate == false) {
                    return false;
                }
                return true;
            },
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        
        const { gameApi, triggerPet, tiger, pteranodon } = context;const owner = this.owner;

        let targetsResp = owner.parent.opponent.getAll(false, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let target of targets) {
            owner.snipePet(target, this.level * 2, true, tiger);
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(context);
    }

    copy(newOwner: Pet): AxehandleHoundAbility {
        return new AxehandleHoundAbility(newOwner, this.logService);
    }
}