import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class PteranodonAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;
    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'PteranodonAbility',
            owner: owner,
            triggers: ['FriendDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            maxUses: owner.level,
            condition: (owner: Pet, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): boolean => {
                if (triggerPet == null) {
                    return false;
                }
                return true;
            },
            abilityFunction: (gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean) => {
                this.executeAbility(gameApi, triggerPet, tiger, pteranodon);
            }
        });
        this.logService = logService;
        this.abilityService = abilityService;
        this.petService = petService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let summonPet = this.petService.createPet({
            attack: 1,
            health: 1,
            equipment: null,
            exp: triggerPet.exp,
            name: triggerPet.name,
            mana: 0
        }, owner.parent);

        let result = owner.parent.summonPetBehind(owner, summonPet);
        if (result.success) {
            this.logService.createLog({
                message: `${owner.name} summoned a 1/1 ${triggerPet.name} behind it.`,
                type: 'ability',
                player: owner.parent,
                randomEvent: result.randomEvent,
                tiger: tiger,
                pteranodon: pteranodon
            });
            this.abilityService.triggerFriendSummonedEvents(summonPet);
        }
        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    reset(): void {
        super.reset();
        this.maxUses = this.level;
    }

    copy(newOwner: Pet): PteranodonAbility {
        return new PteranodonAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}