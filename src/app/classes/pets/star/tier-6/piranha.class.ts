import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Piranha extends Pet {
    name = "Piranha";
    tier = 6;
    pack: Pack = 'Star';
    attack = 10;
    health = 4;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let targetPetsResp = this.parent.getAll(false, this, true);
        let targetPets = targetPetsResp.pets;
        let power = this.level * 3;
        for (let target of targetPets) {
            target.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetPetsResp.random
            })
        }
        this.superHurt(gameApi, pet, tiger);

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