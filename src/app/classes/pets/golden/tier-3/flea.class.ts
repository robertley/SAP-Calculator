import { clone, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Weak } from "../../../equipment/ailments/weak.class";

export class Flea extends Pet {
    name = "Flea";
    tier = 3;
    pack: Pack = 'Golden';
    attack = 3;
    health = 2;
    faint(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = this.parent.opponent.getHighestHealthPets(this.level, 'Weak');
        
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Weak.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
            target.givePetEquipment(new Weak());
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