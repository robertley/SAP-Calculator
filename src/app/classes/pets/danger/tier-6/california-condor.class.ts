import { PetService } from "../../../../services/pet.service";
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
    copyPet: Pet;
    
    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        let copyPet = pet;
        this.copyPet = copyPet;
        
        if (copyPet instanceof CaliforniaCondor) {
            copyPet = copyPet.copyPet;
            this.logService.createLog({
                message: `California Condor copied ${pet.name}`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }
        
        if (copyPet == null) {
            return;
        }
        
        // Copy only non-null ability methods from the transformed pet
        if (copyPet.originalStartOfBattle) this.startOfBattle = copyPet.originalStartOfBattle.bind(this);
        if (copyPet.originalHurt) this.hurt = copyPet.originalHurt.bind(this);
        if (copyPet.originalFaint) this.faint = copyPet.originalFaint.bind(this);
        if (copyPet.originalFriendSummoned) this.friendSummoned = copyPet.originalFriendSummoned.bind(this);
        if (copyPet.originalFriendAheadAttacks) this.friendAheadAttacks = copyPet.originalFriendAheadAttacks.bind(this);
        if (copyPet.originalFriendAheadFaints) this.friendAheadFaints = copyPet.originalFriendAheadFaints.bind(this);
        if (copyPet.originalFriendFaints) this.friendFaints = copyPet.originalFriendFaints.bind(this);
        if (copyPet.originalEnemyAttack) this.enemyAttack = copyPet.originalEnemyAttack.bind(this);
        if (copyPet.originalAfterAttack) this.afterAttack = copyPet.originalAfterAttack.bind(this);
        if (copyPet.originalBeforeAttack) this.beforeAttack = copyPet.originalBeforeAttack.bind(this);
        if (copyPet.originalBeforeStartOfBattle) this.beforeStartOfBattle = copyPet.originalBeforeStartOfBattle.bind(this);
        if (copyPet.originalKnockOut) this.knockOut = copyPet.originalKnockOut.bind(this);
        if (copyPet.originalSummoned) this.summoned = copyPet.originalSummoned.bind(this);
        if (copyPet.originalFriendlyToyBroke) this.friendlyToyBroke = copyPet.originalFriendlyToyBroke.bind(this);
        if (copyPet.originalFriendGainedAilment) this.friendGainedAilment = copyPet.originalFriendGainedAilment.bind(this);
        if (copyPet.originalFriendHurt) this.friendHurt = copyPet.originalFriendHurt.bind(this);
        if (copyPet.originalFriendTransformed) this.friendTransformed = copyPet.originalFriendTransformed.bind(this);
        if (copyPet.originalEatsFood) this.eatsFood = copyPet.originalEatsFood.bind(this);
        if (copyPet.originalFriendAteFood) this.friendAteFood = copyPet.originalFriendAteFood.bind(this);
        if (copyPet.originalFriendLostPerk) this.friendLostPerk = copyPet.originalFriendLostPerk.bind(this);
        if (copyPet.originalGainedPerk) this.gainedPerk = copyPet.originalGainedPerk.bind(this);
        if (copyPet.originalFriendGainedPerk) this.friendGainedPerk = copyPet.originalFriendGainedPerk.bind(this);
        if (copyPet.originalAnyoneLevelUp) this.anyoneLevelUp = copyPet.originalAnyoneLevelUp.bind(this);
        if (copyPet.originalEnemySummoned) this.enemySummoned = copyPet.originalEnemySummoned.bind(this);
        if (copyPet.originalEnemyPushed) this.enemyPushed = copyPet.originalEnemyPushed.bind(this);
        if (copyPet.originalGainedMana) this.gainedMana = copyPet.originalGainedMana.bind(this);
        if (copyPet.originalFriendJumped) this.friendJumped = copyPet.originalFriendJumped.bind(this);
        if (copyPet.originalEnemyGainedAilment) this.enemyGainedAilment = copyPet.originalEnemyGainedAilment.bind(this);
        if (copyPet.originalFriendGainsHealth) this.friendGainsHealth = copyPet.originalFriendGainsHealth.bind(this);
        if (copyPet.originalEmptyFrontSpace) this.emptyFrontSpace = copyPet.originalEmptyFrontSpace.bind(this);
        if (copyPet.originalEnemyHurt) this.enemyHurt = copyPet.originalEnemyHurt.bind(this);
        if (copyPet.originalAfterFaint) this.afterFaint = copyPet.originalAfterFaint.bind(this);
        if (copyPet.originalTransform) this.transform = copyPet.originalTransform.bind(this);
        if (copyPet.originalAdjacentAttacked) this.adjacentAttacked = copyPet.originalAdjacentAttacked.bind(this);
        if (copyPet.originalFriendAttacks) this.friendAttacks = copyPet.originalFriendAttacks.bind(this);
        if (copyPet.originalBeforeFriendAttacks) this.beforeFriendAttacks = copyPet.originalBeforeFriendAttacks.bind(this);
        if (copyPet.originalEnemyJumped) this.enemyJumped = copyPet.originalEnemyJumped.bind(this);
        if (copyPet.originalFriendGainedExperience) this.friendGainedExperience = copyPet.originalFriendGainedExperience.bind(this);

        // Update original* properties so other pets (like Tiger) can copy from California Condor
        this.originalStartOfBattle = this.startOfBattle;
        this.originalTransform = this.transform;
        this.originalHurt = this.hurt;
        this.originalFaint = this.faint;
        this.originalFriendSummoned = this.friendSummoned;
        this.originalFriendAheadAttacks = this.friendAheadAttacks;
        this.originalFriendAheadFaints = this.friendAheadFaints;
        this.originalFriendFaints = this.friendFaints;
        this.originalEnemyAttack = this.enemyAttack;
        this.originalAfterAttack = this.afterAttack;
        this.originalBeforeAttack = this.beforeAttack;
        this.originalBeforeStartOfBattle = this.beforeStartOfBattle;
        this.originalKnockOut = this.knockOut;
        this.originalSummoned = this.summoned;
        this.originalFriendlyToyBroke = this.friendlyToyBroke;
        this.originalFriendGainedAilment = this.friendGainedAilment;
        this.originalFriendHurt = this.friendHurt;
        this.originalFriendTransformed = this.friendTransformed;
        this.originalEatsFood = this.eatsFood;
        this.originalFriendAteFood = this.friendAteFood;
        this.originalFriendLostPerk = this.friendLostPerk;
        this.originalGainedPerk = this.gainedPerk;
        this.originalFriendGainedPerk = this.friendGainedPerk;
        this.originalAnyoneLevelUp = this.anyoneLevelUp;
        this.originalEnemySummoned = this.enemySummoned;
        this.originalEnemyPushed = this.enemyPushed;
        this.originalGainedMana = this.gainedMana;
        this.originalFriendJumped = this.friendJumped;
        this.originalEnemyGainedAilment = this.enemyGainedAilment;
        this.originalFriendGainsHealth = this.friendGainsHealth;
        this.originalEmptyFrontSpace = this.emptyFrontSpace;
        this.originalEnemyHurt = this.enemyHurt;
        this.originalAfterFaint = this.afterFaint;
        this.originalAdjacentAttacked = this.adjacentAttacked;
        this.originalFriendAttacks = this.friendAttacks;
        this.originalBeforeFriendAttacks = this.beforeFriendAttacks;
        this.originalEnemyJumped = this.enemyJumped;
        this.originalFriendGainedExperience = this.friendGainedExperience;

        if (!(copyPet instanceof CaliforniaCondor)) {
            this.logService.createLog({
                message: `California Condor copied ${copyPet.name}'s level ${this.level} ability`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })
        }
        
        this.abilityUses++;
        this.superFriendTransformed(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 2;
    }

    resetPet(): void {
        // Reset all copied abilities back to undefined/null
        this.startOfBattle = undefined;
        this.hurt = undefined;
        this.faint = undefined;
        this.friendSummoned = undefined;
        this.friendAheadAttacks = undefined;
        this.friendAheadFaints = undefined;
        this.friendFaints = undefined;
        this.enemyAttack = undefined;
        this.afterAttack = undefined;
        this.beforeAttack = undefined;
        this.beforeStartOfBattle = undefined;
        this.knockOut = undefined;
        this.summoned = undefined;
        this.friendlyToyBroke = undefined;
        this.friendGainedAilment = undefined;
        this.friendHurt = undefined;
        this.eatsFood = undefined;
        this.friendAteFood = undefined;
        this.friendLostPerk = undefined;
        this.gainedPerk = undefined;
        this.friendGainedPerk = undefined;
        this.anyoneLevelUp = undefined;
        this.enemySummoned = undefined;
        this.enemyPushed = undefined;
        this.gainedMana = undefined;
        this.friendJumped = undefined;
        this.enemyGainedAilment = undefined;
        this.friendGainsHealth = undefined;
        this.emptyFrontSpace = undefined;
        this.enemyHurt = undefined;
        this.afterFaint = undefined;
        this.transform = undefined;
        this.adjacentAttacked = undefined;
        this.friendAttacks = undefined;
        this.beforeFriendAttacks = undefined;
        this.enemyJumped = undefined;
        this.friendGainedExperience = undefined;
        
        // Reset all original* properties back to undefined
        this.originalStartOfBattle = undefined;
        this.originalHurt = undefined;
        this.originalFaint = undefined;
        this.originalFriendSummoned = undefined;
        this.originalFriendAheadAttacks = undefined;
        this.originalFriendAheadFaints = undefined;
        this.originalFriendFaints = undefined;
        this.originalEnemyAttack = undefined;
        this.originalAfterAttack = undefined;
        this.originalBeforeAttack = undefined;
        this.originalBeforeStartOfBattle = undefined;
        this.originalKnockOut = undefined;
        this.originalSummoned = undefined;
        this.originalFriendlyToyBroke = undefined;
        this.originalFriendGainedAilment = undefined;
        this.originalFriendHurt = undefined;
        this.originalFriendTransformed = undefined;
        this.originalEatsFood = undefined;
        this.originalFriendAteFood = undefined;
        this.originalFriendLostPerk = undefined;
        this.originalGainedPerk = undefined;
        this.originalFriendGainedPerk = undefined;
        this.originalAnyoneLevelUp = undefined;
        this.originalEnemySummoned = undefined;
        this.originalEnemyPushed = undefined;
        this.originalGainedMana = undefined;
        this.originalFriendJumped = undefined;
        this.originalEnemyGainedAilment = undefined;
        this.originalFriendGainsHealth = undefined;
        this.originalEmptyFrontSpace = undefined;
        this.originalEnemyHurt = undefined;
        this.originalAfterFaint = undefined;
        this.originalTransform = undefined;
        this.originalAdjacentAttacked = undefined;
        this.originalFriendAttacks = undefined;
        this.originalBeforeFriendAttacks = undefined;
        this.originalEnemyJumped = undefined;
        this.originalFriendGainedExperience = undefined;
        
        // Clear the copy reference
        this.copyPet = null;
        
        // Call parent reset functionality
        super.resetPet();
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