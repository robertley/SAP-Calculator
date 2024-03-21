import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Jackalope extends Pet {
    name = "Jackalope";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 3;
    // TODO check if sniping before drop bear is correct
    friendJumped(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let target = this.parent.opponent.getRandomPet();
        if (target == null) {
            return;
        }

        this.snipePet(target, this.level * 2, true, tiger);
        this.superFriendJumped(gameApi, pet, tiger);
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