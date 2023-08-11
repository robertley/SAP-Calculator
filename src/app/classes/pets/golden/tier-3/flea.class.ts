import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class Flea extends Pet {
    name = "Flea";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 1;
    faint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = clone(this.parent.opponent.petArray);
        shuffle(targets);
        targets = targets.sort((a, b) => {
            return a.health > b.health ? -1 : b.health > a.health ? 1 : 0;
        }).filter((target) => {
            return target.equipment?.name != 'Weak';
        });
        for (let i = 0; i < this.level; i++) {
            let target = targets[i];
            if (target == null) {
                break;
            }
            target.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Weak.`,
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
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}