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

export type Pack = 'Turtle' | 'Puppy' | 'Star' | 'Golden';

export abstract class Pet {
    name: string;
    tier: number;
    pack: Pack;
    hidden: boolean = false;
    parent: Player;
    health: number;
    attack: number;
    equipment?: Equipment;
    originalHealth: number;
    originalAttack: number;
    originalEquipment?: Equipment;
    exp?: number = 0;
    startOfBattle?(gameApi: GameAPI, tiger?: boolean): void;
    transform?(gameApi: GameAPI, tiger?: boolean): void;
    // startOfTurn?: () => void;
    hurt?(gameApi: GameAPI, tiger?: boolean): void;
    faint?(gameApi?: GameAPI, tiger?: boolean): void;
    friendSummoned?(pet: Pet, tiger?: boolean): void;
    friendAheadAttacks?(gameApi: GameAPI, tiger?: boolean): void;
    friendAheadFaints?(gameApi: GameAPI, tiger?: boolean): void;
    friendFaints?(gameApi: GameAPI, tiger?: boolean): void;
    friendGainedPerk?(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void;
    friendGainedAilment?(gameApi: GameAPI, pet?: Pet): void;
    afterAttack?(gameApi: GameAPI, tiger?: boolean): void;
    beforeAttack?(gameApi: GameAPI, tiger?: boolean): void;
    // NOTE: not all End Turn ability pets should have their ability defined. e.g Giraffe
    // example of pet that SHOULD be defined: Parrot.
    endTurn?(gameApi: GameAPI): void;
    knockOut?(gameApi: GameAPI, tiger?: boolean): void;
    summoned?(gameApi: GameAPI, tiger?: boolean): void;
    friendlyToyBroke?(gameApi: GameAPI, tiger?: boolean): void;
    savedPosition: 0 | 1 | 2 | 3 | 4;
    // flags to make sure events/logs are not triggered multiple times
    done = false;
    seenDead = false;
    swallowedPets?: Pet[] = [];
    toyPet = false;


    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player) {
        this.parent = parent;
    }

    initPet(exp, health, attack, equipment) {
        this.exp = exp ?? this.exp;
        this.health = health ?? this.health * this.level;
        this.attack = attack ?? this.attack * this.level;
        this.originalHealth = this.health;
        this.originalAttack = this.attack;
        this.equipment = equipment;
        this.originalEquipment = equipment;
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

    protected superHurt(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.hurt(gameApi, true)
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

    protected superFriendSummoned(pet, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendSummoned(pet, true)
        this.exp = exp;
    }

    protected superFriendAheadAttacks(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendAheadAttacks(gameApi, true)
        this.exp = exp;
    }

    protected superFriendAheadFaints(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendAheadFaints(gameApi, true)
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

    protected superKnockOut(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.knockOut(gameApi, true)
        this.exp = exp;
    }

    protected superFriendFaints(gameApi, tiger=false) {
        if (!this.tigerCheck(tiger)) {
            return;
        }
        let exp = this.exp;
        this.exp = this.petBehind().minExpForLevel;
        this.friendFaints(gameApi, true)
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


    attackPet(pet: Pet) {

        let damageResp = this.calculateDamgae(pet);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

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
                let powerAmt = `+${attackEquipment.power}`;
                if (attackEquipment instanceof Salt) {
                    if (pet.tier < this.tier) {
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
                let power = Math.abs(defenseEquipment.power);
                let sign = '-';
                if (defenseEquipment.power < 0) {
                    sign = '+';
                }
                message += ` (${defenseEquipment.name} ${sign}${power})`;

                if (defenseMultiplier > 1) {
                    message += ` x${defenseMultiplier} (Panther)`;
                }
            }
            this.logService.createLog({
                message: message,
                type: "attack",
                player: this.parent
            });
    
            let skewerEquipment: Equipment = this.equipment?.equipmentClass == 'skewer' ? this.equipment : null;
            if (skewerEquipment != null) {
                skewerEquipment.attackCallback(this, pet);
            }
        }

        // hurt ability
        if (pet.hurt != null) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent
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
                priority: this.attack
            })
        }

        // friend ahead attacks
        if (this.petBehind(true)?.friendAheadAttacks != null) {
            this.abilityService.setFriendAheadAttacksEvents({
                callback: this.petBehind(true).friendAheadAttacks.bind(this.petBehind(true)),
                priority: this.petBehind(true).attack
            });
        }

    }

    snipePet(pet: Pet, power: number, randomEvent?: boolean, tiger?: boolean) {

        let wolverine = false;
        if (this.petAhead?.name == 'Wolverine') {
            power += this.petAhead.level * 3;
            wolverine = true;
        }
        if (this.petBehind()?.name == 'Wolverine') {
            power += this.petBehind().level * 3;
            wolverine = true;
        }

        let damageResp = this.calculateDamgae(pet, power);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        pet.health -= damage;

        // TODO Attack Equipment (pineapple)
        let message = `${this.name} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment()
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            message += ` (${defenseEquipment.name} ${sign}${power})`;
        }

        if (tiger) {
            message += ' (Tiger)'
        }

        if (wolverine) {
            message += ' (Wolverine)'
        }

        this.logService.createLog({
            message: message,
            type: "attack",
            randomEvent: randomEvent,
            player: this.parent
        });
        
        // hurt ability
        if (pet.hurt != null) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent
            })
        }

        // knockout
        if (pet.health < 1 && this.knockOut != null) {
            this.abilityService.setKnockOutEvent({
                callback: this.knockOut.bind(this),
                priority: this.attack
            })
        }
    }

    calculateDamgae(pet: Pet, power?: number): {defenseEquipment: Equipment, attackEquipment: Equipment, damage: number} {
        let attackMultiplier = 1;
        let defenseMultiplier = 1;
        if (this.name == 'Panther') {
            attackMultiplier = this.level + 1;
        }
        if (pet.name == 'Panther') {
            defenseMultiplier = pet.level + 1;
        }

        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' 
        || pet.equipment?.equipmentClass == 'shield'
        || pet.equipment?.equipmentClass == 'ailment-defense' ? pet.equipment : null;

        let attackEquipment: Equipment = this.equipment?.equipmentClass == 'attack'
        || pet.equipment?.equipmentClass == 'ailment-attack' ? this.equipment : null;
        let attackAmt = power ?? this.attack + (attackEquipment?.power ? attackEquipment.power * attackMultiplier : 0);
        let defenseAmt = defenseEquipment?.power ? defenseEquipment.power * defenseMultiplier : 0;
        let min = defenseEquipment?.equipmentClass == 'shield' ? 0 : 1;

        if (attackEquipment instanceof Salt) {
            if (pet.tier < this.tier) {
                attackAmt *= 2;
            }
        }

        let damage = Math.max(min, attackAmt - defenseAmt);
        return {
            defenseEquipment: defenseEquipment,
            attackEquipment: attackEquipment,
            damage: damage
        }
    } 

    resetPet() {
        this.health = this.originalHealth;
        this.attack = this.originalAttack;
        this.equipment = this.originalEquipment;
        this.done = false;
        this.seenDead = false;
        this.equipment?.reset();
        this.swallowedPets = [];
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
                    callback: () => { this.equipment.callback(this) }
                }
            )
        }

    }

    useDefenseEquipment() {
        if (this.equipment == null) {
            return;
        }
        if (this.equipment.equipmentClass != 'defense' && this.equipment.equipmentClass != 'shield') {
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
        this.attack = Math.min(this.attack + amt, 50);
    }

    increaseHealth(amt) {
        this.health = Math.min(this.health + amt, 50);
    }

    givePetEquipment(equipment: Equipment) {
        this.equipment = equipment;
        
        if (equipment.equipmentClass == 'ailment-attack' || equipment.equipmentClass == 'ailment-defense') {
            this.abilityService.triggerFriendGainedAilmentEvents(this);
            this.abilityService.executeFriendGainedAilmentEvents();
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
    petBehind(seenDead = false) {
        for (let i = this.position + 1; i < 5; i++) {
            let pet = this.parent.getPetAtPosition(i);
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