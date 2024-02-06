import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Unicorn extends Pet {
    name = "Unicorn";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 4;
    friendGainedAilment(gameApi: GameAPI, pet?: Pet): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let power = this.level * 2;

        this.logService.createLog({
            message: `${this.name} removed ailment from ${pet.name}.`,
            type: 'ability',
            player: this.parent
        });

        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent
        });

        pet.givePetEquipment(null);
        pet.increaseAttack(power);
        pet.increaseHealth(power);

        this.abilityUses++;
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