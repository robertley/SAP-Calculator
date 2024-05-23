import { AbilityService } from "../../../services/ability.service";
import { GameService } from "../../../services/game.service";
import { LogService } from "../../../services/log.servicee";
import { PetService } from "../../../services/pet.service";
import { Equipment, EquipmentClass } from "../../equipment.class";
import { Pet } from "../../pet.class";
import { Panther } from "../../pets/puppy/tier-5/panther.class";

export class Popcorn extends Equipment {
    name = 'Popcorn';
    equipmentClass: EquipmentClass = 'faint';
    callback = (pet: Pet) => {
        let multiplier = 1;
        if (pet instanceof Panther) {
            multiplier = 1 + pet.level;
        }

        for (let i = 0; i < multiplier; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    let petPool;
                    if (pet.parent == this.gameService.gameApi.player) {
                        petPool = this.gameService.gameApi.playerPetPool;
                    } else {
                        petPool = this.gameService.gameApi.opponentPetPool;
                    }
                    let pets = petPool.get(pet.tier);
                    let petName = pets[Math.floor(Math.random() * pets.length)];
                    let popcornPet = this.petSerivce.createPet({
                        attack: null,
                        equipment: null,
                        exp: 0,
                        health: null,
                        name: petName,
                        mana: 0
                    }, pet.parent);
        
                    let pantherMessage = '';
                    if (i > 0) {
                        pantherMessage = ` (Panther)`;
                    }
                    this.logService.createLog(
                        {
                            message: `${pet.name} Spawned ${popcornPet.name} (Popcorn)${pantherMessage}`,
                            type: "ability",
                            player: pet.parent,
                            randomEvent: true
                        }
                    )
                    pet.parent.summonPet(popcornPet, pet.savedPosition);
                    this.abilityService.triggerSummonedEvents(popcornPet);
                },
                priority: -1
            })
        }
    }

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        protected petSerivce: PetService,
        protected gameService: GameService

    ) {
        super()
    }

}