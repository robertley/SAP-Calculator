import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tucuxi extends Pet {
    name = "Tucuxi";
    tier = 3;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let target = this.parent.getLastPet();
        
        // Don't target self
        if (!target || target === this) {
            return;
        }

        // Push target to front (this will handle occupied front slot automatically)
        this.parent.pushPetToFront(target, false);
        
        this.logService.createLog({
            message: `${this.name} pushed ${target.name} to the front`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        // Give level-based buffs (3/6/9 attack and health)
        let power = this.level * 3;
        target.increaseAttack(power);
        target.increaseHealth(power);
        
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${power} attack and +${power} health`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon
        });

        this.superFaint(gameApi, tiger);
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