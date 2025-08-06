import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Alchemedes extends Pet {
    name = "Alchemedes";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 4;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.petAhead;
        if (target == null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${this.level} mana.`,
            type: "ability",
            player: this.parent,
            randomEvent: false,
        })

        target.increaseMana(this.level);

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