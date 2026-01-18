import { Ability, AbilityContext } from "../../../ability.class";
import { Pet } from "../../../pet.class";
import { Equipment } from "../../../equipment.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability/ability.service";
import { PetService } from "app/services/pet/pet.service";
import { GameService } from "app/services/game.service";

export class PopcornAbility extends Ability {
    private equipment: Equipment;
    private logService: LogService;
    private petService: PetService;

    constructor(owner: Pet, equipment: Equipment, logService: LogService, petService: PetService) {
        super({
            name: 'PopcornAbility',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Equipment',
            native: true,
            maxUses: 1, // Popcorn equipment doesn't have uses, but this should be 1 for afterFaint
            abilitylevel: 1,
            abilityFunction: (context) => {
                this.executeAbility(context);
            }
        });
        this.equipment = equipment;
        this.logService = logService;
        this.petService = petService;
    }

    private executeAbility(context: AbilityContext): void {
        const { gameApi } = context;
        const owner = this.owner;

        for (let i = 0; i < this.equipment.multiplier; i++) {
            let petPool;
            if (owner.parent == gameApi.player) {
                petPool = gameApi.playerPetPool;
            } else {
                petPool = gameApi.opponentPetPool;
            }
            let pets = petPool.get(owner.tier);
            let petName = pets[Math.floor(Math.random() * pets.length)];
            let popcornPet = this.petService.createPet({
                attack: null,
                equipment: null,
                exp: 0,
                health: null,
                name: petName,
                mana: 0
            }, owner.parent);
            let summonResult = owner.parent.summonPet(popcornPet, owner.savedPosition);
            if (summonResult.success) {
                let multiplierMessage = (i > 0) ? this.equipment.multiplierMessage : '';

                this.logService.createLog(
                    {
                        message: `${owner.name} Spawned ${popcornPet.name} (Popcorn)${multiplierMessage}`,
                        type: "ability",
                        player: owner.parent,
                        randomEvent: true
                    }
                )
            }
        }
    }
}