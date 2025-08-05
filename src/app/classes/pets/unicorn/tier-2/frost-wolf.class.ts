import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Cold } from "../../../equipment/ailments/cold.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class FrostWolf extends Pet {
    name = "Frost Wolf";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponetPets = this.parent.opponent.petArray;
        let targets = [];
        for (let i = 0; i < this.level; i++) {
            if (opponetPets[i]) {
                targets.push(opponetPets[i]);
            }
        }

        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Cold`,
                type: "ability",
                player: this.parent,
                tiger: tiger
            })
            target.givePetEquipment(new Cold());
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