import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.trumpets < 1) {
            return;
        }
        let hasTarget = false;
        let targets = this.parent.opponent.petArray.filter(pet => {
            return pet.health > 0 && pet.equipment?.name != 'Ink';
        })
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
                tiger: tiger,
                pteranodon: pteranodon,
            })
        }
        if (hasTarget) {
            this.parent.spendTrumpets(1, this, pteranodon);
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