import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { AmamiRabbitAbility } from "../../../abilities/pets/danger/tier-3/amami-rabbit-ability.class";

export class AmamiRabbit extends Pet {
    name = "Amami Rabbit";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 1;
    health = 3;
    initAbilities(): void {
        this.addAbility(new AmamiRabbitAbility(this, this.logService));
        super.initAbilities();
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