import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Rock } from "../../hidden/rock.class";

export class Basilisk extends Pet {
    name = "Basilisk";
    tier = 1;
    pack: Pack = 'Custom';
    health = 2;
    attack = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let target = this.petAhead;
        if (target == null) {
            target = this.parent.opponent.petArray[0];
        }
        if (target == null) {
            return;
        }
                
        let healthBonus = this.level * 2;

        this.logService.createLog({
            message: `${this.name} turned ${target.name} into a Rock with + ${healthBonus} health.`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        })

        let health = target.health + healthBonus;
        let maxHealth = 50;
        health = Math.min(health, maxHealth);

        let position = target.position;
        target.parent.setPet(position, new Rock(this.logService, this.abilityService, target.parent, health, target.attack, target.mana, target.exp, target.equipment), false);

        this.superStartOfBattle(gameApi, tiger);
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