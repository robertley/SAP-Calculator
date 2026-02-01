import {
  SimulationConfig,
  SimulationResult,
  PetConfig,
} from '../interfaces/simulation-config.interface';
import { Player } from '../classes/player.class';
import { LogService } from '../services/log.service';
import { GameService } from '../services/game.service';
import { AbilityService } from '../services/ability/ability.service';
import { PetService } from '../services/pet/pet.service';
import { EquipmentService } from '../services/equipment/equipment.service';
import { ToyService } from '../services/toy/toy.service';
import { PetForm } from '../services/pet/pet-factory.service';
import { Battle } from '../interfaces/battle.interface';
import { AbilityEngine } from './ability/ability-engine';
import {
  EventProcessor,
  EventProcessorContext,
} from './processor/event-processor';

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

  public run(config: SimulationConfig): SimulationResult {
    let battleCount = config.simulationCount || 1000;

    // Setup initial simulation state from config
    this.logService.setEnabled(config.logsEnabled !== false);
    this.logService.setDeferDecorations(true);
    this.resetSimulation();
    this.setupGameEnvironment(config);

    if (config.optimizeDeterministicSimulations && this.isBattleDeterministic(config)) {
      battleCount = 1;
    }

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
      battles: this.battles,
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

    // Packs
    this.player.pack = config.playerPack as any;
    this.opponent.pack = config.opponentPack as any;

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

  protected initBattle(config: SimulationConfig) {
    this.logService.reset();
    this.abilityService.clearGlobalEventQueue();
    this.currBattle = {
      winner: 'draw',
      logs: this.logService.getLogs(),
    };
    this.battles.push(this.currBattle);

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
    const equipmentValue = petConfig.equipment as any;
    let equipment: PetForm['equipment'] = null;
    if (typeof equipmentValue === 'string') {
      equipment = { name: equipmentValue };
    } else if (equipmentValue && typeof equipmentValue === 'object') {
      equipment = equipmentValue;
    }

    return {
      ...(petConfig as any),
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
        (typeof equipmentValue?.uses === 'number' ? equipmentValue.uses : null),
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

  private isBattleDeterministic(config: SimulationConfig): boolean {
    if (config.komodoShuffle || config.oldStork) {
      return false;
    }

    // Check toys
    if (config.playerToy && this.toyService.isToyRandom(config.playerToy)) {
      return false;
    }
    if (config.opponentToy && this.toyService.isToyRandom(config.opponentToy)) {
      return false;
    }

    // Check hard toys (images mostly, but if they have logic? Hard toys are usually cosmetic or simple, but verify)
    // Hard toys usually don't have logic in this calc, they are treated as backgrounds/cosmetic or simple state?
    // Actually gameApi has playerHardToy.
    // If hard mode toys have effects (like in the game), they might be random. 
    // Assuming hard toys are deterministic for now unless they are in 'toys.json' and handled.
    // Logic usually handled by 'Toy' class if passed.

    const checkPets = (pets: (PetConfig | null)[]) => {
      if (!pets) return true; // Empty is deterministic
      for (let i = 0; i < pets.length; i++) {
        const pet = pets[i];
        if (!pet || !pet.name) continue;

        const petRandom = this.petService.isPetRandom(pet.name);
        if (petRandom) {
          return false;
        }

        // Equipment
        let equipmentName: string | null = null;
        if (typeof pet.equipment === 'string') {
          equipmentName = pet.equipment;
        } else if (pet.equipment && typeof pet.equipment === 'object') {
          equipmentName = pet.equipment.name;
        }

        if (equipmentName) {
          const equipRandom = this.equipmentService.isEquipmentRandom(equipmentName);
          if (equipRandom) {
            return false;
          }
        }
      }
      return true;
    };

    if (!checkPets(config.playerPets)) {
      return false;
    }
    if (!checkPets(config.opponentPets)) {
      return false;
    }

    return true;
  }
}
