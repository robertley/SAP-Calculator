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
        this.startOfBattle = copyPet.originalStartOfBattle?.bind(this);
        this.hurt = copyPet.originalHurt?.bind(this);
        this.faint = copyPet.originalFaint?.bind(this);
        this.friendSummoned = copyPet.originalFriendSummoned?.bind(this);
        this.friendAheadAttacks = copyPet.originalFriendAheadAttacks?.bind(this);
        this.friendAheadFaints = copyPet.originalFriendAheadFaints?.bind(this);
        this.friendFaints = copyPet.originalFriendFaints?.bind(this);
        this.enemyAttack = copyPet.originalEnemyAttack?.bind(this);
        this.afterAttack = copyPet.originalAfterAttack?.bind(this);
        this.beforeAttack = copyPet.originalBeforeAttack?.bind(this);
        this.beforeStartOfBattle = copyPet.originalBeforeStartOfBattle?.bind(this);
        this.knockOut = copyPet.originalKnockOut?.bind(this);
        this.summoned = copyPet.originalSummoned?.bind(this);
        this.friendlyToyBroke = copyPet.originalFriendlyToyBroke?.bind(this);
        this.friendGainedAilment = copyPet.originalFriendGainedAilment?.bind(this);
        this.friendHurt = copyPet.originalFriendHurt?.bind(this);
        this.friendTransformed = copyPet.originalFriendTransformed?.bind(this);
        this.eatsFood = copyPet.originalEatsFood?.bind(this);
        this.friendAteFood = copyPet.originalFriendAteFood?.bind(this);
        this.friendLostPerk = copyPet.originalFriendLostPerk?.bind(this);
        this.gainedPerk = copyPet.originalGainedPerk?.bind(this);
        this.friendGainedPerk = copyPet.originalFriendGainedPerk?.bind(this);
        this.anyoneLevelUp = copyPet.originalAnyoneLevelUp?.bind(this);
        this.enemySummoned = copyPet.originalEnemySummoned?.bind(this);
        this.enemyPushed = copyPet.originalEnemyPushed?.bind(this);
        this.gainedMana = copyPet.originalGainedMana?.bind(this);
        this.friendJumped = copyPet.originalFriendJumped?.bind(this);
        this.enemyGainedAilment = copyPet.originalEnemyGainedAilment?.bind(this);
        this.friendGainsHealth = copyPet.originalFriendGainsHealth?.bind(this);
        this.emptyFrontSpace = copyPet.originalEmptyFrontSpace?.bind(this);
        this.enemyHurt = copyPet.originalEnemyHurt?.bind(this);
        this.afterFaint = copyPet.originalAfterFaint?.bind(this);
        this.transform = copyPet.originalTransform?.bind(this);
        this.adjacentAttacked = copyPet.originalAdjacentAttacked?.bind(this);
        this.friendAttacks = copyPet.originalFriendAttacks?.bind(this);
        this.beforeFriendAttacks = copyPet.originalBeforeFriendAttacks?.bind(this);
        this.enemyJumped = copyPet.originalEnemyJumped?.bind(this);
        this.friendGainedExperience = copyPet.originalFriendGainedExperience?.bind(this);

        // Update original* properties so other pets (like Tiger) can copy from Parrot
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
        this.originalEndTurn = this.endTurn;
        this.originalEnemyJumped = this.enemyJumped;
        this.originalFriendGainedExperience = this.friendGainedExperience;

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