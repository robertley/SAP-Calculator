import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO research order of ailment removal
export class Frigatebird extends Pet {
    name = "Frigatebird";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 1;
    abilityCounter = 0;
    friendGainedAilment(gameApi: GameAPI, pet?: Pet): void {
        if (this.abilityCounter >= this.level) {
            return;
        }
        if (pet == this) {
            return;
        }
        let equipment = pet.equipment;
        pet.equipment = null;
        this.abilityCounter++;
        this.logService.createLog({
            message: `${this.name} removed ${equipment.name} from ${pet.name}.`,
            type: 'ability',
            player: this.parent
        })
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

    resetPet(): void {
        this.abilityCounter = 0;
        super.resetPet();
    }
}