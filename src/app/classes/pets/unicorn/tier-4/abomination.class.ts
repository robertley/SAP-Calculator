import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Abomination extends Pet {
    name = "Abomination";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 6;
    health = 5;
    // TODO double check tiger interaction, and update ability, and swallow pet selection
    endTurn(gameApi: GameAPI): void {
        let swallowedPets = [];
        let oneSwallowed = false;
        let twoSwallowed = false;
        let threeSwallowed = false;
        const swallowSpots = this.level;
        for (let i = 0; i < swallowSpots; i++) {
            if (this.abominationSwallowedPet1 != null && !oneSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet1);
                oneSwallowed = true;
            } else if (this.abominationSwallowedPet2 != null && !twoSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet2);
                twoSwallowed = true;
            } else if (this.abominationSwallowedPet3 != null && !threeSwallowed) {
                swallowedPets.push(this.abominationSwallowedPet3);
                threeSwallowed = true;
            }
        }
        this.exp = 0;
        for (let swallowedPet of swallowedPets) {
            let copyPet = this.petService.createPet({
                attack: null,
                health: null,
                mana: null,
                equipment: null,
                name: swallowedPet,
                exp: 0
            }, this.parent);
            if (copyPet == null) {
                return;
            }
            
            // Copy only non-null ability methods from the swallowed pet
            if (copyPet.originalStartOfBattle) this.startOfBattle = copyPet.originalStartOfBattle;
            if (copyPet.originalHurt) this.hurt = copyPet.originalHurt;
            if (copyPet.originalFaint) this.faint = copyPet.originalFaint;
            if (copyPet.originalFriendSummoned) this.friendSummoned = copyPet.originalFriendSummoned;
            if (copyPet.originalFriendAheadAttacks) this.friendAheadAttacks = copyPet.originalFriendAheadAttacks;
            if (copyPet.originalFriendAheadFaints) this.friendAheadFaints = copyPet.originalFriendAheadFaints;
            if (copyPet.originalFriendFaints) this.friendFaints = copyPet.originalFriendFaints;
            if (copyPet.originalEnemyAttack) this.enemyAttack = copyPet.originalEnemyAttack;
            if (copyPet.originalEnemyFaints) this.enemyFaints = copyPet.originalEnemyFaints;
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
            this.initAbilities();
            this.logService.createLog({
                message: `${this.name} gained ${swallowedPet}'s Ability.`,
                type: 'ability',
                player: this.parent,
            });
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
        equipment?: Equipment,
        abominationSwallowedPet1?: string,
        abominationSwallowedPet2?: string,
        abominationSwallowedPet3?: string) {
            super(logService, abilityService, parent);
            this.initPet(exp, health, attack, mana, equipment);
            this.abominationSwallowedPet1 = abominationSwallowedPet1;
            this.abominationSwallowedPet2 = abominationSwallowedPet2;
            this.abominationSwallowedPet3 = abominationSwallowedPet3;
    }
}