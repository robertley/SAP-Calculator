import { Melon } from "app/classes/equipment/melon.class";
import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Turtle extends Pet {
    name = "Turtle";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 5;
    faint(gameApi, tiger) {
        let targetPet = this.petBehind;
        while(targetPet) {
            if (targetPet.equipment instanceof Melon) {
                targetPet = targetPet.petBehind;
                continue;
            }
            break;
        }
        targetPet.equipment = new Melon();
        this.logService.createLog({
            message: `${this.name} gave ${targetPet.name} Melon.`,
            type: 'ability',
            tiger: tiger,
            player: this.parent
        })
        this.superFaint(gameApi, tiger);
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