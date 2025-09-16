import { shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class Therizinosaurus extends Pet {
    name = "Therizinosaurus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 3;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let excludePets = this.parent.getPetsWithoutEquipment('Strawberry');
        let targetsResp = this.parent.getFurthestUpPets(this.level, excludePets, this)
        let targets = targetsResp.pets
        for (let pet of targets) {
            pet.givePetEquipment(new Coconut());
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Coconut.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            })
        }
        
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