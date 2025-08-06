import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Toad extends Pet {
    name = "Toad";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 3;
    enemyHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!pet.alive) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (pet.equipment instanceof Weak) {
            return;
        }
        pet.givePetEquipment(new Weak());
        this.abilityUses++;
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} Weak.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.enemyHurt(gameApi, pet, tiger);
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
        this.maxAbilityUses = this.level * 2;
    }
}