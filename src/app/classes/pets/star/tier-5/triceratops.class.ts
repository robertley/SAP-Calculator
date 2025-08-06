import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Triceratops extends Pet {
    name = "Triceratops";
    tier = 5;
    pack: Pack = 'Star';
    attack = 5;
    health = 6;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let target = this.parent.getRandomPet([this], true, null, true);
        let power = this.level * 3;
        if (target == null) {
            return;
        }
        target.increaseAttack(power);
        target.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        });
        this.superHurt(gameApi, pet, tiger);
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