import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Kitsune extends Pet {
    name = "Kitsune";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 7;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.petAhead == null) {
            return;
        }

        let mana = pet.mana;

        if (mana == 0) {
            return;
        }

        pet.mana = 0;

        let target = this.petAhead;

        this.logService.createLog({
            message: `${this.name} took ${mana} mana from ${pet.name} and gave it to ${target.name} +${this.level * 2}.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        });

        target.increaseMana(mana + this.level * 2);
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