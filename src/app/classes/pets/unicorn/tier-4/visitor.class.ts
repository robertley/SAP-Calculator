import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Icky } from "../../../equipment/ailments/icky.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Visitor extends Pet {
    name = "Visitor";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 7;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetResp = this.parent.getPetsWithinXSpaces(this, this.level);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        //TO DO: Add Icky
        for (let target of targets) {
            target.givePetEquipment(new Icky());
            this.logService.createLog({
                message: `${this.name} made ${target.name} Icky.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
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