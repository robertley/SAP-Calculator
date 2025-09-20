import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AntAbility } from "../../../abilities/pets/turtle/tier-1/ant-ability.class";
import { Ability } from "../../../ability.class";

export class Ant extends Pet {

    name = "Ant"
    tier = 1;
    pack: Pack = 'Turtle';
    health = 2;
    attack = 2;
    initPet(exp: number, health: number, attack: number, mana: number, equipment: Equipment): void {
        this.abilityList = [new AntAbility(this, this.logService)];
        super.initPet(exp, health, attack, mana, equipment);

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