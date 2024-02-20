import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Spooked } from "../../../equipment/ailments/spooked.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Barghest extends Pet {
    name = "Barghest";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let oppponetPets = this.parent.opponent.petArray;
        oppponetPets.reverse();
        let targets: Pet[] = [];
        let targetAmt = this.level;

        for (let pet of oppponetPets) {
            if (targets.length >= targetAmt) {
                break;
            }
            if (pet.equipment == null) {
                targets.push(pet);
            }
        }

        for (let target of targets) {
            
            this.logService.createLog({
                message: `${this.name} gave ${target.name} Spooked`,
                type: "ability",
                player: this.parent,
                tiger: tiger
            })

            target.givePetEquipment(new Spooked());

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