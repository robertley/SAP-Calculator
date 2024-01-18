import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Doberman extends Pet {
    name = "Doberman";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        // determine if lowest tier pet
        let lowestTierPet = true;
        for (let pet of this.parent.petArray) {
            if (pet == this) {
                continue
            }
            if (pet.tier <= this.tier) {
                lowestTierPet = false;
                break;
            }
        }
        if (!lowestTierPet) {
            return;
        }

        let power = this.level * 8;
        this.increaseAttack(power);
        this.givePetEquipment(new Coconut());
        this.logService.createLog({
            message: `${this.name} gained ${power} attack and gained a Coconut.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
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