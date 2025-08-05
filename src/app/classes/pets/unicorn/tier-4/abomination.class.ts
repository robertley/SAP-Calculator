import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Abomination extends Pet {
    name = "Abomination";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 3;
    // TODO double check tiger interaction
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let swallowedPets = [];
        let oneSwallowed = false;
        let twoSwallowed = false;
        let threeSwallowed = false;
        for (let i = 0; i < this.level; i++) {
            if (this.abominationSwallowedPet1 != null && !oneSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet1);
                oneSwallowed = true;
            } else if (this.abominationSwallowedPet2 != null && !twoSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet2);
                twoSwallowed = true;
            } else if (this.abominationSwallowedPet3 != null && !threeSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet3);
                threeSwallowed = true;
            }
        }
        for (let swallowedPet of swallowedPets) {

            this.logService.createLog({
                message: `${this.name} used swallowed ${swallowedPet}'s Ability.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
            let pet = this.petService.createPet({
                attack: null,
                health: null,
                mana: null,
                equipment: null,
                name: swallowedPet,
                exp: 0
            }, this.parent);
            let startOfBattleAbilitiy = pet.originalStartOfBattle.bind(this);
            startOfBattleAbilitiy(gameApi, tiger);
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        abominationSwallowedPet1?: string,
        abominationSwallowedPet2?: string,
        abominationSwallowedPet3?: string) {
            super(logService, abilityService, parent);
            this.initPet(exp, health, attack, mana, equipment);
            this.abominationSwallowedPet1 = abominationSwallowedPet1;
            this.abominationSwallowedPet2 = abominationSwallowedPet2;
            this.abominationSwallowedPet3 = abominationSwallowedPet3;
    }
}