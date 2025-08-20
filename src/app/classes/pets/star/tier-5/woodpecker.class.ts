import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Woodpecker extends Pet {
    name = "Woodpecker";
    tier = 5;
    pack: Pack = 'Star';
    attack = 6;
    health = 5;
    
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let triggers = this.level * 2; // L1=2, L2=4, L3=6 triggers
        
        for (let i = 0; i < triggers; i++) {
            // Find the nearest two pets ahead
            let targets = this.getPetsAhead(2, true)
            for (let target of targets) {
                this.snipePet(target, 2, false, tiger);
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