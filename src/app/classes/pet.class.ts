import { GameAPI } from "../interfaces/gameAPI.interface";
import { LogService } from "../services/log.service";
import { Equipment } from "./equipment.class";
import { Player } from "./player.class";
import { Peanut } from "./equipment/turtle/peanut.class";
import { AbilityService } from "../services/ability.service";
import { Tiger } from "./pets/turtle/tier-6/tiger.class";
import { Albatross } from "./pets/custom/tier-6/albatross.class";
import { Salt } from "./equipment/puppy/salt.class";
import { Panther } from "./pets/puppy/tier-5/panther.class";
import { getOpponent } from "../util/helper-functions";
import { Cheese } from "./equipment/star/cheese.class";
import { Pepper } from "./equipment/star/pepper.class";
import { FortuneCookie } from "./equipment/custom/fortune-cookie.class";
import { Dazed } from "./equipment/ailments/dazed.class";
import { Silly } from "./equipment/ailments/silly.class";
import { Exposed } from "./equipment/ailments/exposed.class";
import { Crisp } from "./equipment/ailments/crisp.class";
import { Toasty } from "./equipment/ailments/toasty.class";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { Nurikabe } from "./pets/custom/tier-5/nurikabe.class";
import { cloneDeep } from "lodash";
import { PeanutButter } from "./equipment/hidden/peanut-butter";
import { Blackberry } from "./equipment/puppy/blackberry.class";
import { HoneydewMelon, HoneydewMelonAttack } from "./equipment/golden/honeydew-melon.class";
import { MapleSyrup, MapleSyrupAttack } from "./equipment/golden/maple-syrup.class";
import { WhiteOkra } from "./equipment/danger/white-okra.class";
import { FairyDust } from "./equipment/unicorn/fairy-dust.class";
import { Ambrosia } from "./equipment/unicorn/ambrosia.class";
import { Toad } from "./pets/star/tier-3/toad.class";
import { WhiteTruffle } from "./equipment/danger/white-truffle.class";

export type Pack = 'Turtle' | 'Puppy' | 'Star' | 'Golden' | 'Unicorn' | 'Custom' | 'Danger';


export abstract class Pet {
    name: string;
    tier: number;
    pack: Pack;
    hidden: boolean = false;
    parent: Player;
    health: number;
    attack: number;
    mana: number = 0;
    disabled: boolean = false;
    maxAbilityUses: number = null;
    abilityUses: number = 0;
    startOfBattleTriggered: boolean = false;
    equipment?: Equipment;
    lastLostEquipment?: Equipment;
    originalHealth: number;
    originalAttack: number;
    originalMana: number;
    originalEquipment?: Equipment;
    originalSavedPosition?: 0 | 1 | 2 | 3 | 4;
    exp?: number = 0;
    originalExp?: number = 0;
    faintPet: boolean = false;
    transformed: boolean = false;
    transformedInto: Pet | null = null;
    startOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    transform?(gameApi: GameAPI, tiger?: boolean): void;
    // startOfTurn?: () => void;
    hurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    faint?(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void;
    friendSummoned?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    friendAheadAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    adjacentAttacked?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    friendAheadFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendLostPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    gainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendAteFood?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    eatsFood?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedAilment?(gameApi: GameAPI, pet?: Pet): void;
    friendHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendTransformed?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    beforeFriendAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyAttack?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    afterAttack?(gameApi: GameAPI, tiger?: boolean): void;
    beforeAttack?(gameApi: GameAPI, tiger?: boolean): void;
    beforeStartOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    anyoneLevelUp?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    // NOTE: not all End Turn ability pets should have their ability defined. e.g Giraffe
    // example of pet that SHOULD be defined: Parrot.
    endTurn?(gameApi: GameAPI): void;
    knockOut?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    summoned?(gameApi: GameAPI, tiger?: boolean): void;
    friendlyToyBroke?(gameApi: GameAPI, tiger?: boolean): void;
    enemySummoned?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyPushed?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    emptyFrontSpace?(gameApi: GameAPI, tiger?: boolean): void;
    afterFaint?(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void;

    // gameApi is not available currenly but can be added if needed.
    gainedMana?(gameApi: GameAPI, tiger?: boolean): void;
    friendJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyGainedAilment?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainsHealth?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedExperience?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;

    // orignal methods -- used when overrwriting methods
    originalStartOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    originalTransform?(gameApi: GameAPI, tiger?: boolean): void;
    // originalStartOfTurn?: () => void;
    originalHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFaint?(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void;
    originalFriendSummoned?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    originalFriendAheadAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalAdjacentAttacked?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    originalFriendAheadFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendAteFood?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEatsFood?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendLostPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainedAilment?(gameApi: GameAPI, pet?: Pet): void;
    originalFriendHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendTransformed?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalBeforeFriendAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyAttack?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalAfterAttack?(gameApi: GameAPI, tiger?: boolean): void;
    originalBeforeAttack?(gameApi: GameAPI, tiger?: boolean): void;
    originalBeforeStartOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    originalAnyoneLevelUp?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    // NOTE: not all End Turn ability pets should have their ability defined. e.g Giraffe
    // example of pet that SHOULD be defined: Parrot.
    originalEndTurn?(gameApi: GameAPI): void;
    originalKnockOut?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalSummoned?(gameApi: GameAPI, tiger?: boolean): void;
    originalFriendlyToyBroke?(gameApi: GameAPI, tiger?: boolean): void;
    originalEnemySummoned?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyPushed?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEmptyFrontSpace?(gameApi: GameAPI, tiger?: boolean): void;
    originalAfterFaint?(gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean): void;
    originalGainedMana?(gameApi: GameAPI, tiger?: boolean): void;
    originalFriendJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyGainedAilment?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainsHealth?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainedExperience?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void; 

    savedPosition: 0 | 1 | 2 | 3 | 4;
    // flags to make sure events/logs are not triggered multiple times
    done = false;
    seenDead = false;
    swallowedPets?: Pet[] = [];
    abominationSwallowedPet1?: string;
    abominationSwallowedPet2?: string;
    abominationSwallowedPet3?: string;
    belugaSwallowedPet: string;
    toyPet = false;
    battlesFought: number = 0;
    // fixes bug where eggplant ability is triggered multiple times
    // if we already set eggplant ability make sure not to set it again
    eggplantTouched = false;
    cherryTouched = false;

    // Battle context tracking for complex abilities
    currentTarget?: Pet; // Who this pet is currently attacking
    lastAttacker?: Pet; // Who last attacked this pet //TO DO: This might be useless
    killedBy?: Pet; // Who caused this pet to faint


    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player) {
        this.parent = parent;
    }

    initPet(exp: number, health: number, attack: number, mana: number, equipment: Equipment) {
        this.exp = exp ?? this.exp;
        this.health = health ?? this.health * this.level;
        this.attack = attack ?? this.attack * this.level;
        this.mana = mana ?? this.mana;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.originalMana = this.mana;
        this.equipment = equipment;
        this.originalEquipment = equipment;
        this.originalExp = this.exp;

        this.originalStartOfBattle = this.startOfBattle;
        this.originalTransform = this.transform;
        // this.originalStartOfTurn = this.startOfTurn;
        this.originalHurt = this.hurt;
        this.originalFaint = this.faint;
        this.originalFriendSummoned = this.friendSummoned;
        this.originalFriendAheadAttacks = this.friendAheadAttacks;
        this.originalAdjacentAttacked = this.adjacentAttacked;
        this.originalFriendAheadFaints = this.friendAheadFaints;
        this.originalFriendFaints = this.friendFaints;
        this.originalFriendAteFood = this.friendAteFood;
        this.originalEatsFood = this.eatsFood;
        this.originalFriendLostPerk = this.friendLostPerk;
        this.originalGainedPerk = this.gainedPerk;
        this.originalFriendGainedPerk = this.friendGainedPerk;
        this.originalFriendGainedAilment = this.friendGainedAilment;
        this.originalFriendHurt = this.friendHurt;
        this.originalFriendTransformed = this.friendTransformed;
        this.originalFriendAttacks = this.friendAttacks;
        this.originalBeforeFriendAttacks = this.beforeFriendAttacks;
        this.originalEnemyAttack = this.enemyAttack;
        this.originalAfterAttack = this.afterAttack;
        this.originalAfterFaint = this.afterFaint;
        this.originalBeforeAttack = this.beforeAttack;
        this.originalBeforeStartOfBattle = this.beforeStartOfBattle;
        this.originalAnyoneLevelUp = this.anyoneLevelUp;
        this.originalEndTurn = this.endTurn;
        this.originalKnockOut = this.knockOut;
        this.originalSummoned = this.summoned;
        this.originalFriendlyToyBroke = this.friendlyToyBroke;
        this.originalEnemySummoned = this.enemySummoned;
        this.originalEnemyPushed = this.enemyPushed;
        this.originalEnemyHurt = this.enemyHurt;
        this.originalEmptyFrontSpace = this.emptyFrontSpace;
        this.originalAfterFaint = this.afterFaint;
        this.originalGainedMana = this.gainedMana;
        this.originalFriendJumped = this.friendJumped;
        this.originalEnemyJumped = this.enemyJumped;
        this.originalEnemyGainedAilment = this.enemyGainedAilment;
        this.originalFriendGainsHealth = this.friendGainsHealth;
        this.originalFriendGainedExperience = this.friendGainedExperience;

        // set faint ability to handle mana ability
        let faintCallback = this.faint?.bind(this);
        if (faintCallback != null || this.afterFaint != null) {
            this.faintPet = true;
        }
        this.faint = (gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean) => {
            if (faintCallback != null) {
                if (!this.abilityValidCheck()) {
                    return;
                }
                faintCallback(gameApi, tiger, pteranodon);
            }

            if (!this.abilityValidCheck()) {
                return;
            }

            if (this.kitsuneCheck()) {
                return;
            }
            
            if (this.mana > 0) {
                
                let manaEvent: AbilityEvent;

                manaEvent = {
                    priority: this.attack,
                    player: this.parent,
                    callback: () => {
                        let targetResp = getOpponent(gameApi, this.parent).getRandomPet([], false, true, false, this);
                        if (targetResp.pet == null) {
                            return;
                        }
                        if (this.mana == 0) {
                            return;
                        }
                        this.snipePet(targetResp.pet, this.mana, true, false, false, false, true);
                    }
                }

                this.abilityService.setManaEvent(manaEvent);
            }
        }

        let startOfBattleCallback = this.startOfBattle?.bind(this);
        this.startOfBattle = startOfBattleCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            return startOfBattleCallback(gameApi, tiger);
        }

        let transformCallback = this.transform?.bind(this);
        this.transform = transformCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            transformCallback(gameApi, tiger);
        }

        let endTurnCallback = this.endTurn?.bind(this);
        this.endTurn = endTurnCallback == null ? null : (gameApi: GameAPI) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            endTurnCallback(gameApi);
        }

        let beforeAttackCallback = this.beforeAttack?.bind(this);
        this.beforeAttack = beforeAttackCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            beforeAttackCallback(gameApi, tiger);
        }

        let afterAttackCallback = this.afterAttack?.bind(this);
        this.afterAttack = afterAttackCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            afterAttackCallback(gameApi, tiger);
        }

        let friendAttacksCallback = this.friendAttacks?.bind(this);
        this.friendAttacks = friendAttacksCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendAttacksCallback(gameApi, pet, tiger);
        }

        let beforeFriendAttacksCallback = this.beforeFriendAttacks?.bind(this);
        this.beforeFriendAttacks = beforeFriendAttacksCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            beforeFriendAttacksCallback(gameApi, pet, tiger);
        }

        let friendFaintsCallback = this.friendFaints?.bind(this);
        this.friendFaints = friendFaintsCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendFaintsCallback(gameApi, pet, tiger);
        }

        
        let friendLostPerkCallback = this.friendLostPerk?.bind(this);
        this.friendLostPerk = friendLostPerkCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendLostPerkCallback(gameApi, pet, tiger);
        }

        let GainedPerkCallback = this.gainedPerk?.bind(this);
        this.gainedPerk = GainedPerkCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            GainedPerkCallback(gameApi, pet, tiger);
        }

        let friendGainedPerkCallback = this.friendGainedPerk?.bind(this);
        this.friendGainedPerk = friendGainedPerkCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendGainedPerkCallback(gameApi, pet, tiger);
        }

        let eatsFoodCallback = this.eatsFood?.bind(this);
        this.eatsFood = eatsFoodCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            eatsFoodCallback(gameApi, pet, tiger);
        }

        let friendAteFoodCallback = this.friendAteFood?.bind(this);
        this.friendAteFood = friendAteFoodCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendAteFoodCallback(gameApi, pet, tiger);
        }

        let beforeStartOfBattleCallback = this.beforeStartOfBattle?.bind(this);
        this.beforeStartOfBattle = beforeStartOfBattleCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            beforeStartOfBattleCallback(gameApi, tiger);
        }

        let friendHurtCallback = this.friendHurt?.bind(this);
        this.friendHurt = friendHurtCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendHurtCallback(gameApi, pet, tiger);
        }

        let friendTransformedCallback = this.friendTransformed?.bind(this);
        this.friendTransformed = friendTransformedCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendTransformedCallback(gameApi, pet, tiger);
        }

        let friendSummonedCallback = this.friendSummoned?.bind(this);
        this.friendSummoned = friendSummonedCallback == null ? null : (gameApi: GameAPI, pet: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendSummonedCallback(gameApi, pet, tiger);
        }

        let anyoneLevelUpCallback = this.anyoneLevelUp?.bind(this);
        this.anyoneLevelUp = anyoneLevelUpCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            anyoneLevelUpCallback(gameApi, pet, tiger);
        }

        let enemyHurtCallback = this.enemyHurt?.bind(this);
        this.enemyHurt = enemyHurtCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemyHurtCallback(gameApi, pet, tiger);
        }

        let enemySummonedCallback = this.enemySummoned?.bind(this);
        this.enemySummoned = enemySummonedCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemySummonedCallback(gameApi, pet, tiger);
        }

        let emptyFrontSpaceCallback = this.emptyFrontSpace?.bind(this);
        this.emptyFrontSpace = emptyFrontSpaceCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            emptyFrontSpaceCallback(gameApi, tiger);
        }

        let gainedManaCallback = this.gainedMana?.bind(this);
        this.gainedMana = gainedManaCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            gainedManaCallback(gameApi, tiger);
        }

        let friendJumpedCallback = this.friendJumped?.bind(this);
        this.friendJumped = friendJumpedCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendJumpedCallback(gameApi, pet, tiger);
        }

        let enemyJumpedCallback = this.enemyJumped?.bind(this);
        this.enemyJumped = enemyJumpedCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemyJumpedCallback(gameApi, pet, tiger);
        }

        let friendlyToyBrokeCallback = this.friendlyToyBroke?.bind(this);
        this.friendlyToyBroke = friendlyToyBrokeCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendlyToyBrokeCallback(gameApi, tiger);
        }

        let enemyPushedCallback = this.enemyPushed?.bind(this);
        this.enemyPushed = enemyPushedCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemyPushedCallback(gameApi, pet, tiger);
        }

        let summonedCallback = this.summoned?.bind(this);
        this.summoned = summonedCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {

            summonedCallback(gameApi, tiger);
        }

        let knockOutCallback = this.knockOut?.bind(this);
        this.knockOut = knockOutCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            knockOutCallback(gameApi, pet, tiger);
        }

        let enemyGainedAilmentCallback = this.enemyGainedAilment?.bind(this);
        this.enemyGainedAilment = enemyGainedAilmentCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemyGainedAilmentCallback(gameApi, pet, tiger);
        }

        let friendGainsHealthCallback = this.friendGainsHealth?.bind(this);
        this.friendGainsHealth = friendGainsHealthCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendGainsHealthCallback(gameApi, pet, tiger);
        }

        let friendGainedExperienceCallback = this.friendGainedExperience?.bind(this);
        this.friendGainedExperience = friendGainedExperienceCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendGainedExperienceCallback(gameApi, pet, tiger);
        }

        let afterFaintCallback = this.afterFaint?.bind(this);
        this.afterFaint = afterFaintCallback == null ? null : (gameApi: GameAPI, tiger?: boolean, pteranodon?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            afterFaintCallback(gameApi, tiger, pteranodon);
        }
    
        
        this.setAbilityUses();
    }

    abilityValidCheck() {
        if (this.savedPosition == null) {
            return false;
        }
        if (this.disabled) {
            return false;
        }
        if (this.equipment instanceof Dazed) {
            this.logService.createLog({
                message: `${this.name}'s ability was not activated because of Dazed.`,
                type: 'ability',
                player: this.parent
            })
            return false;
        }
        return true;
    }

    // overrwrite this method if maxAbilityUses is determined by level
    setAbilityUses() {
        this.abilityUses = 0;
    }

    tigerCheck(tiger) {
        if (this.petBehind(true, true)?.name == 'Tiger' && (tiger == null || tiger == false)) {
            return true;
        }
        return false;
    }

    protected superStartOfBattle(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(true, true).minExpForLevel;
        this.startOfBattle(gameApi,true)
        this.exp = exp;
    
    }

    protected superHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.hurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFaint(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.faint(gameApi, true)
        this.exp = exp;
    }

    protected superFriendSummoned(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendSummoned(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAheadAttacks(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendAheadAttacks(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAheadFaints(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendAheadFaints(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAdjacentAttacked(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.adjacentAttacked(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAfterAttack(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.afterAttack(gameApi, true)
        this.exp = exp;
    }

    protected superSummoned(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.summoned(gameApi, true)
        this.exp = exp;
    }

    protected superKnockOut(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.knockOut(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendFaints(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendFaints(gameApi, pet, true)
        this.exp = exp;
    }

    protected superBeforeAttack(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.beforeAttack(gameApi, true)
        this.exp = exp;

    }

    protected superBeforeFriendAttacks(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.beforeFriendAttacks(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendLosPerk(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendLostPerk(gameApi, pet, true)
        this.exp = exp;
    }

    protected superGainedPerk(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.gainedPerk(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendGainedPerk(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendGainedPerk(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEatsFood(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.eatsFood(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAteFood(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendAteFood(gameApi, pet, true)
        this.exp = exp;
    }

    protected superBeforeStartOfBattle(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.beforeStartOfBattle(gameApi, true)
        this.exp = exp;
    }

    protected superFriendlyToyBroke(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendlyToyBroke(gameApi, true)
        this.exp = exp;
    }

    protected superTransform(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.transform(gameApi, true)
        this.exp = exp;
    }

    protected superEnemySummoned(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemySummoned(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyPushed(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemyPushed(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendHurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendTransformed(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendTransformed(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAnyoneLevelUp(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.anyoneLevelUp(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemyHurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAttacks(gameApi, pet=null, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendAttacks(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyAttack(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemyAttack(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEmptyFrontSpace(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.emptyFrontSpace(gameApi, true)
        this.exp = exp;
    }

    protected superGainedMana(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.gainedMana(gameApi, true)
        this.exp = exp;
    }

    protected superFriendJumped(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendJumped(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyJumped(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemyJumped(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyGainedAilment(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.enemyGainedAilment(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendGainsHealth(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendGainsHealth(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendGainedExperience(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.friendGainedExperience(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAfterFaint(gameApi, tiger=false, pteranodon=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind(null, true).minExpForLevel;
        this.afterFaint(gameApi, true, pteranodon);
        this.exp = exp;
    }


    attackPet(pet: Pet,  jumpAttack: boolean = false, power?: number, random: boolean = false) {

        let damageResp = this.calculateDamgae(pet, this.getManticoreMult(), power);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        let attackMultiplier = this.equipment?.multiplier;
        let defenseMultiplier = pet.equipment?.multiplier;
        this.currentTarget = pet;
        let message: string;
        if (jumpAttack) {
            message = `${this.name} jump-attacks ${pet.name} for ${damage}.`;
            if (this.equipment instanceof WhiteTruffle) {
                message += `(White Truffle)`
            }
        } else{
            message = `${this.name} attacks ${pet.name} for ${damage}.`;
        }
        // peanut death
        if (attackEquipment instanceof Peanut && damage > 0) {
            this.logService.createLog({
                message: `${message} (Peanut)`,
                type: 'attack',
                player: this.parent,
                randomEvent: random
            })
            this.dealDamage(pet,damage);
            pet.killedBy = this;
            pet.health = 0;
        } else if (attackEquipment instanceof PeanutButter && damage > 0 && attackEquipment.uses > 0) {
            this.logService.createLog({
                message: `${message} (Peanut Butter)`,
                type: 'attack',
                player: this.parent,
                randomEvent: random
            })

            pet.killedBy = this;
            this.dealDamage(pet,damage);
            pet.health = 0;
        } else {
            this.dealDamage(pet, damage);
            if (attackEquipment != null) {
                let power: any = Math.abs(attackEquipment.power);
                let sign = '-';
                if (attackEquipment.power > 0) {
                    sign = '+';
                }
                let powerAmt = `${sign}${power}`;
                if (attackEquipment instanceof Salt) {
                        powerAmt = `x2`;
                }
                if (attackEquipment instanceof MapleSyrupAttack) {
                        powerAmt = `x0.5`;
                }
                if (attackEquipment instanceof Cheese) {
                    if (damage <= 15) {
                        powerAmt = '=15';
                    } else {
                        powerAmt = '+0';
                    }
                }
                if (attackEquipment instanceof FortuneCookie) {
                    random = true;
                    if (damageResp.fortuneCookie) {
                        powerAmt = `x2`;
                        if (attackEquipment.multiplier > 1) {
                            powerAmt += attackEquipment.multiplierMessage;
                        }
                    } else {
                        powerAmt = `x1`;
                    }
                }
                
                message += ` (${attackEquipment.name} ${powerAmt})`;

                if (attackMultiplier > 1) {
                    message += this.equipment.multiplierMessage;
                }
            }
            if (defenseEquipment != null) {
                let power: any = Math.abs(defenseEquipment.power);
                let sign = '-';
                if (defenseEquipment.power < 0) {
                    sign = '+';
                }
                if (defenseEquipment.name === 'Strawberry') {
                    let sparrowLevel = pet.getSparrowLevel();
                    if (sparrowLevel > 0) {
                        power = sparrowLevel * 5;
                        message += ` (Strawberry -${power} (Sparrow))`;
                    }
                } else if (defenseEquipment instanceof Pepper) {
                    if (pet.health == 1) {
                        sign = '!';
                    } else {
                        sign = '-';
                    }
                    power = '';
                    message += ` (${defenseEquipment.name} ${sign}${power})`;
                } else if (defenseEquipment instanceof MapleSyrup) {
                    power = 'x0.5'
                    message += ` (${defenseEquipment.name} ${power})`;
                } else {
                    message += ` (${defenseEquipment.name} ${sign}${power})`;
                }

                if (defenseMultiplier > 1) {
                    message += pet.equipment.multiplierMessage;
                }
                //pet.useDefenseEquipment();
            }
            
            if (pet.equipment instanceof Exposed) {
                message += 'x2 (Exposed)';
                if (pet.equipment.multiplier > 1) {
                    message += pet.equipment.multiplierMessage;
                }
            }

            if (damageResp.nurikabe > 0) {
                message += ` -${damageResp.nurikabe} (Nurikabe)`;
            }
            if (damageResp.fairyBallReduction > 0) { 
                message += ` -${damageResp.fairyBallReduction} (Fairy Ball)`;
            }
            if (damageResp.fanMusselReduction > 0) {
                message += ` -${damageResp.fanMusselReduction} (Fan Mussel)`;
            }
            if (damageResp.mapleSyrupReduction > 0) {
                message += ` -${damageResp.mapleSyrupReduction} (Maple Syrup)`;
            }
            // if (attackEquipment != null) {
            //     let power = Math.abs(attackEquipment.power);
            //     let sign = '-';
            //     if (attackEquipment.power < 0) {
            //         sign = '+';
            //     }
            //     if (attackMultiplier > 1) {
            //         message += ` x${attackMultiplier} (Panther)`;
            //     }
            //     message += ` (${attackEquipment.name} ${sign}${power})`;
            // }

            
            let manticoreMult = this.getManticoreMult();
            let manticoreAilments = [
                'Weak',
                'Cold',
                'Exposed',
                'Spooked'
            ]
            let hasAilment = manticoreAilments.includes(pet.equipment?.name);

            if (manticoreMult.length > 0 && hasAilment) {
                for (let mult of manticoreMult) {
                    message += ` x${mult + 1} (Manticore)`;
                }
            }

            this.logService.createLog({
                message: message,
                type: "attack",
                player: this.parent,
                randomEvent: random
            });
    
            let skewerEquipment: Equipment = this.equipment?.equipmentClass == 'skewer' ? this.equipment : null;
            if (skewerEquipment != null) {
                skewerEquipment.attackCallback(this, pet);
            }
        }

        // unified friend attack events (includes friendAttacks, friendAheadAttacks, and enemyAttacks)
        this.abilityService.triggerFriendAttacksEvents(this.parent, this);

        // after attack
        if (this.afterAttack != null) {
            this.abilityService.setAfterAttackEvent({
                callback: this.afterAttack.bind(this),
                priority: this.attack,
                pet: this
            })
        }
        this.applyCrisp();

    }

    applyCrisp() {
        let manticoreMult = this.parent.opponent.getManticoreMult();
        for (let pet of this.parent.petArray) {
            if (pet.equipment instanceof Crisp) {
                let damage = 6;
                let totalMultiplier = pet.equipment.multiplier ;
                for (let mult of manticoreMult) {
                    totalMultiplier += mult;
                }
                damage *= totalMultiplier;
                let nurikabe = 0;
                if (pet.name == 'Nurikabe' && pet.abilityUses < 3) {
                    nurikabe = pet.level * 4;
                    damage = Math.max(0, damage - nurikabe);
                    pet.abilityUses++;
                }
                let fanMusselReduction = 0;
                if (pet.name == 'Fan Mussel' && pet.abilityUses < pet.maxAbilityUses) {
                    fanMusselReduction = pet.level * 1;
                    damage = Math.max(0, damage - fanMusselReduction);
                    pet.abilityUses++;
                }
                let message = `${pet.name} took ${damage} damage`;
                if (manticoreMult.length > 0) {
                    for (let mult of manticoreMult) {
                        message += ` x${mult + 1} (Manticore)`;
                    }
                }
                if (pet.equipment.multiplier > 1) {
                    message += pet.equipment.multiplierMessage;
                }
                if (nurikabe > 0) {
                    message += ` -${nurikabe} (Nurikabe)`;
                }
                if (fanMusselReduction > 0) {
                    message += ` -${fanMusselReduction} (Fan Mussel)`;
                }
                message += ` (Crisp).`;

                this.logService.createLog({
                    message: message,
                    type: 'ability',
                    player: pet.parent
                });
                this.dealDamage(pet, damage);
                pet.removePerk();
            }
            else if (pet.equipment instanceof Toasty && pet.equipment.uses > 0) {
                let damage = 1;
                let totalMultiplier = pet.equipment.multiplier;
                for (let mult of manticoreMult) {
                    totalMultiplier += mult;
                }
                damage *= totalMultiplier;
                let nurikabe = 0;
                if (pet.name == 'Nurikabe' && pet.abilityUses < 3) {
                    nurikabe = pet.level * 4;
                    damage = Math.max(0, damage - nurikabe);
                    pet.abilityUses++;
                }
                let fanMusselReduction = 0;
                if (pet.name == 'Fan Mussel' && pet.abilityUses < pet.maxAbilityUses) {
                    fanMusselReduction = pet.level * 1;
                    damage = Math.max(0, damage - fanMusselReduction);
                    pet.abilityUses++;
                }
                let message = `${pet.name} took ${damage} damage`;
                if (manticoreMult.length > 0) {
                    for (let mult of manticoreMult) {
                        message += ` x${mult + 1} (Manticore)`;
                    }
                }
                if (pet.equipment.multiplier > 1) {
                    message += pet.equipment.multiplierMessage;
                }
                if (nurikabe > 0) {
                    message += ` -${nurikabe} (Nurikabe)`;
                }
                if (fanMusselReduction > 0) {
                    message += ` -${fanMusselReduction} (Fan Mussel)`;
                }
                message += ` (Toasty).`;

                this.logService.createLog({
                    message: message,
                    type: 'ability',
                    player: pet.parent
                });
                this.dealDamage(pet, damage);
                pet.equipment.uses--;
                if (pet.equipment.uses <= 0) {
                    pet.removePerk();
                }

            }
        }
    }

    /**
     * 
     * @param pet 
     * @param power 
     * @param randomEvent 
     * @param tiger 
     * @param pteranodon 
     * @param equipment 
     * @param mana 
     * @returns damage amount
     */
    snipePet(pet: Pet, power: number, randomEvent?: boolean, tiger?: boolean, pteranodon?: boolean, equipment?: boolean, mana?: boolean) {

        let albatross = false;
        if (this.petAhead?.name == 'Albatross' && pet.tier <= 4) {
            power += this.petAhead.level * 3;
            albatross = true;
        }
        if (this.petBehind()?.name == 'Albatross' && pet.tier <= 4) {
            power += this.petBehind().level * 3;
            albatross = true;
        }

        let damageResp = this.calculateDamgae(pet, this.getManticoreMult(), power, true);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        let ghostKitten = pet.name == 'Ghost Kitten';
        let ghostKittenMitigation = 0;
        if (ghostKitten) {
            ghostKittenMitigation = pet.level * 3;
            damage = Math.max(0, damage - ghostKittenMitigation);
        }
        this.dealDamage(pet, damage);

        let message = `${this.name} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment(true)
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            if (defenseEquipment.name === 'Strawberry') {
                let sparrowLevel = pet.getSparrowLevel();
                if (sparrowLevel > 0) {
                    power = sparrowLevel * 5;
                    message += ` (Strawberry -${power} (Sparrow))`;
                }
            } else {
                message += ` (${defenseEquipment.name} ${sign}${power})`;
            }
            message += defenseEquipment.multiplierMessage;
        }
        if (attackEquipment != null && attackEquipment.equipmentClass == 'attack-snipe') {
            let power = Math.abs(attackEquipment.power);
            let sign = '-';
            if (attackEquipment.power > 0) {
                sign = '+';
            }
            message += ` (${attackEquipment.name} ${sign}${power})`;
        }

        // Add equipment multiplier message support (like Pandora's Box)
        if (this.equipment?.multiplier > 1) {
            message += this.equipment.multiplierMessage;
        }

        if (tiger) {
            message += ' (Tiger)'
        }

        if (albatross) {
            message += ' (Albatross)'
        }

        if (equipment) {
            message += ` (${this.equipment.name})`
        }

        if (mana) {
            message += ' (Mana)'
        }

        if (ghostKitten) {
            message += ` -${ghostKittenMitigation} (Ghost Kitten)`;
        }

        if (pet.equipment?.name == 'Exposed') {
            message += 'x2 (Exposed)';
            if (pet.equipment.multiplier > 1) {
                message += pet.equipment.multiplierMessage;
            }
        }

        let manticoreMult = this.getManticoreMult();
        let manticoreAilments = [
            'Weak',
            'Cold',
            'Exposed',
            'Spooked'
        ]
        let hasAilment = manticoreAilments.includes(pet.equipment?.name);
        if (manticoreMult.length > 0 && hasAilment) {
            for (let mult of manticoreMult) {
                message += ` x${mult + 1} (Manticore)`;
            }
        }

        if (damageResp.nurikabe > 0) {
            message += ` -${damageResp.nurikabe} (Nurikabe)`
        }
        if (damageResp.fairyBallReduction > 0) { 
            message += ` -${damageResp.fairyBallReduction} (Fairy Ball)`
        }
        if (damageResp.fanMusselReduction > 0) {
            message += ` -${damageResp.fanMusselReduction} (Fan Mussel)`
        }

        this.logService.createLog({
            message: message,
            type: "attack",
            randomEvent: randomEvent,
            player: this.parent,
            pteranodon: pteranodon
        });
        
        return damage;
    }

    calculateDamgae(pet: Pet, manticoreMult: number[], power?: number, snipe=false):
        {
            defenseEquipment: Equipment,
            attackEquipment: Equipment,
            damage: number,
            fortuneCookie: boolean,
            nurikabe: number,
            fairyBallReduction?: number,
            fanMusselReduction?: number,
            mapleSyrupReduction?: number,
        } {
        let attackMultiplier = this.equipment?.multiplier;
        let defenseMultiplier = pet.equipment?.multiplier;

        const manticoreDefenseAilments = [
            'Cold',
            'Weak',
            'Spooked'
        ];

        const manticoreAttackAilments = [
            'Ink'
        ];

        const manticoreOtherAilments = [
            'Exposed'
        ]

        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' 
        || pet.equipment?.equipmentClass == 'shield'
        || pet.equipment?.equipmentClass == 'ailment-defense'
        || (snipe && pet.equipment?.equipmentClass == 'shield-snipe') ? pet.equipment : null;

        if (defenseEquipment != null) {

            if (manticoreDefenseAilments.includes(defenseEquipment?.name)) {
                for (let mult of manticoreMult) {
                    defenseMultiplier += mult;
                }
            }
            defenseEquipment.power = defenseEquipment.originalPower * defenseMultiplier;
        }


        let attackEquipment: Equipment;
        let attackAmt: number;
        // TODO snipe ability bug with ink?
        if (snipe) {
            attackEquipment = this.equipment?.equipmentClass == 'attack-snipe' ? this.equipment : null;
            attackAmt = attackEquipment != null ? power + attackEquipment.power : power;
            if (defenseEquipment instanceof MapleSyrup) {
                defenseEquipment = null;
            }
        } else {
            if (this.equipment instanceof HoneydewMelon) {
                // Create attack equipment for the one-time +5 damage
                attackEquipment = new HoneydewMelonAttack();
            } else if (this.equipment instanceof MapleSyrup) {
                // Create attack equipment for the one-time 50% damage reduction
                attackEquipment = new MapleSyrupAttack();
            } else {
                attackEquipment = this.equipment?.equipmentClass == 'attack'
                || this.equipment?.equipmentClass == 'ailment-attack' ? this.equipment : null;
            }
            if (attackEquipment != null) {
            
                if (manticoreAttackAilments.includes(attackEquipment?.name)) {
                    for (let mult of manticoreMult) {
                        attackMultiplier += mult;
                    }
                } 
                attackEquipment.power = attackEquipment.originalPower * attackMultiplier;

            }

            let petAttack = this.attack;
            if (this.name == 'Monty') {
                petAttack *= this.level + 1;
            }
            //use input power, or pet Attack
            const baseAttack = power != null ? power : petAttack;
            //0 if equipment is stuff liek salt
            const equipmentBonus = attackEquipment?.power? attackEquipment.power : 0;
            attackAmt = baseAttack + equipmentBonus;
        }
        let defenseAmt = defenseEquipment?.power ? defenseEquipment.power : 0;
        
        // Check for Sparrow enhancement of Strawberries
        let sparrowLevel = pet.getSparrowLevel();
        if (pet.equipment?.name === 'Strawberry' && sparrowLevel > 0) {
            defenseAmt += sparrowLevel * 5;
        }
        let min = defenseEquipment?.equipmentClass == 'shield' || defenseEquipment?.equipmentClass == 'shield-snipe' ? 0 : 1;
        //check garlic
        if (defenseEquipment?.minimumDamage !== undefined) {
            min = defenseEquipment.minimumDamage;
        }

        let mapleSyrupReduction = 0;
        if (pet.equipment instanceof MapleSyrup && pet.equipment.uses > 0 && !snipe) {
            attackAmt = Math.floor(attackAmt * Math.pow(0.5, defenseMultiplier));
        }


        if (attackEquipment instanceof Salt && !snipe) {
            attackAmt *= (2 + attackMultiplier - 1);
        }

        if (attackEquipment instanceof MapleSyrupAttack && !snipe) {
            attackAmt = Math.floor(attackAmt * Math.pow(0.5, attackMultiplier));
        }

        let fortuneCookie = false;
        if (attackEquipment instanceof FortuneCookie && !snipe) {
            // flip a coin
            if (Math.random() < 0.5) {
                attackAmt *= (2 + attackMultiplier - 1);
                fortuneCookie = true;
            }
        }

        if (attackEquipment instanceof Cheese && !snipe) {
            attackAmt = Math.max(15, attackAmt);
        }


        if (pet.equipment instanceof Exposed) {
            let totalMultiplier = 2; // Base exposed multiplier
            for (let mult of manticoreMult) {
                totalMultiplier += mult; // Add manticore multipliers
            }
            totalMultiplier += pet.equipment.multiplier - 1; // Add pandora's box multiplier
            attackAmt *= totalMultiplier;
        }
        let damage: number;
        if (attackAmt <= min) {
            damage = Math.max(attackAmt - defenseAmt, 0);
        } else {
            damage = Math.max(min, attackAmt - defenseAmt);
        }

        if (defenseEquipment instanceof Pepper) {
            damage = Math.min(damage, pet.health - 1);
        }
        //TO DO: Might need to move all pet's less damage ability down here, or into Deal Damage
        let fairyBallReduction = 0;
        if (pet.name === 'Fairy Ball' && damage > 0) {
            fairyBallReduction = pet.level * 2;
            damage = Math.max(1, damage - fairyBallReduction);
        }

        let nurikabe = 0;
        if (pet.name == 'Nurikabe' && pet.abilityUses < 3 && damage > 0) {
            nurikabe = pet.level * 4;
            damage = Math.max(1, damage - fairyBallReduction);
            pet.abilityUses++;
        }

        let fanMusselReduction = 0;
        if (pet.name == 'Fan Mussel' && pet.abilityUses < pet.maxAbilityUses && damage > 0) {
            fanMusselReduction = pet.level * 1;
            damage = Math.max(1, damage - fairyBallReduction);
            pet.abilityUses++;
        }

        
        return {
            defenseEquipment: defenseEquipment,
            attackEquipment: attackEquipment,
            damage: damage,
            fortuneCookie: fortuneCookie,
            nurikabe: nurikabe,
            fairyBallReduction: fairyBallReduction,
            fanMusselReduction: fanMusselReduction,
            mapleSyrupReduction: mapleSyrupReduction,
        }
    } 

    resetPet() {
        this.health = this.originalHealth;
        this.attack = this.originalAttack;
        this.equipment = this.originalEquipment;
        this.lastLostEquipment = null;
        this.mana = this.originalMana;
        this.exp = this.originalExp;
        this.done = false;
        this.seenDead = false;
        this.disabled = false;
        try {
            this.equipment?.reset();
        } catch (error) {
            console.warn('equipment reset failed', this.equipment)
            console.error(error)
            // window.alert("You found a rare bug! Please report this bug using the Report A Bug feature and say in this message that you found the rare bug. Thank you!")
        }
        this.swallowedPets = [];
        this.savedPosition = this.originalSavedPosition;
        this.setAbilityUses();
        
        // Reset battle context tracking
        this.transformed = false;
        this.transformedInto = null;
        this.currentTarget = null;
        this.lastAttacker = null;
        
        // Reset battle-specific counters while preserving user-configured values
        if (this.hasOwnProperty('attackCounter')) {
            (this as any).attackCounter = 0;
        }
        this.killedBy = null;
        
        // Restore original ability methods to fix equipment copying persistence issues
        this.beforeAttack = this.originalBeforeAttack;
        this.afterAttack = this.originalAfterAttack;
        this.beforeFriendAttacks = this.originalBeforeFriendAttacks;
        this.enemyAttack = this.originalEnemyAttack;
        this.friendAttacks = this.originalFriendAttacks;
        this.hurt = this.originalHurt;
        this.faint = this.originalFaint;
        this.friendSummoned = this.originalFriendSummoned;
        this.friendAheadAttacks = this.originalFriendAheadAttacks;
        this.adjacentAttacked = this.originalAdjacentAttacked;
        this.friendAheadFaints = this.originalFriendAheadFaints;
        this.friendFaints = this.originalFriendFaints;
        this.friendAteFood = this.originalFriendAteFood;
        this.eatsFood = this.originalEatsFood;
        this.friendGainedPerk = this.originalFriendGainedPerk;
        this.friendGainedAilment = this.originalFriendGainedAilment;
        this.friendHurt = this.originalFriendHurt;
        this.friendTransformed = this.originalFriendTransformed;
        this.afterFaint = this.originalAfterFaint;
        this.beforeStartOfBattle = this.originalBeforeStartOfBattle;
        this.anyoneLevelUp = this.originalAnyoneLevelUp;
        this.endTurn = this.originalEndTurn;
        this.knockOut = this.originalKnockOut;
        this.summoned = this.originalSummoned;
        // set faint ability to handle mana ability
        let faintCallback = this.faint?.bind(this);
        if (faintCallback != null || this.afterFaint != null) {
            this.faintPet = true;
        }

        this.faint = (gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean) => {
            if (faintCallback != null) {
                if (!this.abilityValidCheck()) {
                    return;
                }
                faintCallback(gameApi, tiger, pteranodon);
            }

            if (!this.abilityValidCheck()) {
                return;
            }

            if (this.kitsuneCheck()) {
                return;
            }
            
            if (this.mana > 0) {
                
                let manaEvent: AbilityEvent;

                manaEvent = {
                    priority: this.attack,
                    player: this.parent,
                    callback: () => {
                        let targetResp = getOpponent(gameApi, this.parent).getRandomPet([], false, true);
                        let target = targetResp.pet;
                        if (target == null) {
                            return;
                        }
                        if (this.mana == 0) {
                            return;
                        }
                        this.snipePet(target, this.mana, targetResp.random, false, false, false, true);
                    }
                }

                this.abilityService.setManaEvent(manaEvent);
            }
        }
        
    }
    jumpAttackPrep(target: Pet) {
        // Trigger and execute before attack abilities on jumping pet and target
        if (this.beforeAttack && this.alive) {
            this.abilityService.setBeforeAttackEvent({
                callback: this.beforeAttack.bind(this),
                priority: this.attack,
                player: this.parent,
                pet: this
            });
        }
        
        if (target.beforeAttack) {
            this.abilityService.setBeforeAttackEvent({
                callback: target.beforeAttack.bind(target),
                priority: target.attack,
                player: target.parent,
                pet: target
            });
        }
        
        this.abilityService.executeBeforeAttackEvents();
        // 2. Trigger and execute before friend attacks events for BOTH players
        this.abilityService.triggerBeforeFriendAttacksEvents(this.parent, this);
        this.abilityService.triggerBeforeFriendAttacksEvents(target.parent, this);
        this.abilityService.executeBeforeFriendAttacksEvents();
    }
    // Jump attack method for abilities that attack and then advance turn
    jumpAttack(target: Pet, tiger?: boolean, damage?: number, randomEvent: boolean = false) {
        
        // Set current target for tracking
        target.lastAttacker = this;
        
        let attackPet: Pet;
        if (this.transformed) {
            attackPet = this.transformedInto
        } else {
            attackPet = this;
        }

        if (target.transformed) {
            target = target.transformedInto
        }
        // 3. Check if jumping pet is still alive
        if (!attackPet.alive || !target.alive) {
            return;
        }
        
        // 4. Perform the attack 
        attackPet.attackPet(target, true, damage, randomEvent);
        target.attackPet(attackPet);

        attackPet.useAttackDefenseEquipment();
        target.useAttackDefenseEquipment();
    
        attackPet.parent.checkPetsAlive();
        target.parent.checkPetsAlive();
    
        attackPet.abilityService.executeAfterAttackEvents();
        attackPet.abilityService.executeAfterFriendAttackEvents();
        
        // 6. Trigger and execute friend/enemy jumped abilities 
        attackPet.abilityService.triggerFriendJumpedEvents(attackPet.parent, attackPet);
        attackPet.abilityService.triggerEnemyJumpedEvents(target.parent, attackPet);
    }

    get alive(): boolean {
        return this.health > 0;
    }
    

    setFaintEventIfPresent() {

        if (this.faint != null) {
            this.abilityService.setFaintEvent(
                {
                    priority: this.attack,
                    callback: this.faint.bind(this),
                    pet: this 
                }
            )
        }
        if (this.equipment?.equipmentClass == 'faint') {
            this.abilityService.setFaintEvent(
                {
                    priority: -1, // ensures equipment faint ability occurs after pet faint abilities. Might need to be revisited
                    callback: () => { 
                        try {
                            this.equipment.callback(this);
                        } catch {
                            // this is an acceptable failure. example is microbe faint ability happening before other faint abilities, overwriting the equipment which could cause this issue.
                            console.warn('equipment callback failed', this.equipment)
                        }
                    },
                    pet: this 
                }
            )
        }

    }

    useDefenseEquipment(snipe=false) {
        if (this.equipment == null) {
            return;
        }

        if (this.equipment.equipmentClass == 'ailment-defense' || this.equipment.name == 'Exposed') {
            // skip the next if
        }
        else if (this.equipment.equipmentClass != 'defense' && this.equipment.equipmentClass != 'shield' && (snipe && this.equipment.equipmentClass != 'shield-snipe')) {
            return;
        }
        if (this.equipment.uses == null) {
            return;
        }
        this.equipment.uses -= 1;
        if (this.equipment.uses == 0) {
            this.removePerk();
        }
    }

    useAttackDefenseEquipment() {
        if (this.equipment == null) {
            return;
        }
        if (this.equipment.uses == null) {
            return;
        }
        
        if (this.equipment.equipmentClass != 'attack'
            && this.equipment.equipmentClass != 'defense'
            && this.equipment.equipmentClass != 'shield'
            && this.equipment.equipmentClass != 'snipe'
            && this.equipment.equipmentClass != 'ailment-attack'
            && this.equipment.equipmentClass != 'ailment-defense'
            && this.equipment.name != 'Exposed'
        ) {
            return;
        }
        if (isNaN(this.equipment.uses)) {
            console.warn('uses is NaN', this.equipment)
        }
        this.equipment.uses -= 1;
        if (this.equipment.uses == 0) {
            this.removePerk();
        }
    }

    increaseAttack(amt) {
        let max = 50;
        if (this.name == 'Behemoth') {
            max = 100;
        }
        if (!this.alive) {
            return;
        }
        this.attack = Math.min(Math.max(this.attack + amt, 1), max);
    }

    increaseHealth(amt: number) {
        let max = 50;
        if (this.name == 'Behemoth' || this.name == 'Giant Tortoise') {
            max = 100;
        }
        if (!this.alive) {
            return;
        }
        this.health = Math.min(Math.max(this.health + amt, 1), max);

        this.abilityService.triggerFriendGainsHealthEvents(this.parent, this);
        this.abilityService.executeFriendGainsHealthEvents();
    }

    dealDamage(pet: Pet, damage: number) {
        if (!pet.alive) {
            return;
        }
        pet.health -= damage;
        
        // Track who killed this pet
        if (pet.health <= 0) {
            pet.killedBy = this;
        }
        // hurt ability
        if (pet.hurt != null && damage > 0) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent,
                callbackPet: this,
                pet: pet 
            })
        }

        // knockout
        if (pet.health < 1 && this.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: this.knockOut.bind(this),
                priority: this.attack,
                callbackPet: pet,
                pet: this
            })
        }

        // friend hurt ability
        if (damage > 0) {
            this.abilityService.triggerFriendHurtEvents(pet.parent, pet);
        }

        // enemy hurt ability
        if (damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(this.parent, pet);
        }

    }

    increaseExp(amt) {
        let level = this.level;
        this.increaseAttack(amt);
        this.increaseHealth(amt);
        this.exp = Math.min(this.exp + amt, 5);
        if (this.level > level) {
            this.logService.createLog({
                message: `${this.name} leveled up to level ${this.level}.`,
                type: 'ability',
                player: this.parent
            });
            this.abilityService.triggerLevelUpEvents(this.parent, this);
            this.abilityService.triggerLevelUpEvents(this.parent.opponent, this);
            this.abilityService.executeFriendlyLevelUpToyEvents();
            this.setAbilityUses();
        }
        this.abilityService.triggerFriendGainedExperienceEvents(this.parent, this);
 
    }

    increaseMana(amt) {
        this.mana += amt;
        this.mana = Math.min(this.mana, 50);

        if (this.gainedMana != null) {
            this.abilityService.setGainManaEvents({
                callback: this.gainedMana.bind(this),
                priority: this.attack,
                pet: this
            });
        }
    }

    givePetEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
        if (equipment == null) {
            console.warn(`givePetEquipment called with null equipment for pet: ${this.name}`);
            return;
        }
        if (!this.alive) {
            return;
        }
        
        // Handle ailments with Ambrosia or White Okra blocking
        if (equipment.equipmentClass == 'ailment-attack' || equipment.equipmentClass == 'ailment-defense' || equipment.equipmentClass == 'ailment-other') {
            if (this.equipment instanceof Ambrosia) {
                this.equipment.uses--;
                this.logService.createLog({
                    message: `${this.name} blocked ${equipment.name}. (Ambrosia)`,
                    type: 'equipment',
                    player: this.parent
                });
                if (this.equipment.uses == 0) {
                    this.removePerk();
                }
                return;
            }
            if (this.equipment instanceof WhiteOkra) {
                this.logService.createLog({
                    message: `${this.name} blocked ${equipment.name}. (White Okra)`,
                    type: 'equipment',
                    player: this.parent
                });
                // Remove equipment immediately after blocking ailment
                this.removePerk();
                return;
            }
            this.applyEquipment(equipment, pandorasBoxLevel);

            this.abilityService.triggerFriendGainedAilmentEvents(this);
            this.abilityService.triggerEnemyGainedAilmentEvents(this.parent.opponent.petArray, this);
        } 
        // Handle standard equipment
        else {
            if (equipment instanceof Blackberry) {
                // Apply equipment first to get multiplier
                this.applyEquipment(equipment, pandorasBoxLevel);
             
                let attackGain = 1 * equipment.multiplier;
                let healthGain = 2 * equipment.multiplier;
                this.increaseAttack(attackGain);
                this.increaseHealth(healthGain); 
                this.logService.createLog({
                    message: `${this.name} gained ${attackGain} attack and ${healthGain} health (Blackberry)${equipment.multiplierMessage}`,
                    type: 'equipment',
                    player: this.parent,
                })
            } else{
                this.applyEquipment(equipment, pandorasBoxLevel);
            }
            
            this.abilityService.triggerGainedPerkEvents(this);
            this.abilityService.triggerFriendGainedPerkEvents(this);
            if (this.eatsFood) {
                this.abilityService.setEatsFoodEvent({
                    callback: this.eatsFood.bind(this),
                    priority: this.attack,
                    callbackPet: this,
                    pet: this
                })
            }
            this.abilityService.triggerFriendAteFoodEvents(this);    
        }
        

    }

    applyEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
        if (equipment == null) {
            return;
        }
        this.equipment = equipment;
        this.setEquipmentMultiplier(pandorasBoxLevel);
        if (this.equipment.callback && this.equipment.equipmentClass != 'beforeStartOfBattle') {
            this.equipment.callback(this);
        }
    }

    removePerk() {
        if (this.equipment == null) {
            return;
        }
        
        let wasAilment = this.equipment.equipmentClass == 'ailment-attack' || 
                         this.equipment.equipmentClass == 'ailment-defense' || 
                         this.equipment.equipmentClass == 'ailment-other';
        
        // Store the lost equipment before removing it
        this.lastLostEquipment = this.equipment;
        this.equipment = null;
        
        // Only trigger friendLostPerk events for perks, not ailments
        if (!wasAilment) {
            this.abilityService.triggerFriendLostPerkEvents(this);
        }
    }

    setEquipmentMultiplier(pandorasBoxLevel: number = 1) {
        if (!this.equipment) {
            return;
        }
        
        let multiplier = this.equipment?.multiplier || 1;
        let messages: string[] = [];
        
        // Panther multiplies equipment effects based on level
        if (this.name === 'Panther' &&
            this.equipment.equipmentClass !== 'ailment-attack' &&
            this.equipment.equipmentClass !== 'ailment-defense' &&
            this.equipment.equipmentClass !== 'ailment-other') {
            multiplier += this.level;
            messages.push(`x${this.level + 1} (Panther)`);
        }
        
        // Pandora's Box multiplies equipment effects based on toy level
        if (pandorasBoxLevel && pandorasBoxLevel > 1) {
            multiplier += pandorasBoxLevel - 1;
            messages.push(`x${pandorasBoxLevel} (Pandora's Box)`);
        }
        
        // Set the multiplier properties
        this.equipment.multiplier = multiplier;
        this.equipment.multiplierMessage = messages.length > 0 ? ` ${messages.join(' ')}` : '';
    }

    get level(): number {
        if (this.exp < 2) {
            return 1;
        }
        if (this.exp < 5) {
            return 2;
        }
        return 3;
    }

    get position(): number {
        if (this == this.parent.pet0) {
            return 0;
        }
        if (this == this.parent.pet1) {
            return 1;
        }
        if (this == this.parent.pet2) {
            return 2;
        }
        if (this == this.parent.pet3) {
            return 3;
        }
        if (this == this.parent.pet4) {
            return 4;
        }
    }

    /**
     * 
     * @param seenDead if true, consider pets that are not seenDead. if the pet is dead, but not seen(checked), return null.
     * @returns 
     */
    petBehind(seenDead = false, deadOrAlive = false): Pet {
        let currentPosition = this.position !== undefined ? this.position : this.savedPosition;
        for (let i = currentPosition + 1; i < 5; i++) {
            let pet = this.parent.getPetAtPosition(i);
            if (deadOrAlive) {
                if (pet != null) {
                    return pet;
                }
            }
            if (seenDead) {
                if (pet != null) {
                    if (!pet.alive && !pet.seenDead) {
                        return null;
                    }
                }
            }
            if (pet != null && pet.alive) {
                return pet;
            }
        }
        return null;
    }

    getManticoreMult(): number[] {
        let mult = [];
        for (let pet of this.parent.petArray) {
            // if (!pet.alive) {
            //     continue;
            // }
            if (pet.name == 'Manticore') {
                mult.push(pet.level);
            }
        }

        return mult;
    }

    getSparrowLevel(): number {
        let highestLevel = 0;
        for (let pet of this.parent.petArray) {
            if (pet.name == 'Sparrow') {
                highestLevel = Math.max(highestLevel, pet.level);
            }
        }
        return highestLevel;
    }


    getPetsAhead(amt: number, includeOpponent=false, excludeEquipment?: string): Pet[] {
        let targetsAhead = [];
        let petAhead = this.petAhead;
        while (petAhead) {
            if (targetsAhead.length >= amt) {
                break;
            }
            // Skip pets that already have the excluded equipment
            if (excludeEquipment && petAhead.equipment?.name === excludeEquipment) {
                petAhead = petAhead.petAhead;
                continue;
            }
            targetsAhead.push(petAhead);
            petAhead = petAhead.petAhead;
        }

        // get opponent pets
        if (targetsAhead.length < amt && includeOpponent == true) {
            let opponent = this.parent.opponent;
            let petAhead = opponent.furthestUpPet;
            while (petAhead) {
                if (targetsAhead.length >= amt) {
                    break;
                }
                // Skip pets that already have the excluded equipment
                if (excludeEquipment && petAhead.equipment?.name === excludeEquipment) {
                    petAhead = petAhead.petBehind();
                    continue;
                }
                targetsAhead.push(petAhead);
                petAhead = petAhead.petBehind();
            }
        }

        return targetsAhead;
    }

    getPetsBehind(amt: number, excludeEquipment?: string): Pet[] {
        let targetsBehind = [];
        let petBehind = this.petBehind();
        // Skip pets that already have the excluded equipment
        if (excludeEquipment && petBehind.equipment?.name === excludeEquipment) {
            petBehind = petBehind.petBehind();
        }
        while (petBehind) {
            if (targetsBehind.length >= amt) {
                break;
            }
            targetsBehind.push(petBehind);
            petBehind = petBehind.petBehind();
        }
        return targetsBehind;
    }

    kitsuneCheck(): boolean {
        let petBehind = this.petBehind();
        let first = true;
        while (petBehind) {
            if (petBehind.name == 'Kitsune' && first) {
                return false;
            }
            first = false;
            if (petBehind.name == 'Kitsune') {
                return true;
            }
            petBehind = petBehind.petBehind();
        }
        return false;
    }

    get petAhead(): Pet {
        for (let i = this.position - 1; i > -1; i--) {
            let pet = this.parent.getPetAtPosition(i);
            if (pet != null && pet.alive) {
                return pet;
            }
        }
        return null;
    }

    get minExpForLevel(): number {
        return this.level == 1 ? 0 : this.level == 2 ? 2 : 5;
    }
}