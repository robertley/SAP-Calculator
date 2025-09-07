import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Pengobble extends Pet {
    name = "Pengobble";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 4;
    gainedMana(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        const manaGain = this.level * 2;
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return
        }
        this.logService.createLog({
            message: `${this.name} gave ${target.name} an extra ${manaGain} bonus mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        });

        this.mana += manaGain;
        this.abilityUses++;
        
        this.superGainedMana(gameApi, tiger);
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
        this.maxAbilityUses = 2;
    }
}