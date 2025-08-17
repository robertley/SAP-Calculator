import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TarantulaHawk extends Pet {
    name = "Tarantula Hawk";
    tier = 6;
    pack: Pack = 'Custom';
    health = 2;
    attack = 10;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // Calculate damage per enemy: level * health removed per 10 attack
        let damagePerEnemy = Math.floor(this.attack / 10) * this.level;
        
        if (damagePerEnemy <= 0) {
            return;
        }

        // Get all alive enemies
        let opponent = this.parent == gameApi.player ? gameApi.opponet : gameApi.player;
        let enemies = opponent.petArray.filter(enemy => enemy.alive);
        
        if (enemies.length == 0) {
            return;
        }

        // Apply damage to all enemies
        for (let enemy of enemies) {
            enemy.increaseHealth(-damagePerEnemy);
            this.logService.createLog({
                message: `${this.name} removed ${damagePerEnemy} health from ${enemy.name}`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
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