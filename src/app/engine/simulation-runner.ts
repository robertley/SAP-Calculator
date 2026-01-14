import { SimulationConfig, SimulationResult, PetConfig } from "../interfaces/simulation-config.interface";
import { Player } from "../classes/player.class";
import { LogService } from "../services/log.service";
import { GameService } from "../services/game.service";
import { AbilityService } from "../services/ability.service";
import { PetService } from "../services/pet.service";
import { EquipmentService } from "../services/equipment.service";
import { ToyService } from "../services/toy.service";
import { Battle } from "../interfaces/battle.interface";
import { Dazed } from "../classes/equipment/ailments/dazed.class";
import { ChocolateCake } from "../classes/equipment/golden/chocolate-cake.class";
import { Pie } from "../classes/equipment/puppy/pie.class";
import { Cherry } from "../classes/equipment/golden/cherry.class";
import { Pancakes } from "../classes/equipment/puppy/pancakes.class";
import { LovePotion } from "../classes/equipment/unicorn/love-potion.class";
import { GingerbreadMan } from "../classes/equipment/unicorn/gingerbread-man.class";
import { HealthPotion } from "../classes/equipment/unicorn/health-potion.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { shuffle } from "lodash";

export class SimulationRunner {
    protected player: Player;
    protected opponent: Player;
    protected battleStarted = false;
    protected turns = 0;
    protected maxTurns = 71;
    protected currBattle: Battle;
    protected battles: Battle[] = [];
    protected playerWinner = 0;
    protected opponentWinner = 0;
    protected draw = 0;

    // Services needed for simulation
    constructor(
        protected logService: LogService,
        protected gameService: GameService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected equipmentService: EquipmentService,
        protected toyService: ToyService
    ) {
        this.player = new Player(logService, abilityService, gameService);
        this.opponent = new Player(logService, abilityService, gameService);
        this.opponent.isOpponent = true;
        this.gameService.init(this.player, this.opponent);
    }

    public run(config: SimulationConfig): SimulationResult {
        const battleCount = config.simulationCount || 1000;

        // Setup initial simulation state from config
        this.resetSimulation();
        this.setupGameEnvironment(config);

        for (let i = 0; i < battleCount; i++) {
            this.initBattle(config);
            this.prepareBattle(config);
            this.executeBattleLoop();
            this.reset();
        }

        return {
            playerWins: this.playerWinner,
            opponentWins: this.opponentWinner,
            draws: this.draw,
            battles: this.battles
        };
    }

    protected resetSimulation() {
        this.playerWinner = 0;
        this.opponentWinner = 0;
        this.draw = 0;
        this.battles = [];
        this.currBattle = null;
    }

    protected setupGameEnvironment(config: SimulationConfig) {
        // Set turn and tier
        let tier = 1;
        if (config.turn > 2) tier = 2;
        if (config.turn > 4) tier = 3;
        if (config.turn > 6) tier = 4;
        if (config.turn > 8) tier = 5;
        if (config.turn > 10) tier = 6;

        this.gameService.setPreviousShopTier(tier);
        this.gameService.setTurnNumber(config.turn);
        this.gameService.setGoldSpent(config.playerGoldSpent ?? 10, config.opponentGoldSpent ?? 10);

        // Update GameAPI flags
        this.gameService.gameApi.oldStork = config.oldStork ?? false;
        this.gameService.gameApi.komodoShuffle = config.komodoShuffle ?? false;
        this.gameService.gameApi.mana = config.mana ?? false;
        this.gameService.gameApi.playerRollAmount = config.playerRollAmount ?? 4;
        this.gameService.gameApi.opponentRollAmount = config.opponentRollAmount ?? 4;
        this.gameService.gameApi.playerLevel3Sold = config.playerLevel3Sold ?? 0;
        this.gameService.gameApi.opponentLevel3Sold = config.opponentLevel3Sold ?? 0;

        // Packs
        this.player.pack = config.playerPack as any;
        this.opponent.pack = config.opponentPack as any;

        // Pet Pools - assuming this logic needs to access PetService tables
        const getPetPool = (pack: string) => {
            switch (pack) {
                case 'Turtle': return this.petService.turtlePackPets;
                case 'Puppy': return this.petService.puppyPackPets;
                case 'Star': return this.petService.starPackPets;
                case 'Golden': return this.petService.goldenPackPets;
                case 'Unicorn': return this.petService.unicornPackPets;
                case 'Danger': return this.petService.dangerPackPets;
                default: return this.petService.playerCustomPackPets.get(pack) || new Map();
            }
        };

        const playerPool = getPetPool(config.playerPack);
        const opponentPool = getPetPool(config.opponentPack);
        this.gameService.setTierGroupPets(playerPool, opponentPool);
    }

    protected initBattle(config: SimulationConfig) {
        this.logService.reset();
        this.currBattle = {
            winner: 'draw',
            logs: this.logService.getLogs()
        };
        this.battles.push(this.currBattle);

        this.gameService.gameApi.opponentSummonedAmount = config.opponentSummonedAmount ?? 0;
        this.gameService.gameApi.playerSummonedAmount = config.playerSummonedAmount ?? 0;
        this.gameService.gameApi.opponentTransformationAmount = config.opponentTransformationAmount ?? 0;
        this.gameService.gameApi.playerTransformationAmount = config.playerTransformationAmount ?? 0;
    }

    protected prepareBattle(config: SimulationConfig) {
        this.reset();

        // Create pets
        this.createPets(this.player, config.playerPets);
        this.createPets(this.opponent, config.opponentPets);

        // Create Toys
        if (config.playerToy) {
            this.player.toy = this.toyService.createToy(config.playerToy, this.player, config.playerToyLevel ?? 1);
            this.player.originalToy = this.player.toy;
        } else {
            this.player.toy = null;
            this.player.originalToy = null;
        }

        if (config.opponentToy) {
            this.opponent.toy = this.toyService.createToy(config.opponentToy, this.opponent, config.opponentToyLevel ?? 1);
            this.opponent.originalToy = this.opponent.toy;
        } else {
            this.opponent.toy = null;
            this.opponent.originalToy = null;
        }

        this.startBattle();
        this.initToys();
        this.gameService.gameApi.FirstNonJumpAttackHappened = false;

        this.abilityService.initSpecialEndTurnAbility(this.player);
        this.abilityService.initSpecialEndTurnAbility(this.opponent);

        // Initialize equipment multipliers
        this.initializeEquipmentMultipliers();

        // Before battle phase
        this.abilityService.triggerBeforeStartOfBattleEvents();
        this.abilityService.executeBeforeStartOfBattleEvents();

        this.checkPetsAlive();
        do {
            this.abilityCycle();
        } while (this.abilityService.hasAbilityCycleEvents);

        // Execute toy SOB
        this.toyService.executeStartOfBattleEvents();

        // Init SOB
        this.abilityService.triggerStartBattleEvents();
        this.abilityService.executeStartBattleEvents();

        this.checkPetsAlive();
        do {
            this.abilityCycle();
        } while (this.abilityService.hasAbilityCycleEvents);
    }

    protected createPets(player: Player, petsConfig: (PetConfig | null)[]) {
        const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();

        for (let i = 0; i < 5; i++) {
            const petConfig = petsConfig[i];
            if (!petConfig || !petConfig.name) continue;

            let equipment = petConfig.equipment?.name
                ? equipmentMap.get(petConfig.equipment.name)
                : undefined;

            if (equipment) {
                // Clone equipment
                equipment = Object.assign(Object.create(Object.getPrototypeOf(equipment)), equipment);
            }

            const pet = this.petService.createPet({
                name: petConfig.name,
                attack: petConfig.attack ?? 0,
                health: petConfig.health ?? 0,
                exp: petConfig.exp ?? 0,
                mana: petConfig.mana ?? 0,
                equipment: equipment,
                triggersConsumed: petConfig.triggersConsumed ?? 0,
                belugaSwallowedPet: petConfig.belugaSwallowedPet,
                abominationSwallowedPet1: petConfig.abominationSwallowedPet1,
                abominationSwallowedPet2: petConfig.abominationSwallowedPet2,
                abominationSwallowedPet3: petConfig.abominationSwallowedPet3,
                battlesFought: petConfig.battlesFought ?? 0,
                timesHurt: petConfig.timesHurt ?? 0
            }, player);

            player.setPet(i, pet, true);
        }
    }


    protected executeBattleLoop() {
        while (this.battleStarted) {
            this.nextTurn();
        }
    }

    // --- Logic moved from AppComponent ---

    protected startBattle() {
        this.reset();
        this.battleStarted = true;
        this.turns = 0;
    }

    protected reset() {
        this.player.resetPets();
        this.opponent.resetPets();
    }

    protected nextTurn() {
        let finished = false;
        let winner = null;
        this.turns++;

        if (!this.player.alive() && this.opponent.alive()) {
            winner = this.opponent;
            this.currBattle.winner = 'opponent';
            this.opponentWinner++;
            finished = true;
        }
        if (!this.opponent.alive() && this.player.alive()) {
            winner = this.player;
            this.currBattle.winner = 'player';
            this.playerWinner++;
            finished = true;
        }
        if (!this.opponent.alive() && !this.player.alive()) {
            this.draw++;
            finished = true;
        } else if (this.turns >= this.maxTurns) {
            this.draw++;
            finished = true;
        }

        if (finished) {
            this.logService.printState(this.player, this.opponent);
            this.endLog(winner);
            this.battleStarted = false;
            return;
        }

        this.pushPetsForwards();
        this.logService.printState(this.player, this.opponent);

        while (true) {
            let originalPlayerAttackingPet = this.player.pet0;
            let originalOpponentAttackingPet = this.opponent.pet0;

            this.abilityService.triggerBeforeAttackEvent(this.player.pet0);
            this.abilityService.triggerBeforeAttackEvent(this.opponent.pet0);
            this.abilityService.executeBeforeAttackEvents();

            this.checkPetsAlive();
            do {
                this.abilityCycle();
            } while (this.abilityService.hasAbilityCycleEvents);

            if (!this.player.alive() || !this.opponent.alive()) {
                return;
            }

            this.pushPetsForwards();

            if (originalPlayerAttackingPet && originalPlayerAttackingPet.transformed) {
                originalPlayerAttackingPet = originalPlayerAttackingPet.transformedInto;
            }
            if (originalOpponentAttackingPet && originalOpponentAttackingPet.transformed) {
                originalOpponentAttackingPet = originalOpponentAttackingPet.transformedInto;
            }

            if (this.player.pet0 == originalPlayerAttackingPet && this.opponent.pet0 == originalOpponentAttackingPet) {
                break;
            }
        }

        this.player.resetJumpedFlags();
        this.opponent.resetJumpedFlags();

        this.fight();
        this.checkPetsAlive();

        do {
            this.abilityCycle();
        } while (this.abilityService.hasAbilityCycleEvents);
    }

    protected fight() {
        let playerPet = this.player.pet0;
        let opponentPet = this.opponent.pet0;

        playerPet.attackPet(opponentPet);
        opponentPet.attackPet(playerPet);

        playerPet.useAttackDefenseEquipment();
        opponentPet.useAttackDefenseEquipment();

        this.gameService.gameApi.FirstNonJumpAttackHappened = true;
        this.checkPetsAlive();
        this.abilityService.executeAfterAttackEvents();
    }

    protected abilityCycle() {
        this.emptyFrontSpaceCheck();
        while (this.abilityService.hasGlobalEvents) {
            const nextEvent = this.abilityService.peekNextHighestPriorityEvent();

            if (nextEvent && this.abilityService.getPriorityNumber(nextEvent.abilityType) >= 23) {
                this.checkPetsAlive();
                const petsWereRemoved = this.removeDeadPets();

                if (petsWereRemoved) {
                    this.emptyFrontSpaceCheck();
                    continue;
                }
            }

            const event = this.abilityService.getNextHighestPriorityEvent();
            if (event) {
                this.abilityService.executeEventCallback(event);
                this.checkPetsAlive();
            } else {
                console.error('AbilityCycle: Expected event from queue but got null. Queue state inconsistent.');
                break;
            }
        }

        let petRemoved = this.removeDeadPets();
        if (petRemoved) {
            this.emptyFrontSpaceCheck();
        }
        if (!this.abilityService.hasGlobalEvents) {
            this.player.checkGoldenSpawn();
            this.opponent.checkGoldenSpawn();
        }
    }

    protected checkPetsAlive() {
        this.player.checkPetsAlive();
        this.opponent.checkPetsAlive();
    }

    protected removeDeadPets() {
        let petRemoved = false;
        petRemoved = this.player.removeDeadPets();
        petRemoved = this.opponent.removeDeadPets() || petRemoved;
        return petRemoved;
    }

    protected emptyFrontSpaceCheck() {
        if (this.player.pet0 == null) {
            this.abilityService.triggerEmptyFrontSpaceEvents(this.player);
        }
        if (this.opponent.pet0 == null) {
            this.abilityService.triggerEmptyFrontSpaceEvents(this.opponent);
        }
        if (this.player.pet0 == null) {
            this.abilityService.triggerEmptyFrontSpaceToyEvents(this.player);
        }
        if (this.opponent.pet0 == null) {
            this.abilityService.triggerEmptyFrontSpaceToyEvents(this.opponent);
        }
        this.abilityService.executeEmptyFrontSpaceToyEvents();
    }

    protected initToys() {
        if (this.player.toy?.startOfBattle) {
            this.toyService.setStartOfBattleEvent({
                callback: () => {
                    this.player.toy.startOfBattle(this.gameService.gameApi);
                    let toyLevel = this.player.toy.level;
                    for (let pet of this.player.petArray) {
                        if (pet instanceof Puma) {
                            this.player.toy.level = pet.level;
                            this.player.toy.startOfBattle(this.gameService.gameApi, true);
                            this.player.toy.level = toyLevel;
                        }
                    }
                },
                priority: this.player.toy.tier
            });
        }
        if (this.opponent.toy?.startOfBattle) {
            this.toyService.setStartOfBattleEvent({
                callback: () => {
                    this.opponent.toy.startOfBattle(this.gameService.gameApi);
                    let toyLevel = this.opponent.toy.level;
                    for (let pet of this.opponent.petArray) {
                        if (pet instanceof Puma) {
                            this.opponent.toy.level = pet.level;
                            this.opponent.toy.startOfBattle(this.gameService.gameApi, true);
                            this.opponent.toy.level = toyLevel;
                        }
                    }
                },
                priority: this.opponent.toy.tier
            });
        }
    }

    protected pushPetsForwards() {
        this.player.pushPetsForward();
        this.opponent.pushPetsForward();
    }

    protected endLog(winner?: Player) {
        let message;
        if (winner == null) {
            message = 'Draw';
        } else if (winner == this.player) {
            message = 'Player is the winner';
        } else {
            message = 'Opponent is the winner';
        }
        this.logService.createLog({
            message: message,
            type: 'board'
        });
    }

    // Ported from updatePreviousShopTier logic in AppComponent, but renamed/integrated into setupGameEnvironment
    // Ported updateGoldSpent logic... already integrated
    // Ported initPlayerPets... integrated into createPets

    protected initializeEquipmentMultipliers() {
        // Initialize multipliers for equipment that pets start the battle with
        // This ensures Panther level multipliers and Pandora's Box toy multipliers work correctly

        for (let pet of this.player.petArray) {
            if (pet.equipment) {
                pet.setEquipmentMultiplier();
            }
        }

        for (let pet of this.opponent.petArray) {
            if (pet.equipment) {
                pet.setEquipmentMultiplier();
            }
        }
    }
}
