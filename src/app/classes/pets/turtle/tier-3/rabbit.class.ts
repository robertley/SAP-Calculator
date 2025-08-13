import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Rabbit extends Pet {
    name = "Rabbit";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 1;
    friendAteFood(gameApi: GameAPI, pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let power = this.level;
        pet.increaseHealth(power);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        this.abilityUses++;
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3;
    }
}