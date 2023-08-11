import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Ink } from "../../../equipment/ailments/ink.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Cuttlefish extends Pet {
    name = "Cuttlefish";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 8;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponentPets = this.parent.opponent.petArray;
        let targets: Pet[] = [];
        for (let i = 0; i < this.level; i++) {
            let target = opponentPets[opponentPets.length - (i + 1)];
            if (target == null) {
                break;
            }
            targets.push(target);
        }
        for (let target of targets) {
            target.givePetEquipment(new Ink());
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Ink.`,
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