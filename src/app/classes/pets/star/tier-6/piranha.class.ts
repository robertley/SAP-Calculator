import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Piranha extends Pet {
    name = "Piranha";
    tier = 6;
    pack: Pack = 'Star';
    attack = 10;
    health = 2;
    hurt(gameApi: GameAPI, tiger?: boolean): void {
        let targetPets = this.parent.petArray.filter(pet => {
            return pet !== this && pet.alive
        });
        let power = this.level * 3;
        for (let target of targetPets) {
            target.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }
        this.superHurt(gameApi, tiger);

    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}