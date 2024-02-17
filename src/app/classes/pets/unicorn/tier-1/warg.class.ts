import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Warg extends Pet {
    name = "Warg";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 2;
    gainedMana(gameApi: GameAPI, tiger?: boolean): void {

        let targets = this.parent.opponent.getRandomPets(this.level);

        for (let target of targets) {
            this.snipePet(target, 1, true, tiger);
        }

        this.superGainedMana(gameApi, tiger);

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