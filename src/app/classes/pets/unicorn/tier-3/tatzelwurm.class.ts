import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tatzelwurm extends Pet {
    name = "Tatzelwurm";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 3;
    friendAheadFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 2;
        if(pet.level == 3) {
            power = power * 2;
        }
        let target = this.parent.opponent.getRandomPet();
        this.snipePet(target, power, true, tiger);
        this.superFriendAheadFaints(gameApi, pet, tiger);
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