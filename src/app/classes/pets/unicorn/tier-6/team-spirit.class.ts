import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TeamSpirit extends Pet {
    name = "Team Spirit";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 5;
    anyoneLevelUp(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.parent != this.parent) {
            return;
        }
        if (pet == this) {
            return;
        }

        let targetResp = this.parent.getRandomPets(5, [this], false, false, this);
        let targets = targetResp.pets;

        let power: Power = {
            attack: this.level,
            health: this.level
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power.attack} attack and ${power.health} health.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            })

            target.increaseAttack(power.attack);
            target.increaseHealth(power.health);
        }
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