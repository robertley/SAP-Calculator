import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Lion extends Pet {
    name = "Lion";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 6;
    health = 6;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let otherPets = this.parent.petArray.filter(pet => pet !== this);
        let highestTier = 0;
        for (let pet of otherPets) {
            if (pet.tier > highestTier) {
                highestTier = pet.tier;
            }
        }
        let power = .5 * this.level;
        if (this.tier <= highestTier) {
            return;
        }
        this.increaseAttack(Math.floor(this.attack * power));
        this.increaseHealth(Math.floor(this.health * power));
        this.logService.createLog({
            message: `${this.name} increased its attack and health by ${power * 100}% (${this.attack}/${this.health})`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
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