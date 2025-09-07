import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Unicorn extends Pet {
    name = "Unicorn";
    tier = 4;
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
        pet.removePerk();

        let targetResp = this.parent.getSpecificPet(this, pet);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} gave ${target.name} ${power} attack and ${power} health.`,
            type: 'ability',
            player: this.parent,
            randomEvent: targetResp.random
        });

        target.increaseAttack(power);
        target.increaseHealth(power);

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