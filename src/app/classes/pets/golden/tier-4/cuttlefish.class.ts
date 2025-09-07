import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
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
        let targetsResp = this.parent.opponent.getLastPets(this.level, null, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        let power = 3;
        
        for (let target of targets) {
            target.increaseHealth(-power);
            this.logService.createLog({
                message: `${this.name} reduced ${target.name} health by ${power})`,
                type: 'ability',
                player: this.parent,                
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsResp.random
            });
        }
        let InkTargetsResp = this.parent.opponent.getLastPets(this.level, null, this);
        let InkTargets = InkTargetsResp.pets;
        if (InkTargets.length == 0) {
            return;
        }
        
        for (let target of InkTargets) {
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
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}