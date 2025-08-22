import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class Salmon extends Pet {
    name = "Salmon";
    tier = 1;
    pack: Pack = 'Star';
    attack = 1;
    health = 1;
    hidden = true;

    summoned(gameApi: GameAPI, tiger?: boolean): void {
        // Calculate number of attacks based on health (every 25 health)
        let attacks = 1 + Math.floor(this.health / 25);
        
        let damage = this.level * 5;
        
        for (let i = 0; i < attacks; i++) {
            let target = this.parent.opponent.getRandomPet([], false, true);
            if (target) {
                this.snipePet(target, damage, true, tiger);
            }
        }
        
        this.superSummoned(gameApi, tiger);
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