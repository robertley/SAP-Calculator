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
    maxAbilityUses = 2;
    abilityUses = 0;

    private isTriggering = false;

    gainedMana(gameApi: GameAPI, tiger?: boolean): void {
        if (this.isTriggering || this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        this.isTriggering = true;

        const manaGain = this.level * 2;

        this.logService.createLog({
            message: `${this.name} gained an extra ${manaGain} bonus mana.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.increaseMana(manaGain);
        this.abilityUses++;
        
        this.isTriggering = false;

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
        this.abilityUses = 0;
        this.maxAbilityUses = 2;
    }
}