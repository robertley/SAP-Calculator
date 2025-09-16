import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RedDragon extends Pet {
    name = "Red Dragon";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 8;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let excludePets = this.parent.opponent.getPetsWithEquipment('Crisp');
        let targetsResp = this.parent.opponent.getLastPets(this.level, excludePets, this);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Crisp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            });
            target.givePetEquipment(new Crisp());
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