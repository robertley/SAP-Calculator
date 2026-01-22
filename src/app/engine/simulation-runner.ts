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
    this.gameService.gameApi.FirstNonJumpAttackHappened = false;

    this.abilityService.initSpecialEndTurnAbility(this.player);
    this.abilityService.initSpecialEndTurnAbility(this.opponent);

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
    const equipmentMap = this.equipmentService.getInstanceOfAllEquipment();

    for (let i = 0; i < 5; i++) {
      const petConfig = petsConfig[i];
      if (!petConfig || !petConfig.name) continue;

      let equipment = petConfig.equipment?.name
        ? equipmentMap.get(petConfig.equipment.name)
        : undefined;

      if (equipment) {
        // Clone equipment
        const equipmentClone = Object.assign(
          Object.create(Object.getPrototypeOf(equipment)),
          equipment,
        );
        equipment = equipmentClone;
        if (petConfig.equipmentUses != null) {
          const usesValue = Number(petConfig.equipmentUses);
          const finalUses = Number.isFinite(usesValue)
            ? usesValue
            : equipmentClone.uses;
          if (finalUses != null) {
            equipmentClone.uses = finalUses;
            equipmentClone.originalUses = finalUses;
          }
        }
      }

      const pet = this.petService.createPet(
        {
          name: petConfig.name,
          attack: petConfig.attack ?? 0,
          health: petConfig.health ?? 0,
          exp: petConfig.exp ?? 0,
          mana: petConfig.mana ?? 0,
          equipment: equipment,
          triggersConsumed: petConfig.triggersConsumed ?? 0,
          belugaSwallowedPet: petConfig.belugaSwallowedPet ?? undefined,
          abominationSwallowedPet1:
            petConfig.abominationSwallowedPet1 ?? undefined,
          abominationSwallowedPet2:
            petConfig.abominationSwallowedPet2 ?? undefined,
          abominationSwallowedPet3:
            petConfig.abominationSwallowedPet3 ?? undefined,
          abominationSwallowedPet1Level:
            petConfig.abominationSwallowedPet1Level ?? undefined,
          abominationSwallowedPet2Level:
            petConfig.abominationSwallowedPet2Level ?? undefined,
          abominationSwallowedPet3Level:
            petConfig.abominationSwallowedPet3Level ?? undefined,
          abominationSwallowedPet1TimesHurt:
            petConfig.abominationSwallowedPet1TimesHurt ?? 0,
          abominationSwallowedPet2TimesHurt:
            petConfig.abominationSwallowedPet2TimesHurt ?? 0,
          abominationSwallowedPet3TimesHurt:
            petConfig.abominationSwallowedPet3TimesHurt ?? 0,
          abominationSwallowedPet1BelugaSwallowedPet:
            petConfig.abominationSwallowedPet1BelugaSwallowedPet ?? undefined,
          abominationSwallowedPet2BelugaSwallowedPet:
            petConfig.abominationSwallowedPet2BelugaSwallowedPet ?? undefined,
          abominationSwallowedPet3BelugaSwallowedPet:
            petConfig.abominationSwallowedPet3BelugaSwallowedPet ?? undefined,
          abominationSwallowedPet1ParrotCopyPet:
            petConfig.abominationSwallowedPet1ParrotCopyPet ?? undefined,
          abominationSwallowedPet2ParrotCopyPet:
            petConfig.abominationSwallowedPet2ParrotCopyPet ?? undefined,
          abominationSwallowedPet3ParrotCopyPet:
            petConfig.abominationSwallowedPet3ParrotCopyPet ?? undefined,
          abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet:
            petConfig.abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet:
            petConfig.abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet:
            petConfig.abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          parrotCopyPet: petConfig.parrotCopyPet ?? undefined,
          parrotCopyPetBelugaSwallowedPet:
            petConfig.parrotCopyPetBelugaSwallowedPet ?? undefined,
          parrotCopyPetAbominationSwallowedPet1:
            petConfig.parrotCopyPetAbominationSwallowedPet1 ?? undefined,
          parrotCopyPetAbominationSwallowedPet2:
            petConfig.parrotCopyPetAbominationSwallowedPet2 ?? undefined,
          parrotCopyPetAbominationSwallowedPet3:
            petConfig.parrotCopyPetAbominationSwallowedPet3 ?? undefined,
          parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1Level:
            petConfig.parrotCopyPetAbominationSwallowedPet1Level ?? undefined,
          parrotCopyPetAbominationSwallowedPet2Level:
            petConfig.parrotCopyPetAbominationSwallowedPet2Level ?? undefined,
          parrotCopyPetAbominationSwallowedPet3Level:
            petConfig.parrotCopyPetAbominationSwallowedPet3Level ?? undefined,
          parrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet1TimesHurt ?? 0,
          parrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet2TimesHurt ?? 0,
          parrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet3TimesHurt ?? 0,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3 ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level ??
            undefined,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt ??
            0,
          parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt:
            petConfig.parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt ??
            0,
          battlesFought: petConfig.battlesFought ?? 0,
          timesHurt: petConfig.timesHurt ?? 0,
        },
        player,
      );
      pet.friendsDiedBeforeBattle = petConfig.friendsDiedBeforeBattle ?? 0;

      player.setPet(i, pet, true);
    }
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
