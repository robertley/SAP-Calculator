import { cloneDeep } from "lodash";
import { PetType } from "../enums/pet-type.enum";
import { GameAPI } from "../interfaces/gameAPI.interface";
import { FaintService } from "../services/faint.service";
import { LogService } from "../services/log.servicee";
import { SummonedService } from "../services/summoned.service";
import { Equipment } from "./equipment.class";
import { Player } from "./player.class";

export class Pet {
    name: string;
    parent: Player;
    health: number;
    attack: number;
    originalHealth: number;
    originalAttack: number;
    equipment?: Equipment;
    exp?: number = 0;
    passive?: () => void;
    startOfBattle?: (gameApi: GameAPI) => void;
    // startOfTurn?: () => void;
    hurt?: () => void;
    faint?: () => void;
    friendSummoned?: (pet: Pet) => void;
    savedPosition: 0 | 1 | 2 | 3 | 4;

    constructor(
        protected logService: LogService,
        protected faintService: FaintService,
        protected summonedService: SummonedService,
        parent: Player) {
        this.parent = parent;
    }

    attackPet(pet: Pet) {
        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' ? pet.equipment : null;
        let attackEquipment: Equipment = this.equipment?.equipmentClass == 'attack' ? this.equipment : null;
        let attackAmt = this.attack + (attackEquipment?.power ?? 0);
        let defenseAmt = defenseEquipment?.power ?? 0;
        let damage = Math.max(1, attackAmt - defenseAmt);

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
    }

    snipePet(pet: Pet, power: number, randomEvent?: boolean) {
        pet.health -= power;
        this.logService.createLog({
            message: `${this.name} sniped ${pet.name} for ${power}.`,
            type: "attack",
            randomEvent: randomEvent,
            player: this.parent
        });
    }

    resetPet() {
        this.health = this.originalHealth;
        this.attack = this.originalAttack;
    }

    alive() {
        if (this.health <= 0) {

            if (this.faint != null) {
                this.faintService.setFaintEvent(
                    {
                        priority: this.attack,
                        callback: this.faint
                    }
                )
            }
            return false;
        }
        return true;
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
}