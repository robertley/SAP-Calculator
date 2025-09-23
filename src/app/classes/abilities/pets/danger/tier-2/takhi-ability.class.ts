import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { PetService } from "app/services/pet.service";

export class TakhiAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private petService: PetService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, petService: PetService) {
        super({
            name: 'TakhiAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
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

        let attackValue = this.level * 3;
        let healthValue = this.level * 2;

        let africanWildDog = this.petService.createPet({
            name: 'African Wild Dog',
            attack: attackValue,
            health: healthValue,
            exp: 0,
            mana: 0,
            equipment: null
        }, owner.parent);

        if (africanWildDog) {
            let summonResult = owner.parent.summonPet(africanWildDog, owner.savedPosition, false, owner);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} summoned a ${africanWildDog.attack}/${africanWildDog.health} ${africanWildDog.name}`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: summonResult.randomEvent
                });
                africanWildDog.activateAbilities('StartBattle', gameApi, 'Pet');
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): TakhiAbility {
        return new TakhiAbility(newOwner, this.logService, this.abilityService, this.petService);
    }
}