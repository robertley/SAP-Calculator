import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GeometricTortoise extends Pet {
    name = "Geometric Tortoise";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 3;
    health = 10;
    private damageTakenList = [];
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let damageTaken = this.damageTakenList.shift()
        if (damageTaken == null) {
            return;
        }
        // Deal percentage of damage taken as damage to one random enemy
        let reflectPercentage = this.level * 0.33; // 33%/66%/100% based on level
        if (this.level == 3) {
            reflectPercentage = 1;
        }
        let reflectDamage = Math.floor(damageTaken * reflectPercentage);
        if (reflectDamage > 0) {
            let target = this.parent.opponent.getRandomPet([], false, true);
            if (target) {
                this.snipePet(target, reflectDamage, true, tiger);
            }
        }

        this.superHurt(gameApi, pet, tiger);
    }

    dealDamage(amt: number): void {
        this.damageTakenList.push(amt);
        super.dealDamage(amt);
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