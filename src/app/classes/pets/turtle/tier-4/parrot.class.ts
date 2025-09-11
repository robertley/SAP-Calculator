import { PetService } from "app/services/pet.service";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

// TODO - verify parrot has all ability methods
// fix bug with parrot copying parrot working despite order
export class Parrot extends Pet {
    name = "Parrot";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 4;
    health = 2;
    copyPet: Pet;
    endTurn(gameApi: GameAPI) {
        let copyPet = this.petAhead;
        this.copyPet = copyPet;
        if (copyPet instanceof Parrot) {
            copyPet = copyPet.copyPet;
            this.logService.createLog({
                message: `Parrot copied ${this.petAhead.name}`,
                type: 'ability',
                player: this.parent
            })
        }
        if (copyPet == null) {
            return;
        }
        this.startOfBattle = copyPet.originalStartOfBattle;
        this.hurt = copyPet.originalHurt;
        this.faint = copyPet.originalFaint;
        this.friendSummoned = copyPet.originalFriendSummoned;
        this.friendAheadAttacks = copyPet.originalFriendAheadAttacks;
        this.friendAheadFaints = copyPet.originalFriendAheadFaints;
        this.friendFaints = copyPet.originalFriendFaints;
        this.enemyAttack = copyPet.originalEnemyAttack;
        this.afterAttack = copyPet.originalAfterAttack;
        this.beforeAttack = copyPet.originalBeforeAttack;
        this.beforeStartOfBattle = copyPet.originalBeforeStartOfBattle;
        this.knockOut = copyPet.originalKnockOut;
        this.summoned = copyPet.originalSummoned;
        this.friendlyToyBroke = copyPet.originalFriendlyToyBroke;
        this.friendGainedAilment = copyPet.originalFriendGainedAilment;
        this.friendHurt = copyPet.originalFriendHurt;
        this.friendTransformed = copyPet.originalFriendTransformed;
        this.eatsFood = copyPet.originalEatsFood;
        this.friendAteFood = copyPet.originalFriendAteFood;
        this.friendLostPerk = copyPet.originalFriendLostPerk;
        this.gainedPerk = copyPet.originalGainedPerk;
        this.friendGainedPerk = copyPet.originalFriendGainedPerk;
        this.anyoneLevelUp = copyPet.originalAnyoneLevelUp;
        this.enemySummoned = copyPet.originalEnemySummoned;
        this.enemyPushed = copyPet.originalEnemyPushed;
        this.gainedMana = copyPet.originalGainedMana;
        this.friendJumped = copyPet.originalFriendJumped;
        this.enemyGainedAilment = copyPet.originalEnemyGainedAilment;
        this.friendGainsHealth = copyPet.originalFriendGainsHealth;
        this.emptyFrontSpace = copyPet.originalEmptyFrontSpace;
        this.enemyHurt = copyPet.originalEnemyHurt;
        this.afterFaint = copyPet.originalAfterFaint;
        this.transform = copyPet.originalTransform;
        this.adjacentAttacked = copyPet.originalAdjacentAttacked;
        this.friendAttacks = copyPet.originalFriendAttacks;
        this.beforeFriendAttacks = copyPet.originalBeforeFriendAttacks;
        this.enemyJumped = copyPet.originalEnemyJumped;
        this.friendGainedExperience = copyPet.originalFriendGainedExperience;

        // Copy maxAbilityUses property if the copied pet has it set
        this.maxAbilityUses = copyPet.maxAbilityUses;
        this.setAbilityUses = copyPet.setAbilityUses?.bind(this);
        
        // Initialize ability wrappers for the copied abilities
        this.initAbilities();
        //TO DO: Copy other stuff like swallow reset, etc
        if (!(copyPet instanceof Parrot)) {
            this.logService.createLog({
                message: `Parrot copied ${copyPet.name}`,
                type: 'ability',
                player: this.parent
            })
        }

    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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