import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Murmel extends Pet {
    name = "Murmel";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    anyoneLevelUp(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.parent != this.parent) {
            return;
        }

        let power: Power = {
            attack: this.level,
            health: this.level * 2
        }

        this.logService.createLog({
            message: `${this.name} gained ${power.attack} attack ${power.health} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.increaseAttack(power.attack);
        this.increaseHealth(power.health);

        this.superAnyoneLevelUp(gameApi, pet, tiger);

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