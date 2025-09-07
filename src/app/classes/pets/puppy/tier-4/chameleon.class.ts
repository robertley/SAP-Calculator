import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Chameleon extends Pet {
    name = "Chameleon";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.parent.toy == null) {
            return;
        }

        let toy = this.parent.toy;
        let toyLevel = toy.level;
        toy.level = this.level;
        this.logService.createLog({
            message: `${this.name} activated ${toy.name}.`,
            type: 'ability',
            player: this.parent,
            pteranodon: pteranodon,
        })
        //TO DO: This logic would trigger puma
        if (toy.onBreak) {
            this.parent.breakToy(true)
        }
        if (toy.startOfBattle) {
            toy.startOfBattle(gameApi);
        }
        toy.level = toyLevel;
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