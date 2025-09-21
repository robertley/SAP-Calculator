import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { PetService } from "../../../../services/pet.service";
import { clone } from "lodash";
import { WhaleSwallowAbility } from "../../../abilities/pets/turtle/tier-4/whale-swallow-ability.class";
import { WhaleSummonAbility } from "../../../abilities/pets/turtle/tier-4/whale-summon-ability.class";

export class Whale extends Pet {
    name = "Whale";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 3;
    health = 7;
    initAbilities(): void {
        this.addAbility(new WhaleSwallowAbility(this, this.logService, this.petService));
        this.addAbility(new WhaleSummonAbility(this, this.logService, this.abilityService));
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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