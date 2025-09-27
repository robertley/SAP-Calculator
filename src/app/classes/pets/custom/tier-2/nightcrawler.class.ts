import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { NightcrawlerAbility } from "../../../abilities/pets/custom/tier-2/nightcrawler-ability.class";

export class Nightcrawler extends Pet {
    name = "Nightcrawler";
    tier = 2;
    pack: Pack = 'Custom';
    attack = 1;
    health = 1;
    initAbilities(): void {
        this.addAbility(new NightcrawlerAbility(this, this.logService, this.abilityService));
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