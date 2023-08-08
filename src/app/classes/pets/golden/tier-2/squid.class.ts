import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Ink } from "../../../equipment/ailments/ink.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Squid extends Pet {
    name = "Squid";
    tier = 2;
    pack: Pack = 'Golden';
    attack = 5;
    health = 2;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        if (this.parent.trumpets < 1) {
            return;
        }
        let hasTarget = false;
        let targets = this.parent.opponent.petArray.filter(pet => {
            return pet.health > 0 && pet.equipment?.name != 'Ink';
        })
        console.log(targets);
        for (let i = 0; i < this.level; i++) {
            let target = targets[i];
            if (target == null) {
                break;
            }
            hasTarget = true;
            target.givePetEquipment(new Ink());
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Ink.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
            console.log(cloneDeep(target));
        }
        if (hasTarget) {
            this.parent.gainTrumpets(-1);
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