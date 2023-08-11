import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Chili } from "../../../equipment/turtle/chili.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tahr extends Pet {
    name = "Tahr";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 5;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.petBehind() == null) {
            return;
        }
        let pet = this.petBehind();
        let petsBehind = [pet];
        while (pet.petBehind() != null) {
            pet = pet.petBehind();
            petsBehind.push(pet);
        }
        let count = 1;
        for (let pet of petsBehind) {
            if (count > this.level) {
                break;
            }
            if (pet.equipment instanceof Chili) {
                continue;
            }
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Chili.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
            })
            pet.givePetEquipment(new Chili(this.logService, this.abilityService));
            count++;
        }
        this.superFaint(gameApi, tiger);
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