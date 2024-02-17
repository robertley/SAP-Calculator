import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Lynx extends Pet {
    name = "Lynx";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 5;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger: boolean) {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        let power = 0;
        for (let pet of this.parent.petArray) {
            power += pet.level;
        }

        let targets = opponent.getRandomPets(this.level, null, null, true);
        for (let target of targets) {
            this.snipePet(target, power, true, tiger);
        }

        super.superStartOfBattle(gameApi, tiger);
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