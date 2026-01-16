import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { Player } from "../classes/player.class";
import { Equipment } from "../classes/equipment.class";
import { LogService } from "./log.service";
import { AbilityService } from "./ability.service";
import { GameService } from "./game.service";
import { levelToExp } from "../util/leveling";
import {
    PetFactoryDeps,
    PETS_NEEDING_PETSERVICE,
    PETS_NEEDING_GAMESERVICE,
    PETS_NEEDING_PETSERVICE_TYPES,
    PETS_NEEDING_GAMESERVICE_TYPES,
    SPECIAL_FORM_PET_BUILDERS
} from "./pet-factory-registry";


export interface PetForm {
    name: string;
    attack: number;
    health: number;
    mana: number;
    triggersConsumed?: number;
    exp: number;
    equipment: Equipment;
    belugaSwallowedPet?: string;
    sarcasticFringeheadSwallowedPet?: string;
    abominationSwallowedPet1?: string;
    abominationSwallowedPet2?: string;
    abominationSwallowedPet3?: string;
    battlesFought?: number;
    timesHurt?: number;
    friendsDiedBeforeBattle?: number;
    equipmentUses?: number;
}

@Injectable({
    providedIn: 'root'
})
export class PetFactoryService {

    constructor(
        private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService
    ) { }

    /**
     * Creates a pet from a Pet instance (cloning). Used by createDefaultVersionOfPet.
     */
    createPet(originalPet: Pet, petService: any, attack?: number, health?: number, exp?: number): Pet {
        const PetClass = originalPet.constructor as any;
        const parent = originalPet.parent;
        const xp = exp ?? levelToExp(originalPet.level);

        // Special Cases requiring PetService + GameService
        for (const GameServicePet of PETS_NEEDING_GAMESERVICE_TYPES) {
            if (originalPet instanceof GameServicePet) {
                return new GameServicePet(this.logService, this.abilityService, petService, this.gameService, parent, health, attack, 0, xp);
            }
        }

        if (PETS_NEEDING_PETSERVICE_TYPES.includes(PetClass)) {
            return new PetClass(this.logService, this.abilityService, petService, parent, health, attack, 0, xp);
        }

        // Generic Case
        return new PetClass(this.logService, this.abilityService, parent, health, attack, 0, xp);
    }

    /**
     * Creates a pet from a PetForm object. Used by createPet in PetService.
     */
    createPetFromForm(petForm: PetForm, parent: Player, petService: any, registry: { [key: string]: any }): Pet {
        const { name, health, attack, mana, exp, equipment, triggersConsumed } = petForm;
        const deps: PetFactoryDeps = {
            logService: this.logService,
            abilityService: this.abilityService,
            gameService: this.gameService
        };

        const applySarcasticSetting = (pet: Pet) => {
            if (pet) {
                pet.sarcasticFringeheadSwallowedPet = petForm.sarcasticFringeheadSwallowedPet ?? null;
                pet.friendsDiedBeforeBattle = petForm.friendsDiedBeforeBattle ?? 0;
            }
            return pet;
        };

        // Check if pet needs GameService (highest priority)
        if (PETS_NEEDING_GAMESERVICE[name]) {
            const PetClass = PETS_NEEDING_GAMESERVICE[name];
            const petInstance = new PetClass(this.logService, this.abilityService, petService, this.gameService, parent, health, attack, mana, exp, equipment, triggersConsumed);
            return applySarcasticSetting(this.applyEquipmentUsesOverride(petInstance, petForm));
        }

        // Special handling for pets with extra parameters
        const specialBuilder = SPECIAL_FORM_PET_BUILDERS[name];
        if (specialBuilder) {
            const petInstance = specialBuilder(deps, petForm, parent, petService);
            return applySarcasticSetting(this.applyEquipmentUsesOverride(petInstance, petForm));
        }

        // Check if pet needs PetService
        if (PETS_NEEDING_PETSERVICE[name]) {
            const PetClass = PETS_NEEDING_PETSERVICE[name];
            const petInstance = new PetClass(this.logService, this.abilityService, petService, parent, health, attack, mana, exp, equipment, triggersConsumed);
            return applySarcasticSetting(this.applyEquipmentUsesOverride(petInstance, petForm));
        }

        // Generic case using registry
        const PetClass = registry[name];
        if (PetClass) {
            const petInstance = new PetClass(this.logService, this.abilityService, parent, health, attack, mana, exp, equipment, triggersConsumed);
            return applySarcasticSetting(this.applyEquipmentUsesOverride(petInstance, petForm));
        }

        // Should not reach here if registry is complete
        return null;
    }

    private applyEquipmentUsesOverride(pet: Pet, petForm: PetForm): Pet {
        if (!pet) {
            return pet;
        }
        if (petForm.equipmentUses != null) {
            (pet as any).equipmentUsesOverride = petForm.equipmentUses;
        }
        return pet;
    }
}
