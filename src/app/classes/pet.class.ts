import { GameAPI } from "../interfaces/gameAPI.interface";
import { LogService } from "../services/log.servicee";
import { Equipment } from "./equipment.class";
import { Player } from "./player.class";
import { Peanut } from "./equipment/peanut.class";
import { AbilityService } from "../services/ability.service";

export type Pack = 'Turtle' | 'Puppy' | 'Star' | 'Golden';

export class Pet {
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
    passive?: () => void;
    startOfBattle?: (gameApi: GameAPI) => void;
    // startOfTurn?: () => void;
    hurt?: () => void;
    faint?: (gameApi: GameAPI) => void;
    friendSummoned?: (pet: Pet) => void;
    friendAheadAttacks?: (pet: Pet) => void;
    friendAheadFaints?: () => void;
    friendFaints?: () => void;
    afterAttack?: () => void;
    beforeAttack?: () => void;
    knockOut?: () => void;
    summoned?: () => void;
    savedPosition: 0 | 1 | 2 | 3 | 4;
    // flags to make sure events/logs are not triggered multiple times
    done = false;
    seenDead = false;

    constructor(
        protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player) {
        this.parent = parent;
    }

    attackPet(pet: Pet) {

        let damageResp = this.calculateDamgae(pet);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

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
                message += ` (${attackEquipment.name} +${attackEquipment.power})`;
            }
            if (defenseEquipment != null) {
                message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
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
                callback: pet.hurt,
                priority: pet.attack,
                player: pet.parent
            })
        }

        // after attack
        if (this.afterAttack != null) {
            this.abilityService.setAfterAttackEvent({
                callback: this.afterAttack,
                priority: this.attack
            })
        }

        // friend ahead attacks
        if (this.petBehind?.friendAheadAttacks != null) {
            this.abilityService.setFriendAheadAttacksEvents({
                callback: this.petBehind.friendAheadAttacks,
                priority: this.petBehind.attack
            });
        }

    }

    snipePet(pet: Pet, power: number, randomEvent?: boolean) {

        let damageResp = this.calculateDamgae(pet, power);
        let attackEquipment = damageResp.attackEquipment;
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        pet.health -= damage;

        // TODO Attack Equipment (pineapple)
        let message = `${this.name} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
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
                callback: pet.hurt,
                priority: pet.attack,
                player: pet.parent
            })
        }
    }

    calculateDamgae(pet: Pet, power?: number): {defenseEquipment: Equipment, attackEquipment: Equipment, damage: number} {
        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' 
        || pet.equipment?.equipmentClass == 'shield' ? pet.equipment : null;

        let attackEquipment: Equipment = this.equipment?.equipmentClass == 'attack' ? this.equipment : null;
        let attackAmt = power ?? this.attack + (attackEquipment?.power ?? 0);
        let defenseAmt = defenseEquipment?.power ?? 0;
        let min = defenseEquipment?.equipmentClass == 'shield' ? 0 : 1;
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
    }

    get alive() {
        return this.health > 0;
    }
    

    setFaintEventIfPresent() {

        if (this.faint != null) {
            this.abilityService.setFaintEvent(
                {
                    priority: this.attack,
                    callback: this.faint
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
        ) {
            return;
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

    get level() {
        if (this.exp < 2) {
            return 1;
        }
        if (this.exp < 4) {
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

    get petBehind() {
        for (let i = this.position + 1; i < 5; i++) {
            let pet = this.parent.getPetAtPosition(i);
            if (pet != null) {
                return pet;
            }
        }
        return null;
    }
    get petAhead() {
        for (let i = this.position - 1; i > -1; i--) {
            let pet = this.parent.getPetAtPosition(i);
            if (pet != null) {
                return pet;
            }
        }
        return null;
    }

    get minExpForLevel() {
        return this.level == 1 ? 0 : this.level == 2 ? 2 : 5;
    }
}