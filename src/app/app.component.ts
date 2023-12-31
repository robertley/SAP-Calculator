import { Component, ViewChildren, QueryList, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Player } from './classes/player.class';
import { Pet } from './classes/pet.class';

import { LogService } from './services/log.servicee';
import { Battle } from './interfaces/battle.interface';
import { createPack, money_round } from './util/helper-functions';
import { GameService } from './services/game.service';
import { StartOfBattleService } from './services/start-of-battle.service';
import { Log } from './interfaces/log.interface';
import { AbilityService } from './services/ability.service';

import { PetService } from './services/pet.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PetSelectorComponent } from './components/pet-selector/pet-selector.component';
import { ToyService } from './services/toy.service';
import { Pie } from './classes/equipment/puppy/pie.class';
import { shuffle } from 'lodash';
import { Panther } from './classes/pets/puppy/tier-5/panther.class';
import { Puma } from './classes/pets/puppy/tier-6/puma.class';
import { Pancakes } from './classes/equipment/puppy/pancakes.class';
import { ChocolateCake } from './classes/equipment/golden/chocolate-cake.class';
import { Eggplant } from './classes/equipment/golden/eggplant.class';
import { PitaBread } from './classes/equipment/golden/pita-bread.class';
import { LocalStorageService } from './services/local-storage.service';
import { Modal } from 'bootstrap';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { EquipmentService } from './services/equipment.service';
import { Nest } from './classes/pets/hidden/nest.class';
import { Egg } from './classes/equipment/puppy/egg.class';
import { Fig } from './classes/equipment/golden/fig.class';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChildren(PetSelectorComponent)
  petSelectors: QueryList<PetSelectorComponent>;

  @ViewChild('customPackEditor')
  customPackEditor: ElementRef;

  version = '0.5.15';
  sapVersion = '0.31.9-145 BETA'

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
  customPackEditorModal: Modal;

  previousPackPlayer = null;
  previousPackOpponent = null;

  constructor(private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private equipmentService: EquipmentService,
    private petService: PetService,
    private toyService: ToyService,
    private startOfBattleService: StartOfBattleService,
    private localStorageService: LocalStorageService
  ) {
    this.player = new Player(logService, abilityService, gameService);
    this.opponent = new Player(logService, abilityService, gameService);
    this.gameService.init(this.player, this.opponent);
    this.petService.init();
    this.initFormGroup();
    this.loadLocalStorage();
    this.initApp();
  }

  printFormGroup() {
    console.log(this.formGroup)
  }

  ngOnInit(): void {
    this.toys = this.toyService.toys;
  }

  ngAfterViewInit(): void {
    this.initModals();
  }

  loadLocalStorage() {
    let localStorage = this.localStorageService.getStorage();

    if (localStorage) {
      try {
        // all fields except for customPacks
        let localStorage = JSON.parse(this.localStorageService.getStorage());
        this.loadCalculatorFromValue(localStorage);
      } catch (e) {
        console.log('error loading local storage', e)
        this.localStorageService.clearStorage();
      }

    }
  }

  loadCalculatorFromValue(calculator) {
    let customPacks = calculator.customPacks;
    calculator.customPacks = [];
    this.formGroup.patchValue(calculator, {emitEvent: false});
    this.loadCustomPacks(customPacks);
    this.gameService.gameApi.oldStork = this.formGroup.get('oldStork').value;
  }

  initApp() {
    this.petService.buildCustomPackPets(this.formGroup.get('customPacks') as FormArray);
    this.setFontSize();
    this.initPlayerPets();
    this.updatePlayerPack(this.player, this.formGroup.get('playerPack').value, false);
    this.updatePlayerPack(this.opponent, this.formGroup.get('opponentPack').value, false);
    this.updatePlayerToy(this.player, this.formGroup.get('playerToy').value);
    this.updatePlayerToy(this.opponent, this.formGroup.get('opponentToy').value);
    this.previousPackOpponent = this.opponent.pack;
    this.previousPackPlayer = this.player.pack;
  }

  loadCustomPacks(customPacks) {
    let formArray = new FormArray([]);
    for (let customPack of customPacks) {
      let formGroup = createPack(customPack);
      formArray.push(formGroup);
    }
    this.formGroup.setControl('customPacks', formArray);
  }

  initPlayerPets() {
    for (let i = 0; i < 5; i++) {
      let petForm = (this.formGroup.get('playerPets') as FormArray).controls[i] as FormGroup;
      if (petForm.get('name').value == null) {
        continue;
      }
      let pet = this.petService.createPet(petForm.value, this.player);
      this.player.setPet(i, pet, true);
    }
    for (let i = 0; i < 5; i++) {
      let petForm = (this.formGroup.get('opponentPets') as FormArray).controls[i] as FormGroup;
      if (petForm.get('name').value == null) {
        continue;
      }
      let pet = this.petService.createPet(petForm.value, this.opponent);
      this.opponent.setPet(i, pet, true);
    }
  }

  randomizePlayerPets(player: Player) {
    for (let i = 0; i < 5; i++) {
      player.setPet(i, this.petService.getRandomPet(player), true);
    }
  }

  makeFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  initFormGroup() {    
    let petsDummyArray = [0,1,2,3,4]
    let defaultTurn = 11;
    let defaultGoldSpent = 10;

    this.updatePreviousShopTier(defaultTurn);
    this.updateGoldSpent(defaultGoldSpent, defaultGoldSpent);

    this.formGroup = new FormGroup({
      playerPack: new FormControl(this.player.pack),
      opponentPack: new FormControl(this.opponent.pack),
      playerToy: new FormControl(this.player.toy?.name),
      playerToyLevel: new FormControl(this.player.toy?.level ?? 1),
      opponentToy: new FormControl(this.opponent.toy?.name),
      opponentToyLevel: new FormControl(this.opponent.toy?.level ?? 1),
      turn: new FormControl(defaultTurn),
      playerGoldSpent: new FormControl(defaultGoldSpent),
      opponentGoldSpent: new FormControl(defaultGoldSpent),
      angler: new FormControl(false),
      allPets: new FormControl(false),
      logFilter: new FormControl(null),
      playerPets: new FormArray([]),
      opponentPets: new FormArray([]),
      fontSize: new FormControl(13),
      customPacks: new FormArray([]),
      oldStork: new FormControl(false),
    })

    this.initPetForms();

    this.formGroup.get('playerPack').valueChanges.subscribe((value) => {
      if (value == 'Add Custom Pack') { 
        this.openCustomPackEditor();
        return;
      }
      this.previousPackPlayer = value;
      this.updatePlayerPack(this.player, value);
    })
    this.formGroup.get('opponentPack').valueChanges.subscribe((value) => {
      if (value == 'Add Custom Pack') { 
        this.openCustomPackEditor();
        return;
      }
      this.previousPackOpponent = value;
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
    this.formGroup.get('playerGoldSpent').valueChanges.subscribe((value) => {
      this.updateGoldSpent(value, null);
    })
    this.formGroup.get('opponentGoldSpent').valueChanges.subscribe((value) => {
      this.updateGoldSpent(null, value);
    })
    this.formGroup.get('angler').valueChanges.subscribe((value) => {
      setTimeout(() => {
        this.updateSelectorPets();
      })
    })
    this.formGroup.get('oldStork').valueChanges.subscribe((value) => {
      this.gameService.gameApi.oldStork = value;
    });
  }

  initPetForms() {
    let petsDummyArray = [0,1,2,3,4];
    let playerPetFormGroups = petsDummyArray.map(foo => {
        return new FormGroup({
          name: new FormControl(this.player[`pet${foo}`]?.name),
          attack: new FormControl(this.player[`pet${foo}`]?.attack ?? 0),
          health: new FormControl(this.player[`pet${foo}`]?.health ?? 0),
          exp: new FormControl(this.player[`pet${foo}`]?.exp ?? 0),
          equipment: new FormControl(this.player[`pet${foo}`]?.equipment),
          belugaSwallowedPet: new FormControl(this.player[`pet${foo}`]?.belugaSwallowedPet)
        })
      }
    );
    let playerFormArray = this.formGroup.get('playerPets') as FormArray;
    playerFormArray.clear();
    for (let formGroup of playerPetFormGroups) {
      playerFormArray.push(formGroup);
    }
    let opponentFormGroups = petsDummyArray.map(foo => {
        return new FormGroup({
          name: new FormControl(this.opponent[`pet${foo}`]?.name),
          attack: new FormControl(this.opponent[`pet${foo}`]?.attack ?? 0),
          health: new FormControl(this.opponent[`pet${foo}`]?.health ?? 0),
          exp: new FormControl(this.opponent[`pet${foo}`]?.exp ?? 0),
          equipment: new FormControl(this.opponent[`pet${foo}`]?.equipment),
          belugaSwallowedPet: new FormControl(this.opponent[`pet${foo}`]?.belugaSwallowedPet)
        })
      }
    );
    let opponentFormArray = this.formGroup.get('opponentPets') as FormArray;
    opponentFormArray.clear();
    for (let formGroup of opponentFormGroups) {
      opponentFormArray.push(formGroup);
    }
  }

  getPlayerPetsFormArray(): AbstractControl[] {
    return Array.from((this.formGroup.get('playerPets') as FormArray).controls).reverse()
  }
  getOpponentPetsFormArray(): AbstractControl[] {
    return Array.from((this.formGroup.get('opponentPets') as FormArray).controls)
  }

  updatePlayerPack(player: Player, pack, randomize = true) {
    player.pack = pack;
    let petPool;
    switch (pack) {
      case 'Turtle':
        petPool = this.petService.turtlePackPets;
        break;
      case 'Puppy':
        petPool = this.petService.puppyPackPets;
        break;
      case 'Star':
        petPool = this.petService.starPackPets;
        break;
      case 'Golden':
        petPool = this.petService.goldenPackPets;
        break;
      default:
        petPool = this.petService.playerCustomPackPets.get(pack);
        break;
    }
    if (player == this.player) {
      this.gameService.setTierGroupPets(petPool, null);
    } else {
      this.gameService.setTierGroupPets(null, petPool);
    }
    if (randomize) {
      this.randomize(player);
    }
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
    this.gameService.setTurnNumber(turn);
  }

  updateGoldSpent(player, opponent) {
    this.gameService.setGoldSpent(player, opponent);
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

    this.abilityService.executeFriendHurtEvents();
    this.executeFrequentEvents();
    this.checkPetsAlive();

    this.abilityService.executeEnemyHurtEvents();
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
    
    // this might cause an issue with door head ant
    // probably just move the functions in here that trigger the empty front space events
    this.removeDeadPets();

    this.abilityService.executeSpawnEvents();
    this.abilityService.executeSummonedEvents();
    this.abilityService.executeEnemySummonedEvents();

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
    this.localStorageService.setFormStorage(this.formGroup);

    this.resetSimulation();

    this.setAbilityEquipments(this.player);
    this.setAbilityEquipments(this.opponent);

    for (let i = 0; i < this.simulationBattleAmt; i++) {
      this.initBattle();
      this.startBattle();
      this.initToys();

      this.abilityService.initEndTurnEvents(this.player);
      this.abilityService.initEndTurnEvents(this.opponent);

      this.player.onionCheck();
      this.opponent.onionCheck();

      this.executeBeforeStartOfBattleEquipment(this.player);
      this.executeBeforeStartOfBattleEquipment(this.opponent);

      this.startOfBattleService.initStartOfBattleEvents();
      this.startOfBattleService.executeToyPetEvents();
      this.executeFrequentEvents();
      this.toyService.executeStartOfBattleEvents();
      this.executeFrequentEvents();
      this.startOfBattleService.executeNonToyPetEvents();
      this.executeFrequentEvents();

      this.abilityService.executeSummonedEvents();
      this.abilityService.executeEnemySummonedEvents();
      
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
      this.removeDeadPets();

      this.pushPetsForwards();

      this.logService.printState(this.player, this.opponent);
      
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

    if (this.player.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.player);
    }

    if (this.opponent.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.opponent);
    }

    this.abilityService.executeEmptyFrontSpaceEvents();
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
    this.checkPetsAlive();
    this.removeDeadPets();

    if (!this.player.alive() || !this.opponent.alive()) {
      return;
    }

    this.pushPetsForwards();

    let chocoCakeCheck = this.chocolateCakePresent();
    if (chocoCakeCheck.cake) {
      this.doChocolateCakeEvents(chocoCakeCheck);
    } else {
      this.fight();
    }
    
    this.abilityCycle();

    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }
    
    this.player.checkGoldenSpawn();
    this.opponent.checkGoldenSpawn();

    this.logService.printState(this.player, this.opponent);
  }

  chocolateCakePresent(): {player: boolean, opponent: boolean, cake: boolean} {
    let resp = {
      player: false,
      opponent: false,
      cake: false
    }
    resp.player = this.player.pet0?.equipment instanceof ChocolateCake;
    resp.opponent = this.opponent.pet0?.equipment instanceof ChocolateCake;
    resp.cake = resp.player || resp.opponent;
    return resp;
  }

  doChocolateCakeEvents(chocoCakeCheck: {player: boolean, opponent: boolean, cake: boolean}) {
    let chocoCakePets = [];
    if (chocoCakeCheck.player) {
      chocoCakePets.push(this.player.pet0);
    }
    if (chocoCakeCheck.opponent) {
      chocoCakePets.push(this.opponent.pet0);
    }
    // shuffle incase they have same priority
    chocoCakePets = shuffle(chocoCakePets);
    chocoCakePets.sort((a, b) => {
      return a.attack < b.attack ? 1 : b.attack < a.attack ? -1 : 0;
    });
    for (let pet of chocoCakePets) {
      pet.equipment.callback(pet);
    }
  }
  setAbilityEquipments(player) {
    for (let pet of player.petArray) {
      if (pet.equipment instanceof Eggplant) {
        pet.equipment.callback(pet);
        pet.eggplantTouched = true;
      }
      if (pet.equipment instanceof PitaBread) {
        pet.equipment.callback(pet);
      }
      if (pet.equipment?.equipmentClass == 'startOfBattle') {
        pet.equipment.callback(pet);
      }
    }
  }

  executeBeforeStartOfBattleEquipment(player) {
    for (let pet of player.petArray) {
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
          player: player
        })
      }
      if (pet.equipment instanceof Pancakes) {
        for (let pett of player.petArray) {
          if (pet == pett) {
            continue;
          }
          pett.increaseAttack(2 * multiplier);
          pett.increaseHealth(2 * multiplier);
          this.logService.createLog({
            message: `${pett.name} gained ${2 * multiplier} attack and ${2 * multiplier} health (Pancake)${pantherMessage}`,
            type: 'equipment',
            player: player
          })
        }
      }
    }
  }

  pushPetsForwards() {
    let turnOne = this.turns == 1;
    if (turnOne && this.player.pet0 && this.opponent.pet0) {
      return;
    }

    this.player.pushPetsForward();
    this.opponent.pushPetsForward();

    this.player.onionCheck();
    this.opponent.onionCheck();
  }

  doBeforeAttackEquipment() {
    let playerPet = this.player.pet0;
    let opponentPet = this.opponent.pet0;

    let playerEquipment = playerPet.equipment;
    let opponentEquipment = opponentPet.equipment;

    if (playerEquipment?.equipmentClass == 'snipe') {
      let amt = 1;
      if (playerPet instanceof Nest && playerEquipment instanceof Egg) {
        amt = playerPet.level;
      }
      for (let i = 0; i < amt; i++) {
        this.abilityService.setEqiupmentBeforeAttackEvent({
          callback: () => { playerEquipment.attackCallback(playerPet, opponentPet) },
          priority: playerPet.attack,
          player: this.player
        })
      }
    }

    if (opponentEquipment?.equipmentClass == 'snipe') {
      let amt = 1;
      if (opponentPet instanceof Nest && opponentEquipment instanceof Egg) {
        amt = opponentPet.level;
      }
      for (let i = 0; i < amt; i++) {
        this.abilityService.setEqiupmentBeforeAttackEvent({
          callback: () => { opponentEquipment.attackCallback(opponentPet, playerPet) },
          priority: opponentPet.attack,
          player: this.opponent
        })
      }
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
    this.abilityService.executeFriendAttacksEvents();
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
    console.log('randomize', player)
    if (player) {
      this.randomizePlayerPets(player);
    } else {
      this.randomizePlayerPets(this.player);
      this.randomizePlayerPets(this.opponent);
    }
    if (this.formGroup) {
      this.initPetForms();
    }
    setTimeout(() => {
      this.petSelectors.forEach(selector => {
        selector.initSelector();
      })
    })
  }

  zoomIn() {
    this.formGroup.get('fontSize').setValue(Math.min(this.formGroup.get('fontSize').value + 1, 20));
    this.setFontSize();
  }

  zoomOut() {
    this.formGroup.get('fontSize').setValue(Math.max(this.formGroup.get('fontSize').value - 1, 8));
    this.setFontSize();
  }

  setFontSize() {
    // grab root html element and change the font size
    document.documentElement.style.fontSize = `${this.formGroup.get('fontSize').value}px`;
  }

  clearCache() {
    this.localStorageService.clearStorage();
    alert('Cache cleared. Refresh page to see changes.');
  }

  initModals() {
    this.customPackEditorModal = new Modal(this.customPackEditor.nativeElement);
    this.customPackEditor.nativeElement.addEventListener('hidden.bs.modal', (event) => {
      // this.formGroup.get('playerPack').setValue(this.previousPackPlayer, {emitEvent: false});
      // this.formGroup.get('opponentPack').setValue(this.previousPackOpponent, {emitEvent: false});
    })
  }

  openCustomPackEditor() {
    this.customPackEditorModal.show();
    this.formGroup.get('playerPack').setValue(this.previousPackPlayer, {emitEvent: false});
    this.formGroup.get('opponentPack').setValue(this.previousPackOpponent, {emitEvent: false});
  }

  drop(event: CdkDragDrop<string[]>, playerString: string) {
    let previousIndex = event.previousIndex;
    let currentIndex = event.currentIndex;
    let player = this.opponent;
    if (playerString == 'player') {
      // since the array is reversed, we need to revers the indexes
      previousIndex = 4 - previousIndex;
      currentIndex = 4 - currentIndex; 
      player = this.player;
    }
    moveItemInArray((this.formGroup.get(`${playerString}Pets`) as FormArray).controls, previousIndex, currentIndex);
    
    let pets = player.petArray;
    moveItemInArray(pets, previousIndex, currentIndex);
    player.setPet(0, pets[0], true);
    player.setPet(1, pets[1], true);
    player.setPet(2, pets[2], true);
    player.setPet(3, pets[3], true);
    player.setPet(4, pets[4], true);
  
  }

  resetPlayer(player: 'player' | 'opponent') {
    let petSelectors = this.petSelectors.toArray().slice(player == 'player' ? 0 : 5, player == 'player' ? 5 : 10);
    for (let petSelector of petSelectors) {
      petSelector.removePet();
    }
  }

  export() {
    // fizes strange bug of export failing on load
    // fixes strange bug with circular dependency
    this.simulate();
    
    let calc = JSON.stringify(this.formGroup.value);
    // copy to clipboard
    navigator.clipboard.writeText(calc).then(() => {
      alert('Copied to clipboard');
    })
  }

  import(importVal): boolean {
    let success = false;
    let calculator = JSON.parse(importVal);
    try {
      this.loadCalculatorFromValue(calculator);
      this.initApp();
      this.petSelectors.forEach((petSelector) => {
        petSelector.fixLoadEquipment();
      })
      success = true;
    } catch (e) {
      console.error(e);
      // acceptable faliure
    }
    return success;
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

  get validCustomPacks() {
    // get all formGroups in formArray that are valid
    let formArray = this.formGroup.get('customPacks') as FormArray;
    let validFormGroups = [];
    for (let formGroup of formArray.controls) {
      if (formGroup.valid) {
        validFormGroups.push(formGroup);
      }
    }
    return validFormGroups;
  }
}
