import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mothman extends Pet {
    name = "Mothman";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponetPets = this.parent.opponent.petArray;
        let ailmentPets = opponetPets.filter(pet => {
            if (pet.equipment == null) {
                return false;
            }
            return pet.equipment.equipmentClass == 'ailment-attack'
            || pet.equipment.equipmentClass == 'ailment-defense'
            || pet.equipment.equipmentClass == 'ailment-other';
        });
        shuffle(ailmentPets);
        for (let i = 0; i < this.level; i++) {
            if (ailmentPets[i]) {
                this.snipePet(ailmentPets[i], 2, true, tiger);
            }
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