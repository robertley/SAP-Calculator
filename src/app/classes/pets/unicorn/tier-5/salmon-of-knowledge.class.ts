import { getOpponent } from "app/util/helper-functions";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SalmonOfKnowledge extends Pet {
    name = "Salmon of Knowledge";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 2;
        let targets = [];
        
        // Get 2 furthest up pets from friendly team
        let friendlyTargets = this.parent.getFurthestUpPets(2, null, this);
        targets.push(...friendlyTargets.pets);
        
        // Get 2 furthest up pets from enemy team
        let enemyTargets = this.parent.opponent.getFurthestUpPets(2, null, this);
        targets.push(...enemyTargets.pets);
        
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} exp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: friendlyTargets.random || enemyTargets.random
            });
            target.increaseExp(power);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}