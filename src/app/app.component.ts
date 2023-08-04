import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';
import { Player } from './classes/player.class';
import { Pet } from './classes/pet.class';

import { LogService } from './services/log.servicee';
import { Battle } from './interfaces/battle.interface';
import { money_round } from './util/helper-functions';
import { GameService } from './services/game.service';
import { StartOfBattleService } from './services/start-of-battle.service';
import { Log } from './interfaces/log.interface';
import { AbilityService } from './services/ability.service';

import { PetService } from './services/pet.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PetSelectorComponent } from './components/pet-selector/pet-selector.component';
import { Deer } from './classes/pets/turtle/tier-4/deer.class';
import { Parrot } from './classes/pets/turtle/tier-4/parrot.class';
import { Ox } from './classes/pets/turtle/tier-3/ox.class';
import { Kangaroo } from './classes/pets/turtle/tier-2/kangaroo.class';
import { Turkey } from './classes/pets/turtle/tier-5/turkey.class';
import { ToyService } from './services/toy.service';
import { Egg } from './classes/equipment/puppy/egg.class';
import { Pie } from './classes/equipment/puppy/pie.class';
import { cloneDeep } from 'lodash';
import { Panther } from './classes/pets/puppy/tier-5/panther.class';
import { Puma } from './classes/pets/puppy/tier-6/puma.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChildren(PetSelectorComponent)
  petSelectors: QueryList<PetSelectorComponent>;

  version = '0.2.0';

  title = 'sap-calculator';
  player: Player;
  opponent: Player;
  maxTurns = 50; // TODO: Find official max turns in a battle
  turns = 0;
  battleStarted = false;

  simulationBattleAmt = 1000;
  playerWinner = 0;
  opponentWinner = 0;
  draw = 0;
  battles: Battle[] = [];
  currBattle: Battle;
  viewBattle: Battle;
  simulated = false;
  formGroup: FormGroup;
  toys: Map<number, string[]>;

  constructor(private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private petService: PetService,
    private toyService: ToyService,
    private startOfBattleService: StartOfBattleService
  ) {
    this.player = new Player(logService, abilityService, gameService);
    this.opponent = new Player(logService, abilityService, gameService);
    this.gameService.init(this.player, this.opponent);
    this.petService.init();
    this.initFormGroup();
  }

  ngOnInit(): void {
      this.toys = this.toyService.toys;
  }

  initPlayerPets(player: Player) {
    for (let i = 0; i < 5; i++) {
      player.setPet(i, this.petService.getRandomPet(player), true);
    }
  }

  initFormGroup() {
    let defaultTurn = 11;
    this.formGroup = new FormGroup({
      playerPack: new FormControl(this.player.pack),
      opponentPack: new FormControl(this.opponent.pack),
      playerToy: new FormControl(this.player.toy?.name),
      playerToyLevel: new FormControl(this.player.toy?.level ?? 1),
      opponentToy: new FormControl(this.opponent.toy?.name),
      opponentToyLevel: new FormControl(this.opponent.toy?.level ?? 1),
      turn: new FormControl(defaultTurn),
      angler: new FormControl(false),
      logFilter: new FormControl(null)
    })

    this.updatePlayerPack(this.player, this.player.pack);
    this.updatePlayerPack(this.opponent, this.opponent.pack);
    this.updatePreviousShopTier(defaultTurn);

    this.formGroup.get('playerPack').valueChanges.subscribe((value) => {
      this.updatePlayerPack(this.player, value);
    })
    this.formGroup.get('opponentPack').valueChanges.subscribe((value) => {
      this.updatePlayerPack(this.opponent, value);
    })
    this.formGroup.get('playerToy').valueChanges.subscribe((value) => {
      this.updatePlayerToy(this.player, value);
    })
    this.formGroup.get('opponentToy').valueChanges.subscribe((value) => {
      this.updatePlayerToy(this.opponent, value);
    })
    this.formGroup.get('playerToyLevel').valueChanges.subscribe((value) => {
      this.updateToyLevel(this.player, value);
    })
    this.formGroup.get('opponentToyLevel').valueChanges.subscribe((value) => {
      this.updateToyLevel(this.opponent, value);
    })
    this.formGroup.get('turn').valueChanges.subscribe((value) => {
      this.updatePreviousShopTier(value);
    })
    this.formGroup.get('angler').valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.updateSelectorPets();
      })
    })
  }

  updatePlayerPack(player: Player, pack) {
    player.pack = pack;
    let petPool;
    switch (pack) {
      case 'Turtle':
        petPool = this.petService.turtlePackPets;
        break;
      case 'Puppy':
        petPool = this.petService.puppyPackPets;
        break;
    }
    if (player == this.player) {
      this.gameService.setTierGroupPets(petPool, null);
    } else {
      this.gameService.setTierGroupPets(null, petPool);
    }
    this.randomize(player);
  }

  updateSelectorPets() {
    this.petSelectors.forEach((petSelector) => {
      petSelector.initPets();
    })
  }

  updatePlayerToy(player: Player, toy) {
    let levelControlName;
    if (player == this.player) {
      levelControlName = 'playerToyLevel';
    }
    if (player == this.opponent) {
      levelControlName = 'opponentToyLevel';
    }
    let level = this.formGroup.get(levelControlName).value;
    player.toy = this.toyService.createToy(toy, player, level);
    player.originalToy = player.toy;
  }

  updatePreviousShopTier(turn) {
    let tier = 1;
    if (turn > 2) {
      tier = 2;
    }
    if (turn > 4) {
      tier = 3;
    }
    if (turn > 6) {
      tier = 4;
    }
    if (turn > 8) {
      tier = 5;
    }
    if (turn > 10) {
      tier = 6;
    }
    this.gameService.setPreviousShopTier(tier);
  }

  updateToyLevel(player: Player, level) {
    if (player.toy) {
      player.toy.level = level;
    }
  }

  abilityCycle() {
    this.abilityService.executeHurtEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

    this.abilityService.executeFaintEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

    this.abilityService.executeKnockOutEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

    this.abilityService.executeFriendAheadFaintsEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

    this.abilityService.executeFriendFaintsEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();
    
    this.removeDeadPets();

    this.abilityService.executeSpawnEvents();
    this.abilityService.executeSummonedEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

  }

  executeFrequentEvents() {
    this.abilityService.executeFriendGainedPerkEvents();
    this.abilityService.executeFriendGainedAilmentEvents();
    this.abilityService.executeFriendlyToyBrokeEvents();
  }

  checkPetsAlive() {
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
  }

  initToys() {
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
      })
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
      })
    }
  }

  simulate() {
    this.resetSimulation();

    for (let i = 0; i < this.simulationBattleAmt; i++) {
      this.initBattle();
      this.startBattle();
      this.initToys();

      this.abilityService.initEndTurnEvents(this.player);
      this.abilityService.initEndTurnEvents(this.opponent);

      this.executeBeforeStartOfBattleEquipment();

      this.startOfBattleService.initStartOfBattleEvents();
      this.startOfBattleService.executeToyPetEvents();
      this.executeFrequentEvents();
      this.toyService.executeStartOfBattleEvents();
      this.executeFrequentEvents();
      this.startOfBattleService.executeNonToyPetEvents();
      this.executeFrequentEvents();

      this.abilityService.triggerTransformEvents(this.player);
      this.abilityService.triggerTransformEvents(this.opponent);
      this.abilityService.executeTransformEvents();
      this.checkPetsAlive();
      if (!this.abilityService.hasAbilityCycleEvents) {
        this.removeDeadPets();
      }
      while (this.abilityService.hasAbilityCycleEvents) {
        this.abilityCycle();
      }

      this.printState();

      while (this.battleStarted) {
        this.nextTurn();
      }
      this.reset();
    }
    this.simulated = true;
  }

  removeDeadPets() {
    this.player.removeDeadPets();
    this.opponent.removeDeadPets();
  }

  startBattle() {
    this.reset();

    this.battleStarted = true;

    this.turns = 0;
    // do start of turn abilities
  }

  resetSimulation() {
    this.playerWinner = 0;
    this.opponentWinner = 0;
    this.viewBattle = null;
    this.draw = 0;
    this.battles = [];
    this.currBattle = null;
  }

  initBattle() {
    this.logService.reset();
    this.currBattle = {
      winner: 'draw',
      logs: this.logs
    }
    this.battles.push(this.currBattle);
  }

  reset() {
    this.player.resetPets();
    this.opponent.resetPets();
  }

  nextTurn() {
    let finished = false;
    let winner = null;
    this.turns++;
    if (this.turns >= this.maxTurns) {
      finished = true;
    }

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
      // draw
      this.draw++;
      finished = true;
    }

    if (finished) {
      this.endLog(winner);
      this.battleStarted = false;
      return;
    }

    this.pushPetsForwards();

    this.doBeforeAttackEquipment();
    while(this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }

    this.pushPetsForwards();

    this.fight();
    
    this.abilityCycle();

    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }
    this.printState();
  }

  executeBeforeStartOfBattleEquipment() {
    for (let pet of this.player.petArray) {
      let multiplier = 1;
      let pantherMessage = '';
      if (pet instanceof Panther) {
        multiplier = pet.level + 1;
        pantherMessage = ` x${multiplier} (Panther)`;
      }
      if (pet.equipment instanceof Pie) {
        pet.increaseAttack(4 * multiplier);
        pet.increaseHealth(4 * multiplier);
        this.logService.createLog({
          message: `${pet.name} gained ${4 * multiplier} attack and ${4 * multiplier} health (Pie)${pantherMessage}`,
          type: 'equipment',
          player: this.player
        })
      }
      // if pancake
    }
  }

  pushPetsForwards() {
    let turnOne = this.turns == 1;
    if (turnOne && this.player.pet0 && this.opponent.pet0) {
      return;
    }

    this.player.pushPetsForward();
    this.opponent.pushPetsForward();
  }

  doBeforeAttackEquipment() {
    let playerPet = this.player.pet0;
    let opponentPet = this.opponent.pet0;

    let playerEquipment = playerPet.equipment;
    let opponentEquipment = opponentPet.equipment;

    if (playerEquipment instanceof Egg) {
      this.abilityService.setEqiupmentBeforeAttackEvent({
        callback: () => { playerEquipment.attackCallback(playerPet, opponentPet) },
        priority: playerPet.attack,
        player: this.player
      })
    }

    if (opponentEquipment instanceof Egg) {
      this.abilityService.setEqiupmentBeforeAttackEvent({
        callback: () => { opponentEquipment.attackCallback(opponentPet, playerPet) },
        priority: opponentPet.attack,
        player: this.opponent
      })
    }

    this.abilityService.executeEqiupmentBeforeAttackEvents();

    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
    
  }

  fight() {
    let playerPet = this.player.pet0;
    let opponentPet = this.opponent.pet0;

    // before attack events
    if (playerPet.beforeAttack) {
      this.abilityService.setBeforeAttackEvent({
        callback: playerPet.beforeAttack.bind(playerPet),
        priority: playerPet.attack,
        player: this.player
      })
    }

    if (opponentPet.beforeAttack) {
      this.abilityService.setBeforeAttackEvent({
        callback: opponentPet.beforeAttack.bind(opponentPet),
        priority: opponentPet.attack,
        player: this.opponent
      })
    }

    this.abilityService.executeBeforeAttackEvents();

    // console.log(playerPet, 'vs', opponentPet)

    playerPet.attackPet(opponentPet);
    opponentPet.attackPet(playerPet);

    playerPet.useAttackDefenseEquipment();
    opponentPet.useAttackDefenseEquipment();

    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();

    this.abilityService.executeAfterAttackEvents();
    this.abilityService.executeFriendAheadAttacksEvents();
  }

  endLog(winner?: Player) {
    let message;
    if (winner == null) {
      message = 'Draw';
    } else if (winner == this.player) {
      message = 'Player is the winner';
    } else {
      message = 'Opponent is the winner'
    }
    this.logService.createLog({
      message: message,
      type: 'board'
    })
  }

  get logs() {
    return this.logService.getLogs();
  }


  printState() {
    let playerState = '';
    playerState += this.getPetText(this.player.pet4);
    playerState += this.getPetText(this.player.pet3);
    playerState += this.getPetText(this.player.pet2);
    playerState += this.getPetText(this.player.pet1);
    playerState += this.getPetText(this.player.pet0);
    let opponentState = '';
    opponentState += this.getPetText(this.opponent.pet0);
    opponentState += this.getPetText(this.opponent.pet1);
    opponentState += this.getPetText(this.opponent.pet2);
    opponentState += this.getPetText(this.opponent.pet3);
    opponentState += this.getPetText(this.opponent.pet4);

    this.logService.createLog({
      message: `${playerState}| ${opponentState}`,
      type: 'board'
    });
    
  }

  getPetText(pet?: Pet) {
    if (pet == null) {
      return '___ (-/-) ';
    }
    let abbrev = pet.name.substring(0, 3);
    // return `${abbrev}${pet.equipment ? `<${pet.equipment.name.substring(0,2)}>` : ''} (${pet.attack}/${pet.health}) `;
    return `${abbrev} (${pet.attack}/${pet.health}) `;
  }

  setViewBattle(battle: Battle) {
    this.viewBattle = battle;
  }

  getViewBattleLogs() {
    return this.viewBattle?.logs ?? [];
  }

  getDrawWidth() {
    return `${(this.losePercent + this.drawPercent)}%`;
  }

  getLoseWidth() {
    return `${this.losePercent}%`;
  }

  getPlayerClass(log: Log) {
    if (log.player == null) {
      return 'log';
    }
    if (log.player == this.player) {
      return 'log-player';
    } else {
      return 'log-opponent'
    }
  }

  getRandomEvents(battle: Battle) {
    let events = ""
    let randomLogs = battle.logs.filter((log) => {return log.randomEvent == true});
    for (let log of randomLogs) {
      events += log.message;
      if (log != randomLogs[randomLogs.length - 1]) {
        events += '\n';
      }
    }
    return events;
  }

  /**
   * Randomizes both player and opponent if no player is provided.
   * @param player 
   */
  randomize(player?: Player) {
    if (player) {
      this.initPlayerPets(player);
    } else {
      this.initPlayerPets(this.player);
      this.initPlayerPets(this.opponent);
    }
    setTimeout(() => {
      this.petSelectors.forEach(selector => {
        selector.initSelector();
      })
    })
  }

  get filteredBattles() {
    return this.battles.filter(battle => {
      let filter = this.formGroup.get('logFilter').value;
      if (filter == null) {
        return true;
      }
      return battle.winner == filter;
    })
  }

  get winPercent() {
    return money_round(this.playerWinner / this.simulationBattleAmt * 100);
  }

  get drawPercent() {
    return money_round(this.draw / this.simulationBattleAmt * 100);
  }

  get losePercent() {
    return money_round(this.opponentWinner / this.simulationBattleAmt * 100);
  }
}
