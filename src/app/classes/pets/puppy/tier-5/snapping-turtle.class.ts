import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Skewer } from "../../../equipment/puppy/skewer.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SnappingTurtle extends Pet {
    name = "Snapping Turtle";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 5;
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
            if (pet.equipment instanceof Skewer) {
                continue;
            }
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Skewer.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
            })
            pet.givePetEquipment(new Skewer(this.logService));
            count++;
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