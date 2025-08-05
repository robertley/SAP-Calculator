import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO - fix bug with late trigger on start of battle abilities knocking out pets
export class Shark extends Pet {
    name = "Shark";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 2;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.health <= 0) {
            return;
        }
        if (pet == this) {
            return;
        }
        let power: Power = {
            attack: this.level * 2,
            health: this.level * 2
        }
        this.increaseAttack(power.attack);
        this.increaseHealth(power.health);
        this.logService.createLog({
            message: `${this.name} gained ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        super.superFriendFaints(gameApi, pet, tiger);
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