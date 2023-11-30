import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Wombat extends Pet {
    name = "Wombat";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 3;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let highestTierPets = [];
        let highestTier = 0;
        for (let pet of opponent.petArray) {
            if (pet.faint == null) {
                continue;
            }
            if (pet.tier > highestTier) {
                highestTierPets = [pet];
                highestTier = pet.tier;
            } else if (pet.tier == highestTier) {
                highestTierPets.push(pet);
            }
        }
        if (highestTierPets.length == 0) {
            return;
        }
        let randomPet = highestTierPets[Math.floor(Math.random() * highestTierPets.length)];
        this.faint = randomPet.faint.bind(this);
        this.logService.createLog({
            message: `${this.name} has copied ${randomPet.name}'s faint ability as level ${this.level}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: highestTierPets.length > 1
        })
        this.superStartOfBattle(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}