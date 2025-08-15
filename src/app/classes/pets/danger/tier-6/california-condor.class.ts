import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class CaliforniaCondor extends Pet {
    name = "California Condor";
    tier = 6;
    pack: Pack = 'Danger';
    attack = 10;
    health = 3;

    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        
        if (this.abilityUses >= this.maxAbilityUses) {
            this.superFriendTransformed(gameApi, pet, tiger);
            return;
        }
        
        let expGain = 3; // Fixed +3 experience
        
        pet.increaseExp(expGain);
        
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} +${expGain} experience.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        
        this.abilityUses++;
        this.superFriendTransformed(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 2; // 2 times per battle
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