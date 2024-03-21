import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class Tree extends Pet {
    name = "Tree";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 2;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let maxAttack = 6 * this.level;

        if (this.attack > maxAttack) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gained Coconut.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        
        this.givePetEquipment(new Coconut());

        this.superStartOfBattle(gameApi, tiger);
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