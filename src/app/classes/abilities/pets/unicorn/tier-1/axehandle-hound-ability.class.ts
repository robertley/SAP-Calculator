import { Ability } from "../../../../ability.class";
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
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
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
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let targetsResp = owner.parent.opponent.getAll(false, owner);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }

        for (let target of targets) {
            owner.snipePet(target, this.level * 2, true, tiger);
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): AxehandleHoundAbility {
        return new AxehandleHoundAbility(newOwner, this.logService);
    }
}