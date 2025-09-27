import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { IliPikaAbility } from "../../../abilities/pets/danger/tier-1/ili-pika-ability.class";

export class IliPika extends Pet {
    name = "Ili Pika";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;
    initAbilities(): void {
        this.addAbility(new IliPikaAbility(this, this.logService));
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