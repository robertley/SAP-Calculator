import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Reindeer extends Pet {
    name = "Reindeer";
    tier = 6;
    pack: Pack = 'Star';
    attack = 6;
    health = 4;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.givePetEquipment(new Melon());
        this.abilityUses++;
        this.logService.createLog({
            message: `${this.name} gained Melon.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superAfterAttack(gameApi, tiger);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}