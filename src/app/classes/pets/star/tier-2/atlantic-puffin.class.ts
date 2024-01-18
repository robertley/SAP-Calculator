import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class AtlanticPuffin extends Pet {
    name = "Atlantic Puffin";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let strawPets = this.parent.getPetsWithEquipment('Strawberry').filter(pet => pet !== this);
        let opponent = getOpponent(gameApi, this.parent);
        for (let i = 0; i < this.level; i++) {
            for (let j = 0; j < strawPets.length; j++) {
                let target = opponent.getRandomPet(null, null, true);
                if (target == null) {
                    break;
                }
                this.snipePet(target, 2, true, tiger);
            }
        }
        this.superStartOfBattle(gameApi, tiger);
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