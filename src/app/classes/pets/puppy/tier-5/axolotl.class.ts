import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Axolotl extends Pet {
    name = "Axolotl";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
    friendGainedPerk(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (pet == this) {
            return;
        }
        let power = this.level;
        pet.increaseAttack(power);
        pet.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        this.superFriendGainedPerk(gameApi, pet, tiger);
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