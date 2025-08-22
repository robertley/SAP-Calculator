import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Butterfly } from "../../hidden/butterfly.class";

export class Caterpillar extends Pet {
    name = "Caterpillar";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (this.level < 3) {
            return;
        }
        let butterfly = new Butterfly(this.logService, this.abilityService, this.parent, 1, 1, this.mana, this.exp, this.equipment);
        this.parent.setPet(this.position, butterfly);
        this.logService.createLog({
            message: `${this.name} transformed into a Butterfly.`,
            type: 'ability',
            player: this.parent
        })
        this.parent.transformPet(this, butterfly);
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