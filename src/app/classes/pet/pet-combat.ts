import type { Pet } from "../pet.class";
import { Equipment } from "../equipment.class";
import { Peanut } from "../equipment/turtle/peanut.class";
import { PeanutButter } from "../equipment/hidden/peanut-butter";
import { WhiteTruffle } from "../equipment/danger/white-truffle.class";
import { Salt } from "../equipment/puppy/salt.class";
import { MapleSyrup, MapleSyrupAttack } from "../equipment/golden/maple-syrup.class";
import { Cheese } from "../equipment/star/cheese.class";
import { FortuneCookie } from "../equipment/custom/fortune-cookie.class";
import { Pepper } from "../equipment/star/pepper.class";
import { Icky } from "../equipment/ailments/icky.class";
import { Sleepy } from "../equipment/ailments/sleepy.class";
import { HoneydewMelon, HoneydewMelonAttack } from "../equipment/golden/honeydew-melon.class";
import { Guava, GuavaAttack } from "../equipment/custom/guava.class";

export function attackPet(self: Pet, pet: Pet, jumpAttack: boolean = false, power?: number, random: boolean = false): void {
    self.timesAttacked++;
    let damageResp = calculateDamage(self, pet, self.getManticoreMult(), power);
    let attackEquipment = damageResp.attackEquipment;
    let defenseEquipment = damageResp.defenseEquipment;
    let damage = damageResp.damage;
    const usedSleepy = self.equipment instanceof Sleepy;
    if (usedSleepy) {
        damage = Math.floor(damage / 2);
    }

    let attackMultiplier = self.equipment?.multiplier;
    let defenseMultiplier = pet.equipment?.multiplier;
    self.currentTarget = pet;
    let message: string;
    if (jumpAttack) {
        message = `${self.name} jump-attacks ${pet.name} for ${damage}.`;
        if (self.equipment instanceof WhiteTruffle) {
            message += `(White Truffle)`
        }
    } else {
        message = `${self.name} attacks ${pet.name} for ${damage}.`;
    }
    if (usedSleepy) {
        message += ' (Sleepy x0.5)';
    }
    // peanut death
    if (attackEquipment instanceof Peanut && damage > 0) {
        self.createLog({
            message: `${message} (Peanut)`,
            type: 'attack',
            player: self.parent,
            sourcePet: self,
            targetPet: pet,
            randomEvent: random
        })
        dealDamage(self, pet, damage);
        pet.killedBy = self;
        pet.health = 0;
    } else if (attackEquipment instanceof PeanutButter && damage > 0 && attackEquipment.uses > 0) {
        self.createLog({
            message: `${message} (Peanut Butter)`,
            type: 'attack',
            player: self.parent,
            sourcePet: self,
            targetPet: pet,
            randomEvent: random
        })

        pet.killedBy = self;
        dealDamage(self, pet, damage);
        pet.health = 0;
    } else {
        dealDamage(self, pet, damage);
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
                message += self.equipment.multiplierMessage;
            }
        }
        if (defenseEquipment != null) {
            let power: any = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            if (defenseEquipment.name === 'Coconut') {
                message += ` (${defenseEquipment.name} block)`;
            } else if (defenseEquipment.name === 'Strawberry') {
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

        let manticoreMult = self.getManticoreMult();
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

        self.createLog({
            message: message,
            type: "attack",
            player: self.parent,
            sourcePet: self,
            targetPet: pet,
            randomEvent: random
        });
        let skewerEquipment: Equipment = self.equipment?.equipmentClass == 'skewer' ? self.equipment : null;
        if (skewerEquipment != null) {
            skewerEquipment.attackCallback(self, pet);
        }
    }

    if (usedSleepy) {
        self.removePerk();
    }

    // unified friend attack events (includes friendAttacks, friendAheadAttacks, and enemyAttacks)
    self.triggerAttackEventsFor();
    self.applyCrisp();
    const opponentPet = self.parent.opponent?.petArray?.[0];
    if (opponentPet) {
        opponentPet.applyCrisp();
    }
}

export function snipePet(
    self: Pet,
    pet: Pet,
    power: number,
    randomEvent?: boolean,
    tiger?: boolean,
    pteranodon?: boolean,
    equipment?: boolean,
    mana?: boolean
): number {
    let albatross = false;
    if (self.petAhead?.name == 'Albatross' && pet.tier <= 4) {
        power += self.petAhead.level * 3;
        albatross = true;
    }
    if (self.petBehind()?.name == 'Albatross' && pet.tier <= 4) {
        power += self.petBehind().level * 3;
        albatross = true;
    }

    let damageResp = calculateDamage(self, pet, self.getManticoreMult(), power, true);
    let attackEquipment = damageResp.attackEquipment;
    let defenseEquipment = damageResp.defenseEquipment;
    let damage = damageResp.damage;
    if (self.equipment?.name === 'Kiwano' && damage > 0) {
        damage = 10;
        self.createLog({
            message: `${self.name} set damage to 10. (Kiwano)`,
            type: 'equipment',
            player: self.parent
        });
        self.removePerk();
    }

    dealDamage(self, pet, damage);

    let message = `${self.name} sniped ${pet.name} for ${damage}.`;
    if (defenseEquipment != null) {
        pet.useDefenseEquipment(true)
        let power = Math.abs(defenseEquipment.power);
        let sign = '-';
        if (defenseEquipment.power < 0) {
            sign = '+';
        }
        if (defenseEquipment.name === 'Coconut') {
            message += ` (${defenseEquipment.name} block)`;
        } else if (defenseEquipment.name === 'Strawberry') {
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
    if (self.equipment?.multiplier > 1) {
        message += self.equipment.multiplierMessage;
    }

    if (tiger) {
        message += ' (Tiger)'
    }

    if (albatross) {
        message += ' (Albatross)'
    }

    if (equipment && self.equipment) {
        message += ` (${self.equipment.name})`
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

    let manticoreMult = self.getManticoreMult();
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

    self.createLog({
        message: message,
        type: "attack",
        randomEvent: randomEvent,
        player: self.parent,
        sourcePet: self,
        targetPet: pet,
        pteranodon: pteranodon
    });

    if (attackEquipment != null && attackEquipment.equipmentClass == 'attack-snipe' && self.equipment?.uses != null) {
        self.equipment.uses -= 1;
        if (self.equipment.uses <= 0) {
            self.removePerk();
        }
    }

    return damage;
}

export function calculateDamage(
    self: Pet,
    pet: Pet,
    manticoreMult: number[],
    power?: number,
    snipe = false
): {
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
    let attackMultiplier = self.equipment?.multiplier;
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
        if (defenseEquipment.name === 'Strawberry') {
            const sparrowLevel = pet.getSparrowLevel();
            if (sparrowLevel <= 0 || (defenseEquipment.uses != null && defenseEquipment.uses <= 0)) {
                defenseEquipment = null;
            } else {
                defenseEquipment.power = sparrowLevel * 5;
            }
        } else {
            if (manticoreDefenseAilments.includes(defenseEquipment?.name)) {
                for (let mult of manticoreMult) {
                    defenseMultiplier += mult;
                }
            }
            defenseEquipment.power = defenseEquipment.originalPower * defenseMultiplier;
        }
    }


    let attackEquipment: Equipment;
    let attackAmt: number;
    if (snipe) {
        attackEquipment = self.equipment?.equipmentClass == 'attack-snipe' ? self.equipment : null;
        attackAmt = attackEquipment != null ? power + attackEquipment.power : power;
        if (defenseEquipment instanceof MapleSyrup) {
            defenseEquipment = null;
        }
    } else {
        if (self.equipment instanceof HoneydewMelon) {
            // Create attack equipment for the one-time +5 damage
            attackEquipment = new HoneydewMelonAttack();
        } else if (self.equipment instanceof MapleSyrup) {
            // Create attack equipment for the one-time 50% damage reduction
            attackEquipment = new MapleSyrupAttack();
        }
        else if (self.equipment instanceof Guava) {
            // Create attack equipment for the one-time +5 damage
            attackEquipment = new GuavaAttack();
        } else {
            attackEquipment = self.equipment?.equipmentClass == 'attack'
                || self.equipment?.equipmentClass == 'ailment-attack' ? self.equipment : null;
        }
        if (attackEquipment != null) {

            if (manticoreAttackAilments.includes(attackEquipment?.name)) {
                for (let mult of manticoreMult) {
                    attackMultiplier += mult;
                }
            }
            attackEquipment.power = attackEquipment.originalPower * attackMultiplier;

        }

        let petAttack = self.attack;
        if (self.name == 'Monty') {
            petAttack *= self.level + 1;
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

    if (self.equipment?.name === 'Inked' && damage > 0) {
        damage = Math.max(0, damage - 3);
    }
    if (defenseEquipment instanceof Pepper) {
        damage = Math.min(damage, pet.health - 1);
    }
    // Centralized damage reductions to avoid ordering bugs.
    const applyDamageModifiers = (startingDamage: number) => {
        let workingDamage = startingDamage;
        let fairyBallReduction = 0;
        let nurikabe = 0;
        let fanMusselReduction = 0;
        let ghostKittenReduction = 0;

        if (pet.hasTrigger(undefined, 'Pet', 'FairyAbility')) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'FairyAbility') {
                    const reduction = ability.level * 2;
                    fairyBallReduction += reduction;
                    workingDamage = Math.max(0, workingDamage - reduction);
                }
            }
            if (workingDamage < 1) {
                workingDamage = 1;
            }
        }

        if (pet.hasTrigger(undefined, 'Pet', 'NurikabeAbility') && workingDamage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'NurikabeAbility') {
                    nurikabe = ability.level * 4;
                    workingDamage = Math.max(0, workingDamage - nurikabe);
                    ability.currentUses++;
                }
            }
        }

        if (pet.hasTrigger(undefined, 'Pet', 'FanMusselAbility') && workingDamage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'FanMusselAbility') {
                    const reduction = ability.level * 1;
                    fanMusselReduction += reduction;
                    workingDamage = Math.max(0, workingDamage - reduction);
                    ability.currentUses++;
                }
            }
        }

        if (snipe && pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') && workingDamage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'GhostKittenAbility') {
                    const reduction = ability.level * 3;
                    ghostKittenReduction += reduction;
                    workingDamage = Math.max(0, workingDamage - reduction);
                }
            }
        }

        return {
            damage: workingDamage,
            fairyBallReduction,
            nurikabe,
            fanMusselReduction,
            ghostKittenReduction
        };
    };

    const reductionResult = applyDamageModifiers(damage);
    damage = reductionResult.damage;
    const fairyBallReduction = reductionResult.fairyBallReduction;
    const nurikabe = reductionResult.nurikabe;
    const fanMusselReduction = reductionResult.fanMusselReduction;
    const ghostKittenReduction = reductionResult.ghostKittenReduction;

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

export function jumpAttack(
    self: Pet,
    target: Pet,
    tiger?: boolean,
    damage?: number,
    randomEvent: boolean = false
): void {
    // Set current target for tracking
    target.lastAttacker = self;

    let attackPet: Pet;
    if (self.transformed) {
        attackPet = self.transformedInto
    } else {
        attackPet = self;
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

    attackPet.executeAfterAttackEvents();
    // 6. Trigger and execute friend/enemy jumped abilities 
    attackPet.triggerJumpEventsFor();
}

export function dealDamage(self: Pet, pet: Pet, damage: number): void {
    if (!pet.alive) {
        return;
    }
    if (damage >= pet.health && pet.equipment?.name == 'Bok Choy') {
        let healthGain = 4 * pet.equipment.multiplier;
        self.createLog({
            message: `${pet.name} gained ${healthGain} health (Bok Choy) ${pet.equipment.multiplierMessage} `,
            type: 'equipment',
            player: pet.parent
        })
        pet.increaseHealth(healthGain)
        pet.removePerk();
    }
    pet.health -= damage;

    // Track who killed this pet
    if (pet.health <= 0) {
        pet.killedBy = self;
    }
    if (damage > 0) {
        pet.timesHurt++;
    }
    // knockout
    if (pet.health < 1) {
        self.triggerKillEventsFor(pet);
    }

    // this hurt ability - new trigger system
    if (damage > 0) {
        self.triggerHurtEventsFor(pet, damage);
    }
}
