import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SimulationRunner } from "../../engine/simulation-runner";
import { SimulationConfig, SimulationResult } from "../../interfaces/simulation-config.interface";
import { AbilityService } from "../ability/ability.service";
import { EquipmentService } from "../equipment/equipment.service";
import { GameService } from "../game.service";
import { LogService } from "../log.service";
import { PetService } from "../pet/pet.service";
import { ToyService } from "../toy/toy.service";
import { Player } from "../../classes/player.class";

@Injectable({
    providedIn: "root"
})
export class SimulationService {
    constructor(
        private logService: LogService,
        private gameService: GameService,
        private abilityService: AbilityService,
        private petService: PetService,
        private equipmentService: EquipmentService,
        private toyService: ToyService
    ) { }

    runSimulation(
        formGroup: FormGroup,
        count: number,
        player: Player,
        opponent: Player
    ): SimulationResult {
        const config = this.buildConfig(formGroup, count);

        const runner = new SimulationRunner(
            this.logService,
            this.gameService,
            this.abilityService,
            this.petService,
            this.equipmentService,
            this.toyService
        );

        const result = runner.run(config);

        // Restore GameService to UI players
        this.gameService.init(player, opponent);

        return result;
    }

    private buildConfig(formGroup: FormGroup, count: number): SimulationConfig {
        return {
            playerPack: formGroup.get('playerPack').value,
            opponentPack: formGroup.get('opponentPack').value,
            playerToy: formGroup.get('playerToy').value,
            playerToyLevel: formGroup.get('playerToyLevel').value,
            playerHardToy: formGroup.get('playerHardToy').value,
            playerHardToyLevel: formGroup.get('playerHardToyLevel').value,
            opponentToy: formGroup.get('opponentToy').value,
            opponentToyLevel: formGroup.get('opponentToyLevel').value,
            opponentHardToy: formGroup.get('opponentHardToy').value,
            opponentHardToyLevel: formGroup.get('opponentHardToyLevel').value,
            turn: formGroup.get('turn').value,
            playerGoldSpent: formGroup.get('playerGoldSpent').value,
            opponentGoldSpent: formGroup.get('opponentGoldSpent').value,
            playerRollAmount: this.gameService.gameApi.playerRollAmount,
            opponentRollAmount: this.gameService.gameApi.opponentRollAmount,
            playerSummonedAmount: this.gameService.gameApi.playerSummonedAmount,
            opponentSummonedAmount: this.gameService.gameApi.opponentSummonedAmount,
            playerLevel3Sold: this.gameService.gameApi.playerLevel3Sold,
            opponentLevel3Sold: this.gameService.gameApi.opponentLevel3Sold,
            playerTransformationAmount: this.gameService.gameApi.playerTransformationAmount,
            opponentTransformationAmount: this.gameService.gameApi.opponentTransformationAmount,
            playerPets: formGroup.get('playerPets').value,
            opponentPets: formGroup.get('opponentPets').value,
            allPets: formGroup.get('allPets').value,
            oldStork: formGroup.get('oldStork').value,
            tokenPets: formGroup.get('tokenPets').value,
            komodoShuffle: formGroup.get('komodoShuffle').value,
            mana: formGroup.get('mana').value,
            simulationCount: count
        };
    }
}
