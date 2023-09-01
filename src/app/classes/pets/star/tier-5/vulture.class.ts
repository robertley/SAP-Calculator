import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Vulture extends Pet {
    name = "Vulture";
    tier = 5;
    pack: Pack = 'Star';
    attack = 4;
    health = 3;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!tiger) {
            this.abilityUses++;
        }
        if (this.abilityUses % 2 == 1) {
            return;
        }
        let opponent = this.parent.opponent;
        let target = opponent.getRandomPet();
        if (target == null) {
            return;
        }
        let power = this.level * 4;
        this.snipePet(target, power, true, tiger);
        this.superFriendFaints(gameApi, pet, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}