import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class DarwinsFox extends Pet {
    name = "Darwin's Fox";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 3;
    health = 3;

    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        
        if (!pet) {
            return;
        }
        //TO DO: Check if it should still activate before attack abilities
        if (!this.alive) {
            return;
        }    
        // Check ability uses limit
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
                
        // Find who killed the friend
        if (pet.killedBy && pet.killedBy.alive) {
            this.jumpAttackPrep(pet.killedBy)
            this.jumpAttack(pet.killedBy, tiger);           
        } else {
            let target = this.parent.opponent.furthestUpPet;
            if (!target) {
                return;
            }
            this.jumpAttackPrep(target)
            this.jumpAttack(target, tiger)
        }
        this.abilityUses++;
        this.superFriendFaints(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level; // Works 1/2/3 times per turn based on level
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