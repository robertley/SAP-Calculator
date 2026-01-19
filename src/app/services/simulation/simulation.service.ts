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
        this.syncGameApiFromForm(formGroup);

        return result;
    }

    private syncGameApiFromForm(formGroup: FormGroup) {
        this.gameService.gameApi.oldStork = formGroup.get('oldStork').value;
        this.gameService.gameApi.komodoShuffle = formGroup.get('komodoShuffle').value;
        this.gameService.gameApi.mana = formGroup.get('mana').value;
        this.gameService.gameApi.playerRollAmount = formGroup.get('playerRollAmount').value;
        this.gameService.gameApi.opponentRollAmount = formGroup.get('opponentRollAmount').value;
        this.gameService.gameApi.playerLevel3Sold = formGroup.get('playerLevel3Sold').value;
        this.gameService.gameApi.opponentLevel3Sold = formGroup.get('opponentLevel3Sold').value;
        this.gameService.gameApi.playerSummonedAmount = formGroup.get('playerSummonedAmount').value;
        this.gameService.gameApi.opponentSummonedAmount = formGroup.get('opponentSummonedAmount').value;
        this.gameService.gameApi.playerTransformationAmount = formGroup.get('playerTransformationAmount').value;
        this.gameService.gameApi.opponentTransformationAmount = formGroup.get('opponentTransformationAmount').value;
        this.gameService.setGoldSpent(
            formGroup.get('playerGoldSpent').value,
            formGroup.get('opponentGoldSpent').value
        );
        this.gameService.setTurnNumber(formGroup.get('turn').value);
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
            playerRollAmount: formGroup.get('playerRollAmount').value,
            opponentRollAmount: formGroup.get('opponentRollAmount').value,
            playerSummonedAmount: formGroup.get('playerSummonedAmount').value,
            opponentSummonedAmount: formGroup.get('opponentSummonedAmount').value,
            playerLevel3Sold: formGroup.get('playerLevel3Sold').value,
            opponentLevel3Sold: formGroup.get('opponentLevel3Sold').value,
            playerTransformationAmount: formGroup.get('playerTransformationAmount').value,
            opponentTransformationAmount: formGroup.get('opponentTransformationAmount').value,
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
