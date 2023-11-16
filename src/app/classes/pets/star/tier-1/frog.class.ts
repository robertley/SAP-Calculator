import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Frog extends Pet {
    name = "Frog";
    tier = 1;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (this.level > 1) {
            return;
        }
        let petInFront = this.petAhead;
        let petInBack = this.petBehind();
        if (petInFront == null || petInBack == null) {
            return;
        }
        let petInFrontAttack = petInFront.attack;
        let petInFrontHealth = petInFront.health;
        let petInBackAttack = petInBack.attack;
        let petInBackHealth = petInBack.health;
        petInFront.attack = petInBackAttack;
        petInFront.health = petInBackHealth;
        petInBack.attack = petInFrontAttack;
        petInBack.health = petInFrontHealth;
        this.logService.createLog({
            message: `${this.name} swapped the attack and health of ${petInFront.name} and ${petInBack.name}.`,
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
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}