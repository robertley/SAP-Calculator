import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SecretaryBird extends Pet {
    name = "Secretary Bird";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 3;
    health = 5;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!tiger) {
            this.abilityUses++;
        }
        if (this.abilityUses % 2 == 1) {
            return;
        }
        let target = this.petAhead;
        if (target == null) {
            return;
        }
        let powerAttack = this.level * 3;
        let powerHealth = this.level * 4;
        target.increaseAttack(powerAttack);
        target.increaseHealth(powerHealth);
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${powerAttack} attack and ${powerHealth} health.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendFaints(gameApi, pet, tiger);
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