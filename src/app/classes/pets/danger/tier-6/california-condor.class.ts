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
    health = 6;
    
    friendTransformed(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        }
        
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        let copyPet = pet;
        
        if (copyPet == null) {
            return;
        }
        
        // Copy only non-null ability methods from the transformed pet
        if (copyPet.originalStartOfBattle) this.startOfBattle = copyPet.originalStartOfBattle;
        if (copyPet.originalHurt) this.hurt = copyPet.originalHurt;
        if (copyPet.originalFaint) this.faint = copyPet.originalFaint;
        if (copyPet.originalFriendSummoned) this.friendSummoned = copyPet.originalFriendSummoned;
        if (copyPet.originalFriendAheadAttacks) this.friendAheadAttacks = copyPet.originalFriendAheadAttacks;
        if (copyPet.originalFriendAheadFaints) this.friendAheadFaints = copyPet.originalFriendAheadFaints;
        if (copyPet.originalFriendFaints) this.friendFaints = copyPet.originalFriendFaints;
        if (copyPet.originalEnemyAttack) this.enemyAttack = copyPet.originalEnemyAttack;
        if (copyPet.originalAfterAttack) this.afterAttack = copyPet.originalAfterAttack;
        if (copyPet.originalBeforeAttack) this.beforeAttack = copyPet.originalBeforeAttack;
        if (copyPet.originalBeforeStartOfBattle) this.beforeStartOfBattle = copyPet.originalBeforeStartOfBattle;
        if (copyPet.originalKnockOut) this.knockOut = copyPet.originalKnockOut;
        if (copyPet.originalSummoned) this.summoned = copyPet.originalSummoned;
        if (copyPet.originalFriendlyToyBroke) this.friendlyToyBroke = copyPet.originalFriendlyToyBroke;
        if (copyPet.originalFriendGainedAilment) this.friendGainedAilment = copyPet.originalFriendGainedAilment;
        if (copyPet.originalFriendHurt) this.friendHurt = copyPet.originalFriendHurt;
        if (copyPet.originalFriendTransformed) this.friendTransformed = copyPet.originalFriendTransformed;
        if (copyPet.originalEatsFood) this.eatsFood = copyPet.originalEatsFood;
        if (copyPet.originalFriendAteFood) this.friendAteFood = copyPet.originalFriendAteFood;
        if (copyPet.originalFriendLostPerk) this.friendLostPerk = copyPet.originalFriendLostPerk;
        if (copyPet.originalGainedPerk) this.gainedPerk = copyPet.originalGainedPerk;
        if (copyPet.originalFriendGainedPerk) this.friendGainedPerk = copyPet.originalFriendGainedPerk;
        if (copyPet.originalAnyoneLevelUp) this.anyoneLevelUp = copyPet.originalAnyoneLevelUp;
        if (copyPet.originalEnemySummoned) this.enemySummoned = copyPet.originalEnemySummoned;
        if (copyPet.originalEnemyPushed) this.enemyPushed = copyPet.originalEnemyPushed;
        if (copyPet.originalGainedMana) this.gainedMana = copyPet.originalGainedMana;
        if (copyPet.originalFriendJumped) this.friendJumped = copyPet.originalFriendJumped;
        if (copyPet.originalEnemyGainedAilment) this.enemyGainedAilment = copyPet.originalEnemyGainedAilment;
        if (copyPet.originalFriendGainsHealth) this.friendGainsHealth = copyPet.originalFriendGainsHealth;
        if (copyPet.originalEmptyFrontSpace) this.emptyFrontSpace = copyPet.originalEmptyFrontSpace;
        if (copyPet.originalEnemyHurt) this.enemyHurt = copyPet.originalEnemyHurt;
        if (copyPet.originalAfterFaint) this.afterFaint = copyPet.originalAfterFaint;
        if (copyPet.originalTransform) this.transform = copyPet.originalTransform;
        if (copyPet.originalAdjacentAttacked) this.adjacentAttacked = copyPet.originalAdjacentAttacked;
        if (copyPet.originalFriendAttacks) this.friendAttacks = copyPet.originalFriendAttacks;
        if (copyPet.originalBeforeFriendAttacks) this.beforeFriendAttacks = copyPet.originalBeforeFriendAttacks;
        if (copyPet.originalEnemyJumped) this.enemyJumped = copyPet.originalEnemyJumped;
        if (copyPet.originalFriendGainedExperience) this.friendGainedExperience = copyPet.originalFriendGainedExperience;
        // Copy maxAbilityUses property if the copied pet has it set
        this.initAbilities();

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