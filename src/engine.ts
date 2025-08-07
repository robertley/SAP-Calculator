// This is our new, browser-extension-friendly entry point.

import { LogService } from './app/services/log.service';
import { GameService } from './app/services/game.service';
import { AbilityService } from './app/services/ability.service';
import { PetService } from './app/services/pet.service';
import { EquipmentService } from './app/services/equipment.service';
import { ToyService } from './app/services/toy.service';
import { StartOfBattleService } from './app/services/start-of-battle.service';
import { Player } from './app/classes/player.class';
import { Pet } from './app/classes/pet.class';

/**
 * The main simulation function that will be exposed globally.
 * @param config An object containing the player and opponent teams, and other battle settings.
 * @returns An object with the simulation results.
 */
function runSapSimulation(config) {
    // 1. Manually instantiate services (this replaces Angular's Dependency Injection)
    const logService = new LogService();
    const gameService = new GameService();
    const abilityService = new AbilityService(gameService);
    // Note: PetService has many dependencies, we must provide them.
    const equipmentService = new EquipmentService(logService, abilityService, petService, gameService);
    const toyService = new ToyService(logService, abilityService, gameService, equipmentService);
    const petService = new PetService(logService, abilityService, gameService);
    const startOfBattleService = new StartOfBattleService(gameService);

    // Some services might have circular dependencies or need other services.
    // We adjust the `toyService` instantiation after `abilityService` is created.
    toyService.abilityService = abilityService;

    // 2. Initialize the game with the provided configuration
    const player = new Player(logService, abilityService, gameService);
    const opponent = new Player(logService, abilityService, gameService);
    gameService.init(player, opponent);

    // Apply config settings
    gameService.gameApi.turnNumber = config.turn || 11;
    // ... set any other config properties like gold spent, etc.

    // 3. Create Pet instances and populate teams
    config.playerPets.forEach((petData, i) => {
        if (petData && petData.name) {
            const pet = petService.createPet(petData, player);
            player.setPet(i, pet, true);
        }
    });

    config.opponentPets.forEach((petData, i) => {
        if (petData && petData.name) {
            const pet = petService.createPet(petData, opponent);
            opponent.setPet(i, pet, true);
        }
    });

    // 4. Run the simulation loop (condensed logic from your app.component.ts)
    let playerWinner = 0;
    let opponentWinner = 0;
    let draw = 0;
    const simulationBattleAmt = config.simulationCount || 1000;

    for (let i = 0; i < simulationBattleAmt; i++) {
        player.resetPets();
        opponent.resetPets();
        logService.reset();
        abilityService.resetAllQueues(); // Important to reset ability queues

        let battleStarted = true;
        let turns = 0;
        const maxTurns = 50;

        // --- START OF BATTLE PHASE ---
        startOfBattleService.initStartOfBattleEvents();
        startOfBattleService.executeNonToyPetEvents(); // Execute pet abilities
        // The full start-of-battle logic from your component would be replicated here.

        // --- BATTLE LOOP ---
        while (battleStarted) {
            turns++;
            if (turns >= maxTurns || (!player.alive() || !opponent.alive())) {
                if (!player.alive() && !opponent.alive()) draw++;
                else if (player.alive()) playerWinner++;
                else if (opponent.alive()) opponentWinner++;
                else draw++; // Should cover the max turns case
                battleStarted = false;
                continue;
            }

            // A simplified fight turn
            const playerPet = player.petArray[0];
            const opponentPet = opponent.petArray[0];

            if (playerPet && opponentPet) {
                playerPet.attackPet(opponentPet);
                opponentPet.attackPet(playerPet);
            }
            
            // This is a simplification. The full ability cycle from app.component would be needed here.
            player.checkPetsAlive();
            opponent.checkPetsAlive();
            player.removeDeadPets();
            opponent.removeDeadPets();
            player.pushPetsForward();
            opponent.pushPetsForward();
        }
    }

    // 5. Return results
    return {
        playerWins: playerWinner,
        opponentWins: opponentWinner,
        draws: draw,
    };
}

// Expose the function to the global scope (self is the global scope in a Service Worker)
(self as any).runSapSimulation = runSapSimulation;
