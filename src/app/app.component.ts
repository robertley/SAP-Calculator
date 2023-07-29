import { Component } from '@angular/core';
import { Player } from './classes/player.class';
import { Pet } from './classes/pet.class';
import { Ant } from './classes/pets/turtle/tier-1/ant.class';
import { Cricket } from './classes/pets/turtle/tier-1/cricket.class';
import { Fish } from './classes/pets/turtle/tier-1/fish.class';
import { Horse } from './classes/pets/turtle/tier-1/horse.class';
import { Mosquito } from './classes/pets/turtle/tier-1/mosquito.class';
import { cloneDeep } from 'lodash';
import { LogService } from './services/log.servicee';
import { Battle } from './interfaces/battle.interface';
import { money_round } from './util/helper-functions';
import { GameService } from './services/game.service';
import { StartOfBattleService } from './services/start-of-battle.service';
import { Log } from './interfaces/log.interface';
import { AbilityService } from './services/ability.service';
import { Tiger } from './classes/pets/turtle/tier-6/tiger.class';
import { Duck } from './classes/pets/turtle/tier-1/duck.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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

  constructor(private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private startOfBattleService: StartOfBattleService
  ) {
    this.player = new Player(logService, abilityService);
    this.opponent = new Player(logService, abilityService);
    this.initPlayerPets(this.player);
    this.initPlayerPets(this.opponent);
    this.gameService.init(this.player, this.opponent);

    console.log(this)
  }

  initPlayerPets(player: Player) {
    player.setPet(0, new Ant(this.logService, this.abilityService, player), true);
    player.setPet(1, new Duck(this.logService, this.abilityService, player), true);
    player.setPet(2, new Tiger(this.logService, this.abilityService, player), true);
    player.setPet(3, new Horse(this.logService, this.abilityService, player), true);
    player.setPet(4, new Mosquito(this.logService, this.abilityService, player), true);
  }

  abilityCycle() {
    this.abilityService.executeHurtEvents();
    this.abilityService.executeFaintEvents();
    this.abilityService.executeFriendAheadFaintsEvents();
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
    this.removeDeadPets();
    this.abilityService.executeSpawnEvents();
    this.abilityService.executeSummonedEvents();
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
  }

  simulate() {
    this.resetSimulation();
    for (let i = 0; i < this.simulationBattleAmt; i++) {
      this.initBattle();
      this.startBattle();

      this.startOfBattleService.initStartOfBattleEvents();
      this.player.checkPetsAlive();
      this.opponent.checkPetsAlive();
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
      this.currBattle.winner = 'opponet';
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
    this.fight();
    
    this.abilityCycle();

    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }
    this.printState();
  }

  pushPetsForwards() {
    let turnOne = this.turns == 1;
    if (turnOne && this.player.pet0 && this.opponent.pet0) {
      return;
    }

    this.player.pushPetsForward();
    this.opponent.pushPetsForward();
  }

  fight() {
    let playerPet = this.player.pet0;
    let opponentPet = this.opponent.pet0;

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
