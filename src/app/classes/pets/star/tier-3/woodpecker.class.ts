import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Woodpecker extends Pet {
    name = "Woodpecker";
    tier = 3;
    pack: Pack = 'Star';
    attack = 4;
    health = 3;
    uses = 0;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = this.parent.opponent;
        for (let i = 0; i < this.level; i++) {
            let target1 = this.petAhead;
            let target2;
            if (target1 == null) {
                target1 = opponent.furthestUpPet;
                target2 = target1?.petBehind();
            } else {
                target2 = target1.petAhead;
                if (target2 == null) {
                    target2 = opponent.furthestUpPet;
                }
            }
            if (target1 != null) {
                this.snipePet(target1, 2, false, tiger);
            }
            if (target2 != null) {
                this.snipePet(target2, 2, false, tiger);
            }
        }
        this.superStartOfBattle(gameApi, tiger);
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