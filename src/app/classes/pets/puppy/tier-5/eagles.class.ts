import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Eagle extends Pet {
    name = "Eagle";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 6;
    health = 5;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let tier = Math.min(6, gameApi.previousShopTier + 1);
        let pets;
        if (this.parent == gameApi.player) {
            pets = gameApi.playerPetPool.get(tier);
        } else {
            pets = gameApi.opponentPetPool.get(tier);
        }
        let petName = pets[Math.floor(Math.random() * pets.length)];
        let power = this.level * 5;
        let pet = this.petService.createPet({
            name: petName,
            attack: power,
            health: power,
            exp: this.minExpForLevel,
            equipment: null,
            mana: 0
        }, this.parent);

        this.logService.createLog(
            {
                message: `${this.name} spawned ${pet.name} Level ${pet.level}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                randomEvent: true,
                pteranodon: pteranodon
            }
        )

        if (this.parent.summonPet(pet, this.savedPosition)) {
            this.abilityService.triggerSummonedEvents(pet);
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}