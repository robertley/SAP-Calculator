import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class IliPika extends Pet {
    name = "Ili Pika";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 2;

    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power = this.level * 1;
        
        // Determine highest stat
        if (pet.attack > pet.health) {
            pet.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} give ${power} attack to ${pet.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        } else {
            pet.increaseHealth(power);
            this.logService.createLog({
                message: `${this.name} give ${power} health to ${pet.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });
        }
        
        this.superFriendTransformed(gameApi, pet, tiger);
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