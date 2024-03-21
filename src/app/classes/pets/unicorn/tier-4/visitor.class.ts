import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Exposed } from "../../../equipment/ailments/exposed.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Visitor extends Pet {
    name = "Visitor";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {

        let targets = [
            ...this.getPetsAhead(this.level, true),
            ...this.getPetsBehind(this.level)
        ];

        for (let target of targets) {
            target.givePetEquipment(new Exposed());
            this.logService.createLog({
                message: `${this.name} made ${target.name} Exposed.`,
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