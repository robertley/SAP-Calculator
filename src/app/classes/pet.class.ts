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
import { Icky } from "./equipment/ailments/icky.class";
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
import { Ability, AbilityTrigger, AbilityType } from "./ability.class";
import { Guava, GuavaAttack } from "./equipment/custom/guava.class";
import { minExpForLevel } from "../util/leveling";
import {
    attackPet as attackPetImpl,
    calculateDamage as calculateDamageImpl,
    dealDamage as dealDamageImpl,
    jumpAttack as jumpAttackImpl,
    snipePet as snipePetImpl
} from "./pet/pet-combat";
import { resetPetState } from "./pet/pet-state";
import { Log } from "../interfaces/log.interface";

export type Pack = 'Turtle' | 'Puppy' | 'Star' | 'Golden' | 'Unicorn' | 'Custom' | 'Danger';


export abstract class Pet {
    name: string;
    tier: number;
    pack: Pack;
    hidden: boolean = false;
    parent: Player;
    health: number;
    attack: number;
    exp?: number = 0;
    equipment?: Equipment;
    mana: number = 0;
    triggersConsumed: number = 0;
    //memories
    swallowedPets?: Pet[] = [];
    abominationSwallowedPet1?: string;
    abominationSwallowedPet2?: string;
    abominationSwallowedPet3?: string;
    belugaSwallowedPet: string;
    timesHurt: number = 0;
    timesAttacked: number = 0;
    battlesFought: number = 0;
    currentTarget?: Pet; // Who this pet is currently attacking
    lastAttacker?: Pet; // Who last attacked this pet //TO DO: This might be useless
    killedBy?: Pet; // Who caused this pet to faint
    transformedInto: Pet | null = null;
    lastLostEquipment?: Equipment;
    abilityCounter: number = 0;
    targettedFriends: Set<Pet> = new Set();

    originalHealth: number;
    originalAttack: number;
    originalMana: number;
    originalTriggersConsumed: number;
    originalEquipment?: Equipment;
    originalExp?: number = 0;
    originalTimesHurt: number = 0;

    //flags
    faintPet: boolean = false;
    toyPet = false;
    transformed: boolean = false;
    removed: boolean = false;
    startOfBattleTriggered: boolean = false;
    jumped: boolean = false;
    // flags to make sure events/logs are not triggered multiple times
    done = false;
    seenDead = false;
    // fixes bug where eggplant ability is triggered multiple times
    // if we already set eggplant ability make sure not to set it again
    eggplantTouched = false;
    cherryTouched = false;
    //ability memory
    maxAbilityUses: number = null;

    // New ability system
    abilityList: Ability[] = [];
    originalAbilityList: Ability[] = [];

    savedPosition: 0 | 1 | 2 | 3 | 4;
    originalSavedPosition?: 0 | 1 | 2 | 3 | 4;

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player) {
        this.parent = parent;
    }

    initPet(exp: number, health: number, attack: number, mana: number, equipment: Equipment, triggersConsumed?: number) {
        this.exp = exp ?? this.exp;
        this.health = health ?? this.health * this.level;
        this.attack = attack ?? this.attack * this.level;
        this.mana = mana ?? this.mana;
        this.triggersConsumed = triggersConsumed ?? this.triggersConsumed;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.originalMana = this.mana;
        this.originalTriggersConsumed = this.triggersConsumed;
        this.equipment = equipment;
        this.originalEquipment = equipment;
        this.originalExp = this.exp;

        this.initAbilities();

        // Save complete ability list after full initialization (pet + equipment abilities)
        this.originalAbilityList = [...this.abilityList];
    }

    initAbilities() {
        this.initAbilityUses();
        this.setAbilityEquipments();
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

    resetAbilityUses() {
        // Set initialCurrentUses to 0 for level-up refresh, then reset
        this.abilityList.forEach(ability => {
            ability.reset();
        });
    }
    initAbilityUses() {
        // Reset usage counters for new ability system
        // Set initialCurrentUses to 0 for level-up refresh, then reset
        this.abilityList.forEach(ability => {
            ability.initUses();
        });
    }


    attackPet(pet: Pet, jumpAttack: boolean = false, power?: number, random: boolean = false) {
        attackPetImpl(this, pet, jumpAttack, power, random);
    }

    applyCrisp() {
        let manticoreMult = this.parent.opponent.getManticoreMult();
        for (let pet of this.parent.petArray) {
            if (pet.equipment instanceof Crisp) {
                let damage = 6;
                let totalMultiplier = pet.equipment.multiplier;
                for (let mult of manticoreMult) {
                    totalMultiplier += mult;
                }
                damage *= totalMultiplier;
                let fairyBallReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'FairyAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'FairyAbility') {
                            fairyBallReduction += ability.level * 2;
                            damage = Math.max(0, damage - ability.level * 2);
                        }
                    }
                }
                let nurikabe = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'NurikabeAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'NurikabeAbility') {
                            nurikabe += ability.level * 4;
                            damage = Math.max(0, damage - ability.level * 4);
                            ability.currentUses++;
                        }
                    }
                }
                let fanMusselReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'FanMusselAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'FanMusselAbility') {
                            fanMusselReduction += ability.level * 1;
                            damage = Math.max(0, damage - fanMusselReduction);
                            ability.currentUses++;
                        }
                    }
                }
                let ghostKittenReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'GhostKittenAbility') {
                            ghostKittenReduction += ability.level * 3;
                            damage = Math.max(0, damage - ghostKittenReduction);
                        }
                    }
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
                if (fairyBallReduction > 0) {
                    message += `-${fairyBallReduction} (FairyBall)`
                }
                if (nurikabe > 0) {
                    message += ` -${nurikabe} (Nurikabe)`;
                }
                if (fanMusselReduction > 0) {
                    message += ` -${fanMusselReduction} (Fan Mussel)`;
                }
                if (ghostKittenReduction > 0) {
                    message += ` -${ghostKittenReduction} (Ghost Kitten)`;
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
                let fairyBallReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'FairyAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'FairyAbility') {
                            fairyBallReduction += ability.level * 2;
                            damage = Math.max(0, damage - ability.level * 2);
                        }
                    }
                }
                let nurikabe = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'NurikabeAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'NurikabeAbility') {
                            nurikabe += ability.level * 4;
                            damage = Math.max(0, damage - ability.level * 4);
                            ability.currentUses++;
                        }
                    }
                }
                let fanMusselReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'FanMusselAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'FanMusselAbility') {
                            fanMusselReduction += ability.level * 1;
                            damage = Math.max(0, damage - fanMusselReduction);
                            ability.currentUses++;
                        }
                    }
                }
                let ghostKittenReduction = 0;
                if (pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') && damage > 0) {
                    for (let ability of pet.abilityList) {
                        if (ability.name == 'GhostKittenAbility') {
                            ghostKittenReduction += ability.level * 3;
                            damage = Math.max(0, damage - ghostKittenReduction);
                        }
                    }
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
                if (fairyBallReduction > 0) {
                    message += `-${fairyBallReduction} (FairyBall)`
                }
                if (nurikabe > 0) {
                    message += ` -${nurikabe} (Nurikabe)`;
                }
                if (fanMusselReduction > 0) {
                    message += ` -${fanMusselReduction} (Fan Mussel)`;
                }
                if (ghostKittenReduction > 0) {
                    message += ` -${ghostKittenReduction} (Ghost Kitten)`;
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
        return snipePetImpl(this, pet, power, randomEvent, tiger, pteranodon, equipment, mana);
    }

    calculateDamage(pet: Pet, manticoreMult: number[], power?: number, snipe = false): {
        defenseEquipment: Equipment,
        attackEquipment: Equipment,
        damage: number,
        fortuneCookie: boolean,
        nurikabe: number,
        fairyBallReduction?: number,
        fanMusselReduction?: number,
        mapleSyrupReduction?: number,
        ghostKittenReduction?: number,
    } {
        return calculateDamageImpl(this, pet, manticoreMult, power, snipe);
    }

    resetPet() {
        resetPetState(this);
    }
    jumpAttackPrep(target: Pet) {
        // Trigger and execute before attack abilities on jumping pet and target
        this.abilityService.triggerBeforeAttackEvent(this);
        this.abilityService.triggerBeforeAttackEvent(target);
        this.abilityService.executeBeforeAttackEvents();
    }
    // Jump attack method for abilities that attack and then advance turn
    jumpAttack(target: Pet, tiger?: boolean, damage?: number, randomEvent: boolean = false) {
        jumpAttackImpl(this, target, tiger, damage, randomEvent);
    }

    get alive(): boolean {
        return this.health > 0;
    }


    setFaintEventIfPresent() {
        this.abilityService.triggerFaintEvents(this);
        // Add manaSnipe handling with all original logic
        if (this.mana > 0) {
            this.abilityService.setManaEvent({
                priority: this.attack,
                callback: (trigger, abilityTrigger, gameApi: GameAPI, triggerPet?: Pet) => {
                    if (this.mana == 0) {
                        return
                    }
                    if (this.kitsuneCheck()) {
                        return;
                    }
                    // Get target using proper opponent logic
                    const opponent = this.parent.opponent;
                    const targetResp = opponent.getRandomPet([], false, true, false, this);

                    if (targetResp.pet == null) {
                        return;
                    }
                    // Execute snipe with all original parameters
                    this.snipePet(targetResp.pet, this.mana, targetResp.random, false, false, false, true);
                    this.mana = 0;
                },
                pet: this,
                triggerPet: this,
                tieBreaker: Math.random()
            });
        }
    }

    useDefenseEquipment(snipe = false) {
        if (this.equipment == null) {
            return;
        }

        if (this.equipment.equipmentClass == 'ailment-defense' || this.equipment.name == 'Icky') {
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
            && this.equipment.name != 'Icky'
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

        this.abilityService.triggerFriendGainsHealthEvents(this);
    }

    dealDamage(pet: Pet, damage: number) {
        dealDamageImpl(this, pet, damage);
    }

    triggerHurtEventsFor(pet: Pet, damage: number): void {
        this.abilityService.triggerHurtEvents(pet, damage);
    }

    triggerKillEventsFor(pet: Pet): void {
        this.abilityService.triggerKillEvents(this, pet);
    }

    triggerAttackEventsFor(): void {
        this.abilityService.triggerAttacksEvents(this);
    }

    executeAfterAttackEvents(): void {
        this.abilityService.executeAfterAttackEvents();
    }

    triggerJumpEventsFor(): void {
        this.abilityService.triggerJumpEvents(this);
    }

    createLog(entry: Log): void {
        this.logService.createLog(entry);
    }

    increaseExp(amt) {
        let level = this.level;
        this.increaseAttack(amt);
        this.increaseHealth(amt);
        this.exp = Math.min(this.exp + amt, 5);
        let timesLevelled = this.level - level;
        for (let i = 0; i < timesLevelled; i++) {
            this.logService.createLog({
                message: `${this.name} leveled up to level ${this.level}.`,
                type: 'ability',
                player: this.parent
            });
            this.abilityService.triggerLevelUpEvents(this);
            //TO DO: THis needs change
            this.abilityService.executeFriendlyLevelUpToyEvents();
            this.resetAbilityUses();
        }
        for (let i = 0; i < Math.min(amt, 5); i++) {
            this.abilityService.triggerFriendGainedExperienceEvents(this);
        }
    }

    increaseMana(amt) {
        this.mana += amt;
        this.mana = Math.min(this.mana, 50);
        this.abilityService.triggerManaGainedEvents(this);
    }

    givePetEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
        if (equipment == null) {
            console.warn(`givePetEquipment called with null equipment for pet: ${this.name}`);
            return;
        }
        if (!this.alive) {
            return;
        }

        if (equipment.name === 'Corncob') {
            if (this.attack <= this.health) {
                this.increaseAttack(1);
            } else {
                this.increaseHealth(1);
            }
            this.abilityService.triggerFoodEvents(this, 'corn');
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
            else if (this.equipment instanceof WhiteOkra) {
                this.logService.createLog({
                    message: `${this.name} blocked ${equipment.name}. (White Okra)`,
                    type: 'equipment',
                    player: this.parent
                });
                // Remove equipment immediately after blocking ailment
                this.removePerk();
                return;
            }
            else if (this.equipment != null) {
                this.removePerk(true);
            }
            this.applyEquipment(equipment, pandorasBoxLevel);

            this.abilityService.triggerAilmentGainEvents(this, equipment.name);
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
            } else {
                this.applyEquipment(equipment, pandorasBoxLevel);
            }

            this.abilityService.triggerPerkGainEvents(this, equipment.name);
            this.abilityService.triggerFoodEvents(this, equipment.name)
        }


    }

    applyEquipment(equipment: Equipment, pandorasBoxLevel: number = 1) {
        if (equipment == null) {
            return;
        }
        this.equipment = equipment;
        this.setEquipmentMultiplier(pandorasBoxLevel);
        this.removeAbility(undefined, 'Equipment');
        if (this.equipment.callback) {
            this.equipment.callback(this);
        }
    }

    removePerk(perkOnly: boolean = false) {
        if (this.equipment == null) {
            return;
        }

        let wasAilment = this.equipment.equipmentClass == 'ailment-attack' ||
            this.equipment.equipmentClass == 'ailment-defense' ||
            this.equipment.equipmentClass == 'ailment-other';

        if (perkOnly && wasAilment) {
            return;
        }
        // Store the lost equipment before removing it
        this.lastLostEquipment = this.equipment;

        // Remove equipment-based abilities from new system
        this.removeAbility(undefined, 'Equipment');

        this.equipment = null;

        // Only trigger friendLostPerk events for perks, not ailments
        if (!wasAilment) {
            this.abilityService.triggerPerkLossEvents(this, this.lastLostEquipment?.name);
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


    getPetsAhead(amt: number, includeOpponent = false, excludeEquipment?: string): Pet[] {
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
        if (excludeEquipment && petBehind && petBehind.equipment?.name === excludeEquipment) {
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
        return minExpForLevel(this.level);
    }
    //need to set when gave perk too
    setAbilityEquipments() {
        if (this.equipment?.name == 'Eggplant') {
            this.equipment.callback(this);
            this.eggplantTouched = true;
        } else if (this.equipment?.callback) {
            this.equipment.callback(this);
        }
    }

    // New Ability System Methods

    addAbility(ability: Ability): void {
        this.abilityList.push(ability);
    }

    removeAbility(abilityName?: string, abilityType?: AbilityType): boolean {
        const initialLength = this.abilityList.length;

        this.abilityList = this.abilityList.filter(ability => {
            if (abilityName && ability.name === abilityName) return false;
            if (abilityType && ability.abilityType === abilityType) return false;
            if (!abilityName && !abilityType) return false; // Remove all if no criteria
            return true;
        });

        return this.abilityList.length < initialLength;
    }

    getAbilities(trigger?: AbilityTrigger, abilityType?: AbilityType): Ability[] {
        return this.abilityList.filter(ability => {
            if (trigger && !ability.matchesTrigger(trigger)) return false;
            if (abilityType && ability.abilityType !== abilityType) return false;
            return true;
        });
    }
    getAbilitiesWithTrigger(trigger?: AbilityTrigger, abilityType?: AbilityType, abilityName?: string): Ability[] {
        return this.abilityList.filter(ability => {
            if (trigger && !ability.matchesTrigger(trigger) || !ability.canUse()) return false;
            if (abilityType && ability.abilityType !== abilityType) return false;
            if (abilityName && ability.name !== abilityName) return false;
            return true;
        });
    }
    executeAbilities(trigger: AbilityTrigger, gameApi: GameAPI, triggerPet?: Pet, tiger?: boolean, pteranodon?: boolean, customParams?: any): void {
        // If this pet has already transformed before this trigger fires, re-run the trigger on the current form
        if (this.transformed && this.transformedInto) {
            this.transformedInto.executeAbilities(trigger, gameApi, triggerPet, tiger, pteranodon, customParams);
            return;
        }

        const matchingPetAbilities = this.getAbilitiesWithTrigger(trigger, 'Pet');
        for (const ability of matchingPetAbilities) {
            ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
            // If this ability caused a transform, stop executing further abilities on the old form and re-run the trigger once on the new form
            if (this.transformed && this.transformedInto) {
                this.transformedInto.executeAbilities(trigger, gameApi, triggerPet, tiger, pteranodon, customParams);
                return;
            }
        }

        const matchingEquipmentAbilities = this.getAbilitiesWithTrigger(trigger, 'Equipment');
        for (const ability of matchingEquipmentAbilities) {
            ability.execute(gameApi, triggerPet, tiger, pteranodon, customParams);
            if (this.transformed && this.transformedInto) {
                this.transformedInto.executeAbilities(trigger, gameApi, triggerPet, tiger, pteranodon, customParams);
                return;
            }
        }
    }
    activateAbilities(trigger: AbilityTrigger, gameApi: GameAPI, type: AbilityType, triggerPet?: Pet, customParams?: any): void {
        const matchingAbilities = this.getAbilities(trigger, type);

        // Execute abilities in order (maintains ability list order within pet)
        for (const ability of matchingAbilities) {
            ability.execute(gameApi, triggerPet, undefined, undefined, customParams);
        }
    }

    copyAbilities(sourcePet: Pet, abilityType?: AbilityType, level?: number): void {
        const abilitiesToCopy = sourcePet.getAbilities(undefined, abilityType);
        this.removeAbility(undefined, abilityType);
        for (const ability of abilitiesToCopy) {
            const copiedAbility = ability.copy(this);
            if (copiedAbility == null) {
                continue;
            }
            if (level) {
                copiedAbility.abilityLevel = level;
                copiedAbility.alwaysIgnorePetLevel = true;
                copiedAbility.reset();
            }
            ability.native = false;
            this.addAbility(copiedAbility);
        }

    }
    gainAbilities(sourcePet: Pet, abilityType?: AbilityType, level?: number): void {
        const abilitiesToCopy = sourcePet.getAbilities(undefined, abilityType);
        for (const ability of abilitiesToCopy) {
            const copiedAbility = ability.copy(this);
            if (copiedAbility == null) {
                continue;
            }
            if (level) {
                copiedAbility.abilityLevel = level;
                copiedAbility.alwaysIgnorePetLevel = true;
                copiedAbility.reset();
            }
            ability.native = false;
            this.addAbility(copiedAbility);
        }
    }

    hasAbility(trigger: AbilityTrigger, abilityType?: AbilityType): boolean {
        return this.getAbilities(trigger, abilityType).length > 0;
    }

    hasTrigger(trigger: AbilityTrigger, abilityType?: AbilityType, abilityName?: string): boolean {
        return this.getAbilitiesWithTrigger(trigger, abilityType, abilityName).length > 0;
    }

    isSellPet(): boolean {
        let sellPets = [
            'Beaver', 'Duck', 'Pig', 'Pillbug', 'Kiwi', 'Mouse', 'Frog', 'Bass', 'Tooth Billed Pigeon', 'Marmoset', 'Capybara', 'Platypus'
        ];
        if (sellPets.includes(this.name) || this.originalAbilityList.filter(ability => {
            return ability.matchesTrigger('ThisSold') && ability.abilityType == 'Pet';
        }).length > 0) {
            return true;
        }
        return false;
    }
    isFaintPet(): boolean {

        if (this.originalAbilityList.filter(ability => {
            return (ability.matchesTrigger('ThisDied') || ability.matchesTrigger('BeforeThisDies') || ability.matchesTrigger('ThisKilled')) && ability.abilityType == 'Pet';
        }).length > 0) {
            return true;
        }
        return false;
    }
}
