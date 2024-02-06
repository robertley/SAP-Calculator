import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Exposed } from "../../../equipment/ailments/exposed.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Visitor extends Pet {
    name = "Visitor";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        // stole bear logic
        let playerHoneyPets: Pet[] = [];
        let petBehind = this.petBehind();
        while (petBehind != null) {
            playerHoneyPets.push(petBehind);
            if (playerHoneyPets.length == this.level) {
                break;
            }
            petBehind = petBehind.petBehind();
        }
        let opponentHoneyPets: Pet[] = [];
        petBehind = getOpponent(gameApi, this.parent).petArray[0];
        while (petBehind != null) {
            // in case the pets trade
            if (!petBehind.alive) {
                petBehind = petBehind.petBehind();
                continue;
            }
            opponentHoneyPets.push(petBehind);
            if (opponentHoneyPets.length == this.level) {
                break;
            }
            petBehind = petBehind.petBehind();
        }
        for (let pet of [...playerHoneyPets, ...opponentHoneyPets]) {
            pet.givePetEquipment(new Exposed());
            this.logService.createLog({
                message: `${this.name} made ${pet.name} Exposed.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
        }

        this.superFaint(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
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