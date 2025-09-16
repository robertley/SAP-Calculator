import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Tasty } from "../../../equipment/ailments/tasty.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SeaCucumber extends Pet {
    name = "Sea Cucumber";
    tier = 5;
    pack: Pack = 'Custom';
    health = 5;
    attack = 3;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let excludePets = this.parent.opponent.getPetsWithEquipment('Toasty')
        let targetResp = this.parent.opponent.getRandomPets(this.level, excludePets, false, true, this);
        let targets = targetResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            let tasty = new Tasty(this.logService, this.abilityService);
            target.givePetEquipment(tasty);
            this.logService.createLog({
                message: `${this.name} made ${target.name} Tasty`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
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