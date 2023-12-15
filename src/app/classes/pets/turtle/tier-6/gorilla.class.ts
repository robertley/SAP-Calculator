import { GameAPI } from "app/interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "app/classes/equipment/turtle/coconut.class";

export class Gorilla extends Pet {
    name = "Gorilla";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 7;
    health = 10;
    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        if (this.abilityUses < this.maxAbilityUses) {
            this.abilityUses++;
            this.equipment = new Coconut();
            this.logService.createLog({
                message: `${this.name} gained a Coconut.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }

        super.superHurt(gameApi, pet, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}