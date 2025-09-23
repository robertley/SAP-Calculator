import { Ability } from "../../../../ability.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet.service";
import { AbilityService } from "app/services/ability.service";

export class BayCatAbility extends Ability {
    private logService: LogService;
    private petService: PetService;
    private abilityService: AbilityService;

    constructor(owner: Pet, logService: LogService, petService: PetService, abilityService: AbilityService) {
        super({
            name: 'BayCatAbility',
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
        this.petService = petService;
        this.abilityService = abilityService;
    }

    private executeAbility(gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean): void {
        const owner = this.owner;

        let bayPool = [
            "Skunk", "Fossa", "Kraken", "Lynx", "Humphead Wrasse", "Goblin Shark", "Red Lipped Batfish", "Platybelodon", "Tasmanian Devil"
        ];

        for (let i = 0; i < owner.level; i++) {
            let petName = bayPool[Math.floor(Math.random() * bayPool.length)];
            let summonedPet = this.petService.createPet({
                name: petName,
                attack: null,
                health: null,
                equipment: null,
                mana: 0,
                exp: 0
            }, owner.parent);

            let summonResult = owner.parent.summonPet(summonedPet, owner.savedPosition, false, owner);
            if (summonResult.success) {
                this.logService.createLog({
                    message: `${owner.name} summoned ${summonedPet.name}`,
                    type: 'ability',
                    player: owner.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: true
                });

                // Activate start of battle ability
                if (summonedPet.hasAbility('StartBattle')) {
                    this.logService.createLog({
                        message: `${summonedPet.name} activated its start of battle ability`,
                        type: 'ability',
                        player: owner.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    });
                    summonedPet.activateAbilities('StartBattle', gameApi, 'Pet');
                }
            }
        }

        // Tiger system: trigger Tiger execution at the end
        this.triggerTigerExecution(gameApi, triggerPet, tiger, pteranodon);
    }

    copy(newOwner: Pet): BayCatAbility {
        return new BayCatAbility(newOwner, this.logService, this.petService, this.abilityService);
    }
}