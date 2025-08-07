import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class LovelandFrogman extends Pet {
    name = "Loveland Frogman";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 5;
    beforeFriendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        let power: Power = {
            attack: this.level * 1,
            health: this.level * 2
        };

        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power.attack} attack and ${power.health} health.`,
            type: 'ability',
            player: this.parent
        });

        pet.increaseAttack(power.attack);
        pet.increaseHealth(power.health);

        this.superBeforeFriendAttacks(gameApi, pet, tiger);
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
        this.maxAbilityUses = this.level;
    }
}