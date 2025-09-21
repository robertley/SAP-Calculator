import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { BlobfishAbility } from "../../../abilities/pets/star/tier-5/blobfish-ability.class";

export class Blobfish extends Pet {
    name = "Blobfish";
    tier = 5;
    pack: Pack = 'Star';
    attack = 2;
    health = 10;

    initAbilities(): void {
        this.addAbility(new BlobfishAbility(this, this.logService));
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