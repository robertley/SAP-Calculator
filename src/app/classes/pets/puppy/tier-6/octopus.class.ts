import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Octopus extends Pet {
    name = "Octopus";
    tier = 6;
    pack: Pack = 'Puppy';
    attack = 8;
    health = 8;
    afterAttack(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let targets = opponent.getRandomPets(this.level, null, null, true);
        let power = 6;
        for (let target of targets) {
            if (target == null) {
                return;
            }
            this.snipePet(target, power, true, tiger);
        }
        this.superAfterAttack(gameApi, tiger);
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