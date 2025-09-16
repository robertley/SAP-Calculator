import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Silly } from "app/classes/equipment/ailments/silly.class";

export class TreeKangaroo extends Pet {
    name = "Tree Kangaroo";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 3;
    health = 5;

    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let petsWithPerk = this.parent.opponent.getPetsWithEquipment('perk');
        let petsWithSilly = this.parent.opponent.getPetsWithEquipment('Silly');
        let excludePets = [...petsWithPerk, ...petsWithSilly];
        let targetResp = this.parent.opponent.getLastPet(excludePets, this);
        let targetPet = targetResp.pet;
        if (targetPet) {
            targetPet.givePetEquipment(new Silly());
            this.logService.createLog({
                message: `${this.name} gave ${targetPet.name} Silly`,
                type: 'ability',
                tiger: tiger,
                player: this.parent,
                randomEvent: targetResp.random
            })
        }
        //TO DO: Add Activation and can't activate itself
        super.superStartOfBattle(gameApi, tiger);
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