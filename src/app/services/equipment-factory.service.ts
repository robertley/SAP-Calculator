import { Injectable } from "@angular/core";
import { Equipment } from "../classes/equipment.class";
import { LogService } from "./log.service";
import { AbilityService } from "./ability.service";
import { GameService } from "./game.service";
import { PetService } from "./pet.service";
import { InjectorService } from "./injector.service";
import {
    EquipmentRegistryDeps,
    NO_ARG_EQUIPMENT,
    LOG_ONLY_EQUIPMENT,
    LOG_ABILITY_EQUIPMENT,
    NO_ARG_AILMENTS,
    SPECIAL_EQUIPMENT_BUILDERS,
    SPECIAL_AILMENT_BUILDERS
} from "./equipment-registry";

@Injectable({
    providedIn: 'root'
})
export class EquipmentFactoryService {

    constructor(
        private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService
    ) { }

    getAllEquipment(): Map<string, Equipment> {
        const petService = InjectorService.getInjector().get(PetService);
        const map = new Map<string, Equipment>();
        const deps: EquipmentRegistryDeps = {
            logService: this.logService,
            abilityService: this.abilityService,
            gameService: this.gameService,
            petService
        };

        // No-arg equipment
        for (const [name, EquipClass] of Object.entries(NO_ARG_EQUIPMENT)) {
            map.set(name, new EquipClass());
        }

        // LogService-only equipment
        for (const [name, EquipClass] of Object.entries(LOG_ONLY_EQUIPMENT)) {
            map.set(name, new EquipClass(this.logService));
        }

        // LogService + AbilityService equipment
        for (const [name, EquipClass] of Object.entries(LOG_ABILITY_EQUIPMENT)) {
            map.set(name, new EquipClass(this.logService, this.abilityService));
        }

        // Special cases with unique constructors
        for (const [name, builder] of Object.entries(SPECIAL_EQUIPMENT_BUILDERS)) {
            map.set(name, builder(deps));
        }

        return map;
    }

    getAllAilments(): Map<string, Equipment> {
        const map = new Map<string, Equipment>();
        const deps: EquipmentRegistryDeps = {
            logService: this.logService,
            abilityService: this.abilityService,
            gameService: this.gameService,
            petService: null
        };

        // No-arg ailments
        for (const [name, AilmentClass] of Object.entries(NO_ARG_AILMENTS)) {
            map.set(name, new AilmentClass());
        }

        // Special case
        for (const [name, builder] of Object.entries(SPECIAL_AILMENT_BUILDERS)) {
            map.set(name, builder(deps));
        }

        return map;
    }
}
