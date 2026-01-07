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
        this.timesAttacked++;
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
        } else {
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
            this.dealDamage(pet, damage);
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
            this.dealDamage(pet, damage);
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

            if (pet.equipment instanceof Icky) {
                message += 'x2 (Icky)';
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
            if (damageResp.ghostKittenReduction > 0) {
                message += ` -${damageResp.ghostKittenReduction} (Ghost Kitten)`;
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
                'Icky',
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
        this.abilityService.triggerAttacksEvents(this);
        this.applyCrisp();

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

        if (equipment && this.equipment) {
            message += ` (${this.equipment.name})`
        }

        if (mana) {
            message += ' (Mana)'
        }

        if (pet.equipment?.name == 'Icky') {
            message += 'x2 (Icky)';
            if (pet.equipment.multiplier > 1) {
                message += pet.equipment.multiplierMessage;
            }
        }

        let manticoreMult = this.getManticoreMult();
        let manticoreAilments = [
            'Weak',
            'Cold',
            'Icky',
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
        if (damageResp.ghostKittenReduction > 0) {
            message += ` -${damageResp.ghostKittenReduction} (Ghost Kitten)`
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

    calculateDamgae(pet: Pet, manticoreMult: number[], power?: number, snipe = false): {
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
            'Icky'
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
            }
            else if (this.equipment instanceof Guava) {
                // Create attack equipment for the one-time +5 damage
                attackEquipment = new GuavaAttack();
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
            const equipmentBonus = attackEquipment?.power ? attackEquipment.power : 0;
            attackAmt = baseAttack + equipmentBonus;
        }
        let defenseAmt = defenseEquipment?.power ? defenseEquipment.power : 0;

        // Check for Sparrow enhancement of Strawberries
        let sparrowLevel = pet.getSparrowLevel();
        if (pet.equipment?.name === 'Strawberry' && sparrowLevel > 0) {
            defenseAmt += sparrowLevel * 5;
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


        if (pet.equipment instanceof Icky) {
            let totalMultiplier = 2; // Base icky multiplier
            for (let mult of manticoreMult) {
                totalMultiplier += mult; // Add manticore multipliers
            }
            totalMultiplier += pet.equipment.multiplier - 1; // Add pandora's box multiplier
            attackAmt *= totalMultiplier;
        }
        let min = defenseEquipment?.equipmentClass == 'shield' || defenseEquipment?.equipmentClass == 'shield-snipe' ? 0 : 1;
        //check garlic
        if (defenseEquipment?.minimumDamage !== undefined) {
            min = defenseEquipment.minimumDamage;
        }

        let damage: number;
        if (attackAmt <= min && defenseAmt > 0) {
            damage = Math.max(attackAmt, 0);
        } else {
            damage = Math.max(min, attackAmt - defenseAmt);
        }

        if (defenseEquipment instanceof Pepper) {
            damage = Math.min(damage, pet.health - 1);
        }
        //TO DO: Might need to move all pet's less damage ability down here, or into Deal Damage
        //T) DO: Change from name check/trigger check to how many ability check
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
                    nurikabe = ability.level * 4;
                    damage = Math.max(0, damage - nurikabe);
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
        if (snipe && pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') && damage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'GhostKittenAbility') {
                    ghostKittenReduction += ability.level * 3;
                    damage = Math.max(0, damage - ghostKittenReduction);
                }
            }
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
            ghostKittenReduction: ghostKittenReduction,
        }
    }

    resetPet() {
        this.health = this.originalHealth;
        this.attack = this.originalAttack;
        this.equipment = this.originalEquipment;
        this.lastLostEquipment = null;
        this.mana = this.originalMana;
        this.triggersConsumed = this.originalTriggersConsumed;
        this.exp = this.originalExp;
        //clear memories
        this.timesHurt = this.originalTimesHurt;
        this.timesAttacked = 0;
        this.abilityCounter = 0;
        this.transformed = false;
        this.transformedInto = null;
        this.currentTarget = null;
        this.lastAttacker = null;
        this.killedBy = null;
        this.swallowedPets = [];
        this.targettedFriends.clear();
        this.savedPosition = this.originalSavedPosition;
        this.abilityList = [...this.originalAbilityList];
        this.initAbilityUses();
        //reset flags
        this.done = false;
        this.seenDead = false;
        this.removed = false;
        this.jumped = false;
        try {
            this.equipment?.reset();
        } catch (error) {
            console.warn('equipment reset failed', this.equipment)
            console.error(error)
            // window.alert("You found a rare bug! Please report this bug using the Report A Bug feature and say in this message that you found the rare bug. Thank you!")
        }
        if (this.equipment) {
            this.equipment.multiplier = 1;
            this.equipment.multiplierMessage = '';
        }
    }
    jumpAttackPrep(target: Pet) {
        // Trigger and execute before attack abilities on jumping pet and target
        this.abilityService.triggerBeforeAttackEvent(this);
        this.abilityService.triggerBeforeAttackEvent(target);
        this.abilityService.executeBeforeAttackEvents();
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
        // 6. Trigger and execute friend/enemy jumped abilities 
        attackPet.abilityService.triggerJumpEvents(attackPet);
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
        if (!pet.alive) {
            return;
        }
        if (damage >= pet.health && pet.equipment?.name == 'Bok Choy') {
            let healthGain = 3 * pet.equipment.multiplier;
            this.logService.createLog({
                message: `${pet.name} gained ${healthGain} health (Bok Choy) ${pet.equipment.multiplierMessage} `,
                type: 'equipment',
                player: pet.parent
            })
            pet.increaseHealth(healthGain)
            pet.removePerk();
        }
        let originalPetHealth = pet.health;
        pet.health -= damage;

        // Track who killed this pet
        if (pet.health <= 0) {
            pet.killedBy = this;
        }
        if (damage > 0) {
            pet.timesHurt++;
        }
        // knockout
        if (pet.health < 1) {
            this.abilityService.triggerKillEvents(this, pet);
        }

        // this hurt ability - new trigger system
        if (damage > 0) {
            this.abilityService.triggerHurtEvents(pet, damage);
        }
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
        return this.level == 1 ? 0 : this.level == 2 ? 2 : 5;
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
