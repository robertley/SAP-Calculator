import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BombusDahlbomiiAbility } from "../../../abilities/pets/danger/tier-1/bombus-dahlbomii-ability.class";

export class BombusDahlbomii extends Pet {
    name = "Bombus Dahlbomii";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 1;
    health = 2;
    initAbilities(): void {
        this.addAbility(new BombusDahlbomiiAbility(this, this.logService, this.abilityService));
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