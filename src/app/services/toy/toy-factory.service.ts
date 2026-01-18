import { Injectable } from "@angular/core";
import { LogService } from "../log.service";
import { AbilityService } from "../ability/ability.service";
import { EquipmentService } from "../equipment/equipment.service";
import { PetService } from "../pet/pet.service";
import { GameService } from "../game.service";
import { Player } from "../../classes/player.class";
import { Toy } from "../../classes/toy.class";
import {
    ToyRegistryDeps,
    STANDARD_TOYS,
    TOYS_NEEDING_ABILITY_SERVICE,
    SPECIAL_TOY_BUILDERS
} from "./toy-registry";

@Injectable({
    providedIn: 'root'
})
export class ToyFactoryService {

    constructor(
        private logService: LogService,
        private abilityService: AbilityService
    ) { }

    createToy(
        toyName: string,
        parent: Player,
        level: number,
        toyService: any,
        petService?: PetService,
        equipmentService?: EquipmentService,
        gameService?: GameService
    ): Toy | null {
        const deps: ToyRegistryDeps = {
            logService: this.logService,
            abilityService: this.abilityService,
            toyService,
            parent,
            level,
            petService,
            equipmentService,
            gameService
        };

        // Special cases with unique constructor signatures
        const specialBuilder = SPECIAL_TOY_BUILDERS[toyName];
        if (specialBuilder) {
            return specialBuilder(deps);
        }

        // Toys needing AbilityService
        if (TOYS_NEEDING_ABILITY_SERVICE[toyName]) {
            const ToyClass = TOYS_NEEDING_ABILITY_SERVICE[toyName];
            return new ToyClass(this.logService, toyService, this.abilityService, parent, level);
        }

        // Standard toys
        if (STANDARD_TOYS[toyName]) {
            const ToyClass = STANDARD_TOYS[toyName];
            return new ToyClass(this.logService, toyService, parent, level);
        }

        return null;
    }
}
