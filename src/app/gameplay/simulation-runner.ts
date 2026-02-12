import {
  SimulationConfig,
  SimulationResult,
  PetConfig,
} from 'app/domain/interfaces/simulation-config.interface';
import { Player } from 'app/domain/entities/player.class';
import { LogService } from 'app/integrations/log.service';
import { GameService } from 'app/runtime/state/game.service';
import { AbilityService } from 'app/integrations/ability/ability.service';
import { PetService } from 'app/integrations/pet/pet.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { PetForm } from 'app/integrations/pet/pet-factory.service';
import { Battle } from 'app/domain/interfaces/battle.interface';
import { AbilityEngine } from './ability-engine';
import {
  EventProcessor,
  EventProcessorContext,
} from './event-processor';
import {
  applySeededRandom,
  isBattleDeterministic,
} from './simulation-randomness';
import {
  finishRandomDecisionSession,
  startRandomDecisionSession,
} from 'app/runtime/random-decision-state';

export interface SimulationRunHooks {
  shouldAbort?: () => boolean;
  onProgress?: (progress: {
    completed: number;
    total: number;
    playerWins: number;
    opponentWins: number;
    draws: number;
    loggedBattles: number;
  }) => void;
  progressInterval?: number;
}

export class SimulationRunner {
  protected player: Player;
  protected opponent: Player;
  protected battleStarted = false;
  protected turns = 0;
  protected maxTurns = 71;
  protected currBattle: Battle | null = null;
  protected battles: Battle[] = [];
  protected playerWinner = 0;
  protected opponentWinner = 0;
  protected draw = 0;
  protected abilityEngine: AbilityEngine;
  protected eventProcessor: EventProcessor;
  protected petFormCache = new WeakMap<PetConfig, PetForm>();

  // Services needed for simulation
  constructor(
    protected logService: LogService,
    protected gameService: GameService,
    protected abilityService: AbilityService,
    protected petService: PetService,
    protected equipmentService: EquipmentService,
    protected toyService: ToyService,
  ) {
    this.player = new Player(logService, abilityService, gameService);
    this.opponent = new Player(logService, abilityService, gameService);
    this.opponent.isOpponent = true;
    this.gameService.init(this.player, this.opponent);

    this.abilityEngine = new AbilityEngine(
      this.logService,
      this.gameService,
      this.abilityService,
      this.toyService,
      this.player,
      this.opponent,
    );

    const context: EventProcessorContext = {
      player: this.player,
      opponent: this.opponent,
      logService: this.logService,
      gameService: this.gameService,
      abilityService: this.abilityService,
      abilityEngine: this.abilityEngine,
      maxTurns: this.maxTurns,
      getBattle: () => this.currBattle,
      setBattle: (battle) => {
        this.currBattle = battle;
      },
      getBattleStarted: () => this.battleStarted,
      setBattleStarted: (value) => {
        this.battleStarted = value;
      },
      getTurns: () => this.turns,
      setTurns: (value) => {
        this.turns = value;
      },
      incrementPlayerWinner: () => {
        this.playerWinner += 1;
      },
      incrementOpponentWinner: () => {
        this.opponentWinner += 1;
      },
      incrementDraw: () => {
        this.draw += 1;
      },
    };

    this.eventProcessor = new EventProcessor(context);
  }

  public run(
    config: SimulationConfig,
    hooks?: SimulationRunHooks,
  ): SimulationResult {
    const restoreRandom = applySeededRandom(config.seed);
    let randomSessionResult: ReturnType<typeof finishRandomDecisionSession>;
    let simulationResult: SimulationResult = {
      playerWins: 0,
      opponentWins: 0,
      draws: 0,
      battles: [],
    };
    startRandomDecisionSession({
      capture: config.captureRandomDecisions,
      overrides: config.randomDecisionOverrides,
      strictValidation: config.strictRandomOverrideValidation !== false,
    });
    try {
      let battleCount = config.simulationCount || 1000;
      const logsEnabled = config.logsEnabled !== false;
      let loggedBattleCount = 0;
      const progressInterval =
        hooks?.onProgress && hooks.progressInterval != null
          ? Math.max(1, hooks.progressInterval)
          : null;

      // Setup initial simulation state from config
      this.logService.setEnabled(logsEnabled);
      this.logService.setDeferDecorations(true);
      this.resetSimulation();
      this.setupGameEnvironment(config);

      if (
        config.optimizeDeterministicSimulations &&
        isBattleDeterministic(
          config,
          this.petService,
          this.equipmentService,
          this.toyService,
        )
      ) {
        battleCount = 1;
      }

      let maxLoggedBattles =
        config.maxLoggedBattles == null
          ? logsEnabled
            ? battleCount
            : 0
          : Math.max(0, config.maxLoggedBattles);
      if (maxLoggedBattles > battleCount) {
        maxLoggedBattles = battleCount;
      }

      for (let i = 0; i < battleCount; i++) {
        if (hooks?.shouldAbort?.()) {
          break;
        }
        const shouldLog =
          logsEnabled &&
          maxLoggedBattles > 0 &&
          loggedBattleCount < maxLoggedBattles;
        this.logService.setEnabled(shouldLog);
        this.initBattle(config, shouldLog);
        if (shouldLog) {
          loggedBattleCount += 1;
        }
        this.prepareBattle(config);
        this.executeBattleLoop();
        this.reset();

        if (hooks?.onProgress && progressInterval != null) {
          const completed = i + 1;
          if (completed % progressInterval === 0 || completed === battleCount) {
            hooks.onProgress({
              completed,
              total: battleCount,
              playerWins: this.playerWinner,
              opponentWins: this.opponentWinner,
              draws: this.draw,
              loggedBattles: this.battles.length,
            });
          }
        }
        if (hooks?.shouldAbort?.()) {
          break;
        }
      }

      simulationResult = {
        playerWins: this.playerWinner,
        opponentWins: this.opponentWinner,
        draws: this.draw,
        battles: this.battles,
      };
    } finally {
      restoreRandom();
      randomSessionResult = finishRandomDecisionSession();
    }
    simulationResult.randomDecisions = randomSessionResult.decisions;
    simulationResult.randomOverrideError = randomSessionResult.invalidOverrideError;
    return simulationResult;
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
    this.gameService.setGoldSpent(
      config.playerGoldSpent ?? 10,
      config.opponentGoldSpent ?? 10,
    );

    // Update GameAPI flags
    this.gameService.gameApi.oldStork = config.oldStork ?? false;
    this.gameService.gameApi.komodoShuffle = config.komodoShuffle ?? false;
    this.gameService.gameApi.mana = config.mana ?? false;
    this.gameService.gameApi.playerRollAmount = config.playerRollAmount ?? 4;
    this.gameService.gameApi.opponentRollAmount =
      config.opponentRollAmount ?? 4;
    this.gameService.gameApi.playerLevel3Sold = config.playerLevel3Sold ?? 0;
    this.gameService.gameApi.opponentLevel3Sold =
      config.opponentLevel3Sold ?? 0;
    this.petService.setCustomPackPools(config.customPacks ?? []);

    // Packs
    this.player.pack = config.playerPack as Player['pack'];
    this.opponent.pack = config.opponentPack as Player['pack'];

    // Pet Pools - assuming this logic needs to access PetService tables
    const getPetPool = (pack: string) => {
      switch (pack) {
        case 'Turtle':
          return this.petService.turtlePackPets;
        case 'Puppy':
          return this.petService.puppyPackPets;
        case 'Star':
          return this.petService.starPackPets;
        case 'Golden':
          return this.petService.goldenPackPets;
        case 'Unicorn':
          return this.petService.unicornPackPets;
        case 'Danger':
          return this.petService.dangerPackPets;
        default:
          return this.petService.playerCustomPackPets.get(pack) || new Map();
      }
    };

    const playerPool = getPetPool(config.playerPack);
    const opponentPool = getPetPool(config.opponentPack);
    this.gameService.setTierGroupPets(playerPool, opponentPool);
  }

  protected initBattle(config: SimulationConfig, recordBattle: boolean = true) {
    this.logService.reset();
    this.abilityService.clearGlobalEventQueue();
    if (recordBattle) {
      this.currBattle = {
        winner: 'draw',
        logs: this.logService.getLogs(),
      };
      this.battles.push(this.currBattle);
    } else {
      this.currBattle = null;
    }

    this.gameService.gameApi.opponentSummonedAmount =
      config.opponentSummonedAmount ?? 0;
    this.gameService.gameApi.playerSummonedAmount =
      config.playerSummonedAmount ?? 0;
    this.gameService.gameApi.opponentTransformationAmount =
      config.opponentTransformationAmount ?? 0;
    this.gameService.gameApi.playerTransformationAmount =
      config.playerTransformationAmount ?? 0;
  }

  protected prepareBattle(config: SimulationConfig) {
    this.reset();

    // Create pets
    this.createPets(this.player, config.playerPets);
    this.createPets(this.opponent, config.opponentPets);
    this.applyPreBattleFriendDeathCounts();

    // Create Toys
    if (config.playerToy) {
      this.player.toy = this.toyService.createToy(
        config.playerToy,
        this.player,
        config.playerToyLevel ?? 1,
      );
      this.player.originalToy = this.player.toy;
    } else {
      this.player.toy = null;
      this.player.originalToy = null;
    }

    if (config.opponentToy) {
      this.opponent.toy = this.toyService.createToy(
        config.opponentToy,
        this.opponent,
        config.opponentToyLevel ?? 1,
      );
      this.opponent.originalToy = this.opponent.toy;
    } else {
      this.opponent.toy = null;
      this.opponent.originalToy = null;
    }

    this.gameService.gameApi.playerHardToy = config.playerHardToy ?? null;
    this.gameService.gameApi.playerHardToyLevel =
      config.playerHardToyLevel ?? 1;
    this.gameService.gameApi.opponentHardToy = config.opponentHardToy ?? null;
    this.gameService.gameApi.opponentHardToyLevel =
      config.opponentHardToyLevel ?? 1;

    this.startBattle();
    this.initToys();
    this.abilityService.initSpecialEndTurnAbility(this.player);
    this.abilityService.initSpecialEndTurnAbility(this.opponent);
    this.gameService.gameApi.FirstNonJumpAttackHappened = false;


    // Initialize equipment multipliers
    this.initializeEquipmentMultipliers();

    // Before battle phase
    this.logService.createLog({
      message: 'Phase 1: Before battle',
      type: 'board',
    });
    this.logService.printState(this.player, this.opponent);
    this.abilityService.triggerBeforeStartOfBattleEvents();
    this.abilityService.executeBeforeStartOfBattleEvents();

    this.checkPetsAlive();
    do {
      this.abilityCycle();
    } while (this.abilityService.hasAbilityCycleEvents);

    const hasChurros = (pet: { equipment?: { name?: string } }) =>
      pet.equipment?.name === 'Churros';
    // Init SOB (Churros pets before toys)
    this.logService.createLog({
      message: 'Phase 2: Start of battle',
      type: 'board',
    });
    this.logService.printState(this.player, this.opponent);
    this.abilityService.triggerStartBattleEvents(hasChurros);
    this.abilityService.executeStartBattleEvents();

    // Execute toy SOB
    this.toyService.executeStartOfBattleEvents();

    // Init SOB (remaining pets after toys)
    this.abilityService.triggerStartBattleEvents((pet) => !hasChurros(pet));
    this.abilityService.executeStartBattleEvents();

    this.checkPetsAlive();
    do {
      this.abilityCycle();
    } while (this.abilityService.hasAbilityCycleEvents);

    this.logService.createLog({
      message: 'Phase 3: After Start of Battle',
      type: 'board',
    });
    this.logService.printState(this.player, this.opponent);
  }

  protected createPets(player: Player, petsConfig: (PetConfig | null)[]) {
    for (let i = 0; i < 5; i++) {
      const petConfig = petsConfig[i];
      if (!petConfig || !petConfig.name) continue;

      let petForm = this.petFormCache.get(petConfig);
      if (!petForm) {
        petForm = this.buildPetForm(petConfig);
        this.petFormCache.set(petConfig, petForm);
      }

      const pet = this.petService.createPet(petForm, player);
      player.setPet(i, pet, true);
    }
  }

  protected buildPetForm(petConfig: PetConfig): PetForm {
    const equipmentValue = petConfig.equipment as unknown;
    let equipment: PetForm['equipment'] = null;
    if (typeof equipmentValue === 'string') {
      equipment = { name: equipmentValue };
    } else if (equipmentValue && typeof equipmentValue === 'object') {
      equipment = equipmentValue;
    }
    const equipmentValueRecord =
      equipmentValue && typeof equipmentValue === 'object'
        ? (equipmentValue as { uses?: unknown })
        : null;

    return {
      ...petConfig,
      name: petConfig.name,
      attack: petConfig.attack ?? 0,
      health: petConfig.health ?? 0,
      exp: petConfig.exp ?? 0,
      mana: petConfig.mana ?? 0,
      triggersConsumed: petConfig.triggersConsumed ?? 0,
      foodsEaten: petConfig.foodsEaten ?? 0,
      equipment,
      equipmentUses:
        petConfig.equipmentUses ??
        (typeof equipmentValueRecord?.uses === 'number'
          ? equipmentValueRecord.uses
          : null),
      battlesFought: petConfig.battlesFought ?? 0,
      timesHurt: petConfig.timesHurt ?? 0,
      friendsDiedBeforeBattle: petConfig.friendsDiedBeforeBattle ?? 0,
      abominationSwallowedPet1TimesHurt:
        petConfig.abominationSwallowedPet1TimesHurt ?? 0,
      abominationSwallowedPet2TimesHurt:
        petConfig.abominationSwallowedPet2TimesHurt ?? 0,
      abominationSwallowedPet3TimesHurt:
        petConfig.abominationSwallowedPet3TimesHurt ?? 0,
    };
  }

  protected applyPreBattleFriendDeathCounts() {
    this.abilityEngine.applyPreBattleFriendDeathCounts();
  }

  protected executeBattleLoop() {
    this.eventProcessor.executeBattleLoop();
  }

  // --- Logic moved from AppComponent ---

  protected startBattle() {
    this.eventProcessor.startBattle();
  }

  protected reset() {
    this.eventProcessor.reset();
  }

  protected nextTurn() {
    this.eventProcessor.nextTurn();
  }

  protected fight() {
    this.eventProcessor.fight();
  }

  protected abilityCycle() {
    this.abilityEngine.abilityCycle();
  }

  protected checkPetsAlive() {
    this.abilityEngine.checkPetsAlive();
  }

  protected removeDeadPets() {
    return this.abilityEngine.removeDeadPets();
  }

  protected emptyFrontSpaceCheck() {
    this.abilityEngine.emptyFrontSpaceCheck();
  }

  protected initToys() {
    this.abilityEngine.initToys();
  }

  protected pushPetsForwards() {
    this.eventProcessor.pushPetsForwards();
  }

  protected endLog(winner?: Player | null) {
    this.eventProcessor.endLog(winner);
  }

  // Ported from updatePreviousShopTier logic in AppComponent, but renamed/integrated into setupGameEnvironment
  // Ported updateGoldSpent logic... already integrated
  // Ported initPlayerPets... integrated into createPets

  protected initializeEquipmentMultipliers() {
    this.abilityEngine.initializeEquipmentMultipliers();
  }
  protected resetClearFrontFlags() {
    this.abilityEngine.resetClearFrontFlags();
  }
}




