import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Honey } from "app/classes/equipment/turtle/honey.class";

export class Bear extends Pet {
    name = "Bear";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 3;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
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
            pet.givePetEquipment(new Honey(this.logService, this.abilityService));
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Honey.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
        }
        
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