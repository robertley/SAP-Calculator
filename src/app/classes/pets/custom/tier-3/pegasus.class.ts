import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pegasus extends Pet {
    name = "Pegasus";
    tier = 3;
    pack: Pack = 'Custom';
    attack = 1;
    health = 3;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        let targetsResp = this.parent.getRandomPets(3, [this], true, false, this);
        for (let target of targetsResp.pets) {
            if (target != null) {
                target.increaseAttack(this.level);
                this.logService.createLog({
                    message: `${this.name} gave ${target.name} ${this.level} attack.`,
                    type: 'ability',
                    player: this.parent,
                    randomEvent: targetsResp.random,
                    tiger: tiger
                });
            }
        }
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