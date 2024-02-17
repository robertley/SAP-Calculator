import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class RedDragon extends Pet {
    name = "Red Dragon";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 7;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponentPets = this.parent.opponent.petArray;
        opponentPets.reverse();
        let targets = [];
        for (let pet of opponentPets) {
            if (pet.equipment instanceof Crisp) {
                continue;
            }
            if (targets.length >= this.level) {
                break;
            }
            targets.push(pet);
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Crisp.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
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