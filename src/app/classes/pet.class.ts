import { GameAPI } from "../interfaces/gameAPI.interface";
import { LogService } from "../services/log.servicee";
import { Equipment } from "./equipment.class";
import { Player } from "./player.class";
import { Peanut } from "./equipment/turtle/peanut.class";
import { AbilityService } from "../services/ability.service";
import { Tiger } from "./pets/turtle/tier-6/tiger.class";
import { Wolverine } from "./pets/turtle/tier-6/wolverine.class";
import { Salt } from "./equipment/puppy/salt.class";
import { Panther } from "./pets/puppy/tier-5/panther.class";
import { getOpponent } from "../util/helper-functions";
import { Cheese } from "./equipment/star/cheese.class";
import { Pepper } from "./equipment/star/pepper.class";
import { FortuneCookie } from "./equipment/custom/fortune-cookie.class";
import { Dazed } from "./equipment/ailments/dazed.class";
import { Exposed } from "./equipment/ailments/exposed.class";
import { Crisp } from "./equipment/ailments/crisp.class";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { Nurikabe } from "./pets/custom/tier-5/nurikabe.class";

export type Pack = 'Turtle' | 'Puppy' | 'Star' | 'Golden' | 'Unicorn' | 'Custom';


export abstract class Pet {
    name: string;
    tier: number;
    pack: Pack;
    hidden: boolean = false;
    parent: Player;
    health: number;
    attack: number;
    mana: number = 0;
    maxAbilityUses: number = null;
    abilityUses: number = 0;
    equipment?: Equipment;
    originalHealth: number;
    originalAttack: number;
    originalMana: number;
    originalEquipment?: Equipment;
    originalSavedPosition?: 0 | 1 | 2 | 3 | 4;
    exp?: number = 0;
    originalExp?: number = 0;
    faintPet: boolean = false;
    startOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    transform?(gameApi: GameAPI, tiger?: boolean): void;
    // startOfTurn?: () => void;
    hurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    faint?(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void;
    friendSummoned?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    friendAheadAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendAheadFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedAilment?(gameApi: GameAPI, pet?: Pet): void;
    friendHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendAttacks?(gameApi: GameAPI, tiger?: boolean): void;
    afterAttack?(gameApi: GameAPI, tiger?: boolean): void;
    beforeAttack?(gameApi: GameAPI, tiger?: boolean): void;
    anyoneLevelUp?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    // NOTE: not all End Turn ability pets should have their ability defined. e.g Giraffe
    // example of pet that SHOULD be defined: Parrot.
    endTurn?(gameApi: GameAPI): void;
    knockOut?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    summoned?(gameApi: GameAPI, tiger?: boolean): void;
    friendlyToyBroke?(gameApi: GameAPI, tiger?: boolean): void;
    enemySummoned?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyPushed?(gameApi: GameAPI, tiger?: boolean): void;
    enemyHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    emptyFrontSpace?(gameApi: GameAPI, tiger?: boolean): void;

    // gameApi is not available currenly but can be added if needed.
    gainedMana?(gameApi: GameAPI, tiger?: boolean): void;
    friendJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    enemyGainedAilment?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainsHealth?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;

    // orignal methods -- used when overrwriting methods
    originalStartOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    originalTransform?(gameApi: GameAPI, tiger?: boolean): void;
    // originalStartOfTurn?: () => void;
    originalHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFaint?(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void;
    originalFriendSummoned?(gameApi: GameAPI, pet: Pet, tiger?: boolean): void;
    originalFriendAheadAttacks?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendAheadFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendFaints?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainedAilment?(gameApi: GameAPI, pet?: Pet): void;
    originalFriendHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendAttacks?(gameApi: GameAPI, tiger?: boolean): void;
    originalAfterAttack?(gameApi: GameAPI, tiger?: boolean): void;
    originalBeforeAttack?(gameApi: GameAPI, tiger?: boolean): void;
    originalAnyoneLevelUp?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    // NOTE: not all End Turn ability pets should have their ability defined. e.g Giraffe
    // example of pet that SHOULD be defined: Parrot.
    originalEndTurn?(gameApi: GameAPI): void;
    originalKnockOut?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalSummoned?(gameApi: GameAPI, tiger?: boolean): void;
    originalFriendlyToyBroke?(gameApi: GameAPI, tiger?: boolean): void;
    originalEnemySummoned?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyPushed?(gameApi: GameAPI, tiger?: boolean): void;
    originalEnemyHurt?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEmptyFrontSpace?(gameApi: GameAPI, tiger?: boolean): void;
    originalGainedMana?(gameApi: GameAPI, tiger?: boolean): void;
    originalFriendJumped?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalEnemyGainedAilment?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    originalFriendGainsHealth?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;

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


    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player) {
        this.parent = parent;
    }

    initPet(exp, health, attack, mana, equipment) {
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
        this.originalFriendAheadFaints = this.friendAheadFaints;
        this.originalFriendFaints = this.friendFaints;
        this.originalFriendGainedPerk = this.friendGainedPerk;
        this.originalFriendGainedAilment = this.friendGainedAilment;
        this.originalFriendHurt = this.friendHurt;
        this.originalFriendAttacks = this.friendAttacks;
        this.originalAfterAttack = this.afterAttack;
        this.originalBeforeAttack = this.beforeAttack;
        this.originalAnyoneLevelUp = this.anyoneLevelUp;
        this.originalEndTurn = this.endTurn;
        this.originalKnockOut = this.knockOut;
        this.originalSummoned = this.summoned;
        this.originalFriendlyToyBroke = this.friendlyToyBroke;
        this.originalEnemySummoned = this.enemySummoned;
        this.originalEnemyPushed = this.enemyPushed;
        this.originalEnemyHurt = this.enemyHurt;
        this.originalEmptyFrontSpace = this.emptyFrontSpace;
        this.originalGainedMana = this.gainedMana;
        this.originalFriendJumped = this.friendJumped;
        this.originalEnemyGainedAilment = this.enemyGainedAilment;
        this.originalFriendGainsHealth = this.friendGainsHealth;

        // set faint ability to handle mana ability
        let faintCallback = this.faint?.bind(this);
        if (faintCallback != null) {
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
            
            if (this.mana > 0) {
                
                let manaEvent: AbilityEvent;

                manaEvent = {
                    priority: this.attack,
                    player: this.parent,
                    callback: () => {
                        let target = getOpponent(gameApi, this.parent).getRandomPet([], false, true);
                        if (target == null) {
                            return;
                        }
                        if (this.mana == 0) {
                            return;
                        }
                        this.snipePet(target, this.mana, true, false, false, false, true);
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
            startOfBattleCallback(gameApi, tiger);
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
        this.friendAttacks = friendAttacksCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendAttacksCallback(gameApi, tiger);
        }

        let friendFaintsCallback = this.friendFaints?.bind(this);
        this.friendFaints = friendFaintsCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendFaintsCallback(gameApi, pet, tiger);
        }

        let friendGainedPerkCallback = this.friendGainedPerk?.bind(this);
        this.friendGainedPerk = friendGainedPerkCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendGainedPerkCallback(gameApi, pet, tiger);
        }

        let friendHurtCallback = this.friendHurt?.bind(this);
        this.friendHurt = friendHurtCallback == null ? null : (gameApi: GameAPI, pet?: Pet, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendHurtCallback(gameApi, pet, tiger);
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

        let friendlyToyBrokeCallback = this.friendlyToyBroke?.bind(this);
        this.friendlyToyBroke = friendlyToyBrokeCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            friendlyToyBrokeCallback(gameApi, tiger);
        }

        let enemyPushedCallback = this.enemyPushed?.bind(this);
        this.enemyPushed = enemyPushedCallback == null ? null : (gameApi: GameAPI, tiger?: boolean) => {
            if (!this.abilityValidCheck()) {
                return;
            }
            enemyPushedCallback(gameApi, tiger);
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
    
        
        this.setAbilityUses();
    }

    abilityValidCheck() {
        if (this.savedPosition == null) {
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
        if (this.petBehind() == null) {
            return false;
        }
        if (this.petBehind().name == 'Tiger' && (tiger == null || tiger == false)) {
            return true;
        }
    }

    protected superStartOfBattle(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.startOfBattle(gameApi,true)
        this.exp = exp;
    
    }

    protected superHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.hurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFaint(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.faint(gameApi, true)
        this.exp = exp;
    }

    protected superFriendSummoned(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendSummoned(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAheadAttacks(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendAheadAttacks(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAheadFaints(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendAheadFaints(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAfterAttack(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.afterAttack(gameApi, true)
        this.exp = exp;
    }

    protected superSummoned(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.summoned(gameApi, true)
        this.exp = exp;
    }

    protected superKnockOut(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.knockOut(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendFaints(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendFaints(gameApi, pet, true)
        this.exp = exp;
    }

    protected superBeforeAttack(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.beforeAttack(gameApi, true)
        this.exp = exp;
    }

    protected superFriendGainedPerk(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendGainedPerk(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendlyToyBroke(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendlyToyBroke(gameApi, true)
        this.exp = exp;
    }

    protected superTransform(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.transform(gameApi, true)
        this.exp = exp;
    }

    protected superEnemySummoned(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.enemySummoned(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendHurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superAnyoneLevelUp(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.anyoneLevelUp(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyHurt(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.enemyHurt(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendAttacks(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendAttacks(gameApi, true)
        this.exp = exp;
    }

    protected superGainedMana(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.gainedMana(gameApi, true)
        this.exp = exp;
    }

    protected superFriendJumped(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendJumped(gameApi, pet, true)
        this.exp = exp;
    }

    protected superEnemyGainedAilment(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.enemyGainedAilment(gameApi, pet, true)
        this.exp = exp;
    }

    protected superFriendGainsHealth(gameApi, pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendGainsHealth(gameApi, pet, true)
        this.exp = exp;
    }


    attackPet(pet: Pet) {

        let damageResp = this.calculateDamgae(pet, this.getManticoreMult());
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;
        let randomEvent = false;

        let attackMultiplier = 1;
        let defenseMultiplier = 1;
        if (this.name == 'Panther') {
            attackMultiplier = this.level + 1;
        }
        if (pet.name == 'Panther') {
            defenseMultiplier = pet.level + 1;
        }

        // peanut death
        if (attackEquipment instanceof Peanut && damage > 0) {
            this.logService.createLog({
                message: `${this.name} attacks ${pet.name} for ${pet.health} (Peanut)`,
                type: 'attack',
                player: this.parent
            })

            pet.health = 0;
        } else {
            pet.health -= damage;

            let message = `${this.name} attacks ${pet.name} for ${damage}.`;
            if (attackEquipment != null) {
                let power: any = Math.abs(attackEquipment.power);
                let sign = '-';
                if (attackEquipment.power > 0) {
                    sign = '+';
                }
                let powerAmt = `${sign}${power}`;
                if (attackEquipment instanceof Salt) {
                    if (pet.tier < this.tier) {
                        powerAmt = `x2`;
                    } else {
                        powerAmt = `x1`;
                    }
                }
                if (attackEquipment instanceof Cheese) {
                    powerAmt = `x2`;
                }
                if (attackEquipment instanceof FortuneCookie) {
                    randomEvent = true;
                    if (damageResp.fortuneCookie) {
                        powerAmt = `x2`;
                    } else {
                        powerAmt = `x1`;
                    }
                }
                
                message += ` (${attackEquipment.name} ${powerAmt})`;

                if (attackMultiplier > 1) {
                    message += ` x${attackMultiplier} (Panther)`;
                }
            }
            if (defenseEquipment != null) {
                let power: any = Math.abs(defenseEquipment.power);
                let sign = '-';
                if (defenseEquipment.power < 0) {
                    sign = '+';
                }
                if (defenseEquipment instanceof Pepper) {
                    if (pet.health == 1) {
                        sign = '!';
                    } else {
                        sign = '-';
                    }
                    power = '';
                }
                message += ` (${defenseEquipment.name} ${sign}${power})`;

                if (defenseMultiplier > 1) {
                    message += ` x${defenseMultiplier} (Panther)`;
                }

                pet.useDefenseEquipment();
            }
            
            if (pet.equipment instanceof Exposed) {
                message += 'x2 (Exposed)';
            }

            if (damageResp.nurikabe > 0) {
                message += ` -${damageResp.nurikabe} (Nurikabe)`;
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
                'Exposed'
            ]
            let hasAilment = manticoreAilments.includes(pet.equipment?.name);

            if (manticoreMult > 1 && hasAilment) {
                message += ` x${manticoreMult} (Manticore)`;
            }

            this.logService.createLog({
                message: message,
                type: "attack",
                player: this.parent,
                randomEvent: randomEvent
            });
    
            let skewerEquipment: Equipment = this.equipment?.equipmentClass == 'skewer' ? this.equipment : null;
            if (skewerEquipment != null) {
                skewerEquipment.attackCallback(this, pet);
            }
        }

        // friend attacks events
        this.abilityService.triggerFriendAttacksEvents(this.parent, this);

        // hurt ability
        if (pet.hurt != null && damage > 0) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent,
                callbackPet: this
            })
        }

        // after attack
        if (this.afterAttack != null) {
            this.abilityService.setAfterAttackEvent({
                callback: this.afterAttack.bind(this),
                priority: this.attack
            })
        }

        // knockout
        if (pet.health < 1 && this.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: this.knockOut.bind(this),
                priority: this.attack,
                callbackPet: pet
            })
        }

        // friend ahead attacks
        if (this.petBehind(null, true)?.friendAheadAttacks != null) {
            this.abilityService.setFriendAheadAttacksEvents({
                callback: this.petBehind(null, true).friendAheadAttacks.bind(this.petBehind(null, true)),
                priority: this.petBehind(null, true).attack,
                callbackPet: this
            });
        }

        // friend hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerFriendHurtEvents(pet.parent, pet);
        }

        // enemy hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(this.parent, pet);
        }

        this.applyCrisp();

    }

    applyCrisp() {
        for (let pet of this.parent.petArray) {
            if (pet.equipment instanceof Crisp) {
                let damage = 6;
                let nurikabe = 0;
                if (pet.name == 'Nurikabe' && pet.abilityUses < 3) {
                    nurikabe = pet.level * 4;
                    damage = Math.max(0, damage - nurikabe);
                }
                let message = `${pet.name} took ${damage} damage`;
                if (nurikabe > 0) {
                    message += ` -${nurikabe} (Nurikabe)`;
                }
                message += ` (Crisp).`;

                this.logService.createLog({
                    message: message,
                    type: 'ability',
                    player: pet.parent
                });
                pet.health -= 6;
                pet.givePetEquipment(null);
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
     * @param fig 
     * @param mana 
     * @returns damage amount
     */
    snipePet(pet: Pet, power: number, randomEvent?: boolean, tiger?: boolean, pteranodon?: boolean, fig?: boolean, mana?: boolean) {

        let wolverine = false;
        if (this.petAhead?.name == 'Wolverine') {
            power += this.petAhead.level * 3;
            wolverine = true;
        }
        if (this.petBehind()?.name == 'Wolverine') {
            power += this.petBehind().level * 3;
            wolverine = true;
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

        pet.health -= damage;

        let message = `${this.name} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment(true)
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            message += ` (${defenseEquipment.name} ${sign}${power})`;
        }
        if (attackEquipment != null && attackEquipment.equipmentClass == 'attack-snipe') {
            let power = Math.abs(attackEquipment.power);
            let sign = '-';
            if (attackEquipment.power > 0) {
                sign = '+';
            }
            message += ` (${attackEquipment.name} ${sign}${power})`;
        }

        if (tiger) {
            message += ' (Tiger)'
        }

        if (wolverine) {
            message += ' (Wolverine)'
        }

        if (fig) {
            message += ' (Fig)'
        }

        if (mana) {
            message += ' (Mana)'
        }

        if (ghostKitten) {
            message += ` -${ghostKittenMitigation} (Ghost Kitten)`;
        }

        if (pet.equipment?.name == 'Exposed') {
            message += 'x2 (Exposed)';
        }

        let manticoreMult = this.getManticoreMult();
        if (manticoreMult > 1) {
            message += ` x${manticoreMult} (Manticore)`;
        }

        if (damageResp.nurikabe > 0) {
            message += ` -${damageResp.nurikabe} (Nurikabe)`
        }

        this.logService.createLog({
            message: message,
            type: "attack",
            randomEvent: randomEvent,
            player: this.parent,
            pteranodon: pteranodon
        });
        
        // hurt ability
        if (pet.hurt != null && damage > 0) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent,
                callbackPet: this
            })
        }

        // knockout
        if (pet.health < 1 && this.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: this.knockOut.bind(this),
                priority: this.attack,
                callbackPet: pet
            })
        }

        // friend hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerFriendHurtEvents(pet.parent, pet);
        }

        // enemy hurt ability
        if (pet.alive && damage > 0) {
            this.abilityService.triggerEnemyHurtEvents(this.parent, pet);
        }

        return damage;
    }

    calculateDamgae(pet: Pet, manticoreMult: number, power?: number, snipe=false):
        {
            defenseEquipment: Equipment,
            attackEquipment: Equipment,
            damage: number,
            fortuneCookie: boolean,
            nurikabe: number
        } {
        let attackMultiplier = 1;
        let defenseMultiplier = 1;
        if (this.name == 'Panther') {
            attackMultiplier = this.level + 1;
        }
        if (pet.name == 'Panther') {
            defenseMultiplier = pet.level + 1;
        }

        const manticoreDefenseAilments = [
            'Cold',
            'Weak'
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
                defenseEquipment.power = defenseEquipment.originalPower * manticoreMult;
            } else {
                defenseEquipment.power = defenseEquipment.originalPower;
            }

        }


        let attackEquipment: Equipment;
        let attackAmt: number;
        // TODO snipe ability bug with ink?
        if (snipe) {
            attackEquipment = this.equipment?.equipmentClass == 'attack-snipe' ? this.equipment : null;
            attackAmt = attackEquipment != null ? power + attackEquipment.power : power;
        } else {
            attackEquipment = this.equipment?.equipmentClass == 'attack'
            || this.equipment?.equipmentClass == 'ailment-attack' ? this.equipment : null;

            if (attackEquipment != null) {
            
                if (manticoreAttackAilments.includes(attackEquipment?.name)) {
                    attackEquipment.power = attackEquipment.originalPower * manticoreMult;
                } else {
                    attackEquipment.power = attackEquipment.originalPower;
                }

            }

            let petAttack = this.attack;
            if (this.name == 'Monty') {
                petAttack *= 2;
            }

            attackAmt = power != null ? power + (
                attackEquipment?.power ? attackEquipment.power * attackMultiplier : 0
            ) : petAttack + (
                attackEquipment?.power ? attackEquipment.power * attackMultiplier : 0
            );
        }

        let defenseAmt = defenseEquipment?.power ? defenseEquipment.power * defenseMultiplier : 0;
        let min = defenseEquipment?.equipmentClass == 'shield' || defenseEquipment?.equipmentClass == 'shield-snipe' ? 0 : 1;

        let nurikabe = 0;
        if (pet.name == 'Nurikabe' && pet.abilityUses < 3) {
            nurikabe = pet.level * 4;
            defenseAmt += nurikabe;
            pet.abilityUses++;
        }

        console.log(nurikabe, defenseAmt)

        if (attackEquipment instanceof Salt && !snipe) {
            if (pet.tier < this.tier) {
                attackAmt *= (2 + attackMultiplier - 1);
            }
        }

        let fortuneCookie = false;
        if (attackEquipment instanceof FortuneCookie && !snipe) {
            // flip a coin
            if (Math.random() < 0.5) {
                attackAmt *= 2;
                fortuneCookie = true;
            }
        }

        if (attackEquipment instanceof Cheese && !snipe) {
            attackAmt *= (2 + attackMultiplier - 1);
        }

        if (pet.equipment instanceof Exposed) {
            attackAmt *= 2 * manticoreMult;
        }

        let damage = Math.max(min, attackAmt - defenseAmt);

        if (defenseEquipment instanceof Pepper) {
            damage = Math.min(damage, pet.health - 1);
        }
        
        return {
            defenseEquipment: defenseEquipment,
            attackEquipment: attackEquipment,
            damage: damage,
            fortuneCookie: fortuneCookie,
            nurikabe: nurikabe
        }
    } 

    resetPet() {
        this.health = this.originalHealth;
        this.attack = this.originalAttack;
        this.equipment = this.originalEquipment;
        this.mana = this.originalMana;
        this.exp = this.originalExp;
        this.done = false;
        this.seenDead = false;
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
    }

    get alive() {
        return this.health > 0;
    }
    

    setFaintEventIfPresent() {

        if (this.faint != null) {
            this.abilityService.setFaintEvent(
                {
                    priority: this.attack,
                    callback: this.faint.bind(this)
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
                    }
                }
            )
        }

    }

    useDefenseEquipment(snipe=false) {

        if (this.equipment == null) {
            return;
        }

        if (this.equipment.name == 'Exposed' || this.equipment.name == 'Cold') {
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
            this.equipment = null;
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
        ) {
            return;
        }
        if (isNaN(this.equipment.uses)) {
            console.warn('uses is NaN', this.equipment)
        }
        this.equipment.uses -= 1;
        if (this.equipment.uses == 0) {
            this.equipment = null;
        }
    }

    increaseAttack(amt) {
        let max = 50;
        if (this.name == 'Behemoth') {
            max = 100;
        }
        this.attack = Math.min(Math.max(this.attack + amt, 1), max);
    }

    increaseHealth(amt) {
        let max = 50;
        if (this.name == 'Behemoth') {
            max = 100;
        }
        this.health = Math.min(Math.max(this.health  + amt, 1), max);
        this.abilityService.triggerFriendGainsHealthEvents(this.parent, this);
        this.abilityService.executeFriendGainsHealthEvents();
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
            this.abilityService.executeLevelUpEvents();
            this.setAbilityUses();
        }

        
    }

    increaseMana(amt) {
        this.mana += amt;

        if (this.gainedMana) {
            this.gainedMana(null, false);
        }
    }

    givePetEquipment(equipment: Equipment) {
        this.equipment = equipment;

        if (equipment == null) {
            return;
        }
        
        if (equipment.equipmentClass == 'ailment-attack' || equipment.equipmentClass == 'ailment-defense' || equipment.equipmentClass == 'ailment-other') {
            this.abilityService.triggerFriendGainedAilmentEvents(this);
            this.abilityService.executeFriendGainedAilmentEvents();

            this.abilityService.triggerEnemyGainedAilmentEvents(this.parent.opponent.petArray, this);
            this.abilityService.executeEnemyGainedAilmentEvents();
        } else {
            this.abilityService.triggerFriendGainedPerkEvents(this);
            this.abilityService.executeFriendGainedPerkEvents();
        }

    }

    get level() {
        if (this.exp < 2) {
            return 1;
        }
        if (this.exp < 5) {
            return 2;
        }
        return 3;
    }

    get position() {
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
     * @param seenDead if true, consider pets that are not seenDead. if the pet is dead, but not seen, return null.
     * @returns 
     */
    petBehind(seenDead = false, deadOrAlive = false) {
        for (let i = this.position + 1; i < 5; i++) {
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

    getManticoreMult() {
        let mult = 1;
        for (let pet of this.parent.petArray) {
            if (!pet.alive) {
                continue;
            }
            if (pet.name == 'Manticore') {
                return pet.level + 1;
            }
        }

        return mult;
    }

    get petAhead() {
        for (let i = this.position - 1; i > -1; i--) {
            let pet = this.parent.getPetAtPosition(i);
            if (pet != null && pet.alive) {
                return pet;
            }
        }
        return null;
    }

    get minExpForLevel() {
        return this.level == 1 ? 0 : this.level == 2 ? 2 : 5;
    }
}