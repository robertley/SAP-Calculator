import { AbilityService } from "../../../services/ability.service";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.service";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";

export class Popcorn extends Equipment {
    name = 'Popcorn';
    equipmentClass: EquipmentClass = 'afterFaint';
    callback = (pet: Pet) => {
        let originalAfterFaint = pet.originalAfterFaint?.bind(pet);
        pet.afterFaint = (gameApi) => {
            if (originalAfterFaint != null) {
                originalAfterFaint(gameApi);
            }
            
            // Check if equipment is still equipped
            if (pet.equipment?.name != 'Popcorn') {
                return;
            }
            
            for (let i = 0; i < this.multiplier; i++) {
                let petPool;
                if (pet.parent == this.gameService.gameApi.player) {
                    petPool = this.gameService.gameApi.playerPetPool;
                } else {
                    petPool = this.gameService.gameApi.opponentPetPool;
                }
                let pets = petPool.get(pet.tier);
                let petName = pets[Math.floor(Math.random() * pets.length)];
                let popcornPet = this.petService.createPet({
                    attack: null,
                    equipment: null,
                    exp: 0,
                    health: null,
                    name: petName,
                    mana: 0
                }, pet.parent);
    
                let multiplierMessage = (i > 0) ? this.multiplierMessage : '';
                
                this.logService.createLog(
                    {
                        message: `${pet.name} Spawned ${popcornPet.name} (Popcorn)${multiplierMessage}`,
                        type: "ability",
                        player: pet.parent,
                        randomEvent: true
                    }
                )
                if (pet.parent.summonPet(popcornPet, pet.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(popcornPet);
                }
            }
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService

    ) {
        super()
    }

}