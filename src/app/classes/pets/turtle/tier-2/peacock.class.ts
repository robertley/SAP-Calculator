import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Peacock extends Pet {
    name = "Peacock";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 5;
    attack = 2;
    hurt = () => {
        if (this.health < 1) {
            return;
        }
        let boost = this.level * 4;
        this.increaseAttack(boost);
        this.logService.createLog({
            message: `Peacock increased attack by ${boost} (${this.attack})`,
            type: 'ability',
            player: this.parent
        })
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.health = health ?? this.health;
        this.attack = attack ?? this.attack;
        this.exp = exp ?? this.exp;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
    }
}