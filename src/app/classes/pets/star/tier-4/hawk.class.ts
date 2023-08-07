import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hawk extends Pet {
    name = "Hawk";
    tier = 4;
    pack: Pack = 'Star';
    attack = 4;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = this.parent.opponent;
        let position = this.position;
        let target = opponent.getPetAtPosition(this.position);

        // find closes pet, behind or forward
        let distance = 1;
        while (target == null && distance < 5) {
            target = opponent.getPetAtPosition(position + distance);
            if (target == null) {
                target = opponent.getPetAtPosition(position - distance);
            }
            distance++;
        }
        if (target == null) {
            return;
        }
        let power = this.level * 7;
        this.snipePet(target, power, false, tiger);
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