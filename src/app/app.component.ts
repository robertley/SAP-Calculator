import { Component, ViewChildren, QueryList, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Player } from './classes/player.class';
import { Pet } from './classes/pet.class';

import { LogService } from './services/log.service';
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
import { cloneDeep, pickBy, shuffle } from 'lodash';
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
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Dazed } from './classes/equipment/ailments/dazed.class';
import { Rambutan } from './classes/equipment/unicorn/rambutan.class';
import { LovePotion } from './classes/equipment/unicorn/love-potion.class';
import { FairyDust } from './classes/equipment/unicorn/fairy-dust.class';
import { GingerbreadMan } from './classes/equipment/unicorn/gingerbread-man.class';
import { HealthPotion } from './classes/equipment/unicorn/health-potion.class';
import { Cherry } from './classes/equipment/golden/cherry.class';

const DAY = '#85ddf2';
const NIGHT = '#33377a';

// TODO
// Weak as equipment option
// parrot copy abomination log bug?
// move turn to not advanced?
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('dayNight', [
      state('day', style({
        backgroundColor: DAY
      })),
      state('night', style({
        backgroundColor: NIGHT
      })),
      transition('day <=> night', [
        animate('0.5s')
      ])
    ])
  ]
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChildren(PetSelectorComponent)
  petSelectors: QueryList<PetSelectorComponent>;

  @ViewChild('customPackEditor')
  customPackEditor: ElementRef;

  version = '0.6.15';
  sapVersion = '0.33.3-156 BETA'
  lastUpdated = '8/11/2025';

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

  dayNight = true;

  api = false;
  apiResponse = null;

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
    this.initGameApi();
    this.setDayNight();

    // get the end of url
    let url = window.location.href;
    let urlSplit = url.split('/');
    let lastUrl = urlSplit[urlSplit.length - 1];
    let code = decodeURIComponent((lastUrl + '').replace(/\+/g, '%20'));;
    // remove ?code= from string
    code = code.replace('?code=', '');
    if (code) {
      this.api = true;
      this.loadCalculatorFromValue(JSON.parse(code));
      this.simulate();
      this.buildApiResponse();
    }
    
  }

  buildApiResponse() {
    let repsonse = {
      playerWins: this.playerWinner,
      opponentWins: this.opponentWinner,
      draws: this.draw,
    }

    // set api response to stringified version of object with whitespace
    this.apiResponse = JSON.stringify(repsonse, null);
  }

  printFormGroup() {
    console.log(this.formGroup)
  }

  ngOnInit(): void {
    this.toys = this.toyService.toys;
  }

  ngAfterViewInit(): void {
    if (!this.api) {
      this.initModals();
    }
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
    // this.formGroup.reset();
    let customPacks = calculator.customPacks;
    calculator.customPacks = [];
    this.loadCustomPacks(customPacks);
    this.formGroup.patchValue(calculator, {emitEvent: false});

    // if (!this.api) {
    //   for (let selector of this.petSelectors.toArray()) {
    //     selector.substitutePet();
    //   }
    // }


    // band aid for weird bug where the select switches to turtle when pack already exists
    setTimeout(() => {
      this.fixCustomPackSelect();
    })
    this.gameService.gameApi.oldStork = this.formGroup.get('oldStork').value;
    this.gameService.gameApi.komodoShuffle = this.formGroup.get('komodoShuffle').value;
    this.gameService.gameApi.mana = this.formGroup.get('mana').value;
    this.gameService.gameApi.playerRollAmount = this.formGroup.get('playerRollAmount').value;
    this.gameService.gameApi.opponentRollAmount = this.formGroup.get('opponentRollAmount').value;
    this.gameService.gameApi.playerLevel3Sold = this.formGroup.get('playerLevel3Sold').value;
    this.gameService.gameApi.opponentLevel3Sold = this.formGroup.get('opponentLevel3Sold').value;
    this.gameService.gameApi.playerSummonedAmount = this.formGroup.get('playerSummonedAmount').value;
    this.gameService.gameApi.opponentSummonedAmount = this.formGroup.get('opponentSummonedAmount').value;
    this.gameService.gameApi.day = this.dayNight;
    this.gameService.gameApi.turnNumber = this.formGroup.get('turn').value;
  }

  setDayNight() {
    let turn = this.formGroup.get('turn').value;
    let day = turn % 2 == 1;
    this.dayNight = day;
    this.gameService.gameApi.day = day;

  }

  fixCustomPackSelect() {
    this.formGroup.get('playerPack').setValue(this.formGroup.get('playerPack').value, {emitEvent: false});
    this.formGroup.get('opponentPack').setValue(this.formGroup.get('opponentPack').value, {emitEvent: false});
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

  initGameApi() {
    this.gameService.gameApi.day = this.dayNight;
    this.gameService.gameApi.oldStork = this.formGroup.get('oldStork').value;
    this.gameService.gameApi.komodoShuffle = this.formGroup.get('komodoShuffle').value;
    this.gameService.gameApi.mana = this.formGroup.get('mana').value;
    this.gameService.gameApi.playerRollAmount = this.formGroup.get('playerRollAmount').value;
    this.gameService.gameApi.opponentRollAmount = this.formGroup.get('opponentRollAmount').value;
    this.gameService.gameApi.playerLevel3Sold = this.formGroup.get('playerLevel3Sold').value;
    this.gameService.gameApi.opponentLevel3Sold = this.formGroup.get('opponentLevel3Sold').value;
    this.gameService.gameApi.playerSummonedAmount = this.formGroup.get('playerSummonedAmount').value;
    this.gameService.gameApi.opponentSummonedAmount = this.formGroup.get('opponentSummonedAmount').value;
  }

  loadCustomPacks(customPacks) {
    let formArray = this.formGroup.get('customPacks') as FormArray;
    formArray.clear();
    for (let customPack of customPacks) {
      let formGroup = createPack(customPack);
      formArray.push(formGroup);
    }
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
      tokenPets: new FormControl(false),
      komodoShuffle: new FormControl(false),
      mana: new FormControl(false),
      playerRollAmount: new FormControl(4),
      opponentRollAmount: new FormControl(4),
      playerLevel3Sold: new FormControl(0),
      opponentLevel3Sold: new FormControl(0),
      playerSummonedAmount: new FormControl(0),
      opponentSummonedAmount: new FormControl(0),
      showAdvanced: new FormControl(false),
      ailmentEquipment: new FormControl(false),
    })

    this.initPetForms();

    this.formGroup.get('playerPack').valueChanges.subscribe((value) => {
      // happens on import
      if (value == null) {
        return;
      }

      if (value == 'Add Custom Pack') { 
        this.openCustomPackEditor();
        return;
      }
      this.previousPackPlayer = value;
      this.updatePlayerPack(this.player, value);
    })
    this.formGroup.get('opponentPack').valueChanges.subscribe((value) => {
      // happens on import
      if (value == null) {
        return;
      }

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
      this.setDayNight();
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
    this.formGroup.get('komodoShuffle').valueChanges.subscribe((value) => {
      this.gameService.gameApi.komodoShuffle = value;
    });
    this.formGroup.get('mana').valueChanges.subscribe((value) => {
      this.gameService.gameApi.mana = value;
    });
    this.formGroup.get('playerRollAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.playerRollAmount = value;
      console.log('playerRollAmount', value)
    });
    this.formGroup.get('opponentRollAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.opponentRollAmount = value;
      console.log('opponentRollAmount', value)
    });
    this.formGroup.get('playerLevel3Sold').valueChanges.subscribe((value) => {
      this.gameService.gameApi.playerLevel3Sold = value;
    });
    this.formGroup.get('opponentLevel3Sold').valueChanges.subscribe((value) => {
      this.gameService.gameApi.opponentLevel3Sold = value;
    });
    this.formGroup.get('playerSummonedAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.playerSummonedAmount = value;
    });
    this.formGroup.get('opponentSummonedAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.opponentSummonedAmount = value;
    });
  }

  toggleAdvanced() {
    let advanced = this.formGroup.get('showAdvanced').value;
    this.formGroup.get('showAdvanced').setValue(!advanced);
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
          belugaSwallowedPet: new FormControl(this.player[`pet${foo}`]?.belugaSwallowedPet),
          mana: new FormControl(this.player[`pet${foo}`]?.mana ?? 0),
          abominationSwallowedPet1: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet1),
          abominationSwallowedPet2: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet2),
          abominationSwallowedPet3: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet3),
          battlesFought: new FormControl(this.player[`pet${foo}`]?.battlesFought ?? 0),
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
          belugaSwallowedPet: new FormControl(this.opponent[`pet${foo}`]?.belugaSwallowedPet),
          mana: new FormControl(this.opponent[`pet${foo}`]?.mana ?? 0),
          abominationSwallowedPet1: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet1),
          abominationSwallowedPet2: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet2),
          abominationSwallowedPet3: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet3),
          battlesFought: new FormControl(this.opponent[`pet${foo}`]?.battlesFought ?? 0),
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
      case 'Unicorn':
        petPool = this.petService.unicornPackPets;
        break;
      default:
        petPool = this.petService.playerCustomPackPets.get(pack);
        break;
    }
    // console.log('petPool', petPool)
    if (player == this.player) {
      this.gameService.setTierGroupPets(petPool, null);
    } else {
      this.gameService.setTierGroupPets(null, petPool);
    }
    // if on all pets do nothing
    if (this.formGroup.get('allPets').value) {
      return;
    }
    if (randomize) {
      // this.randomize(player);
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
    // First, add all existing events from type-specific arrays to global queue
    this.abilityService.migrateExistingEventsToQueue();
    
    // Process all events in priority order until queue is empty
    while (this.abilityService.hasGlobalEvents) {
      const nextEvent = this.abilityService.peekNextHighestPriorityEvent();
      
      if (nextEvent && this.abilityService.getPriorityNumber(nextEvent.abilityType) >= 23) {
        // We're about to process priority 23+, check if pet removal is needed
        this.checkPetsAlive();
        const petsWereRemoved = this.removeDeadPets();
        
        if (petsWereRemoved) {
          // Pet removal might have triggered new higher priority events
          this.emptyFrontSpaceCheck(); // This might add more events too
          continue; // Re-evaluate the queue with potentially new higher priority events
        }
      }
      
      // Normal event processing
      const event = this.abilityService.getNextHighestPriorityEvent();
      if (event) {
        this.abilityService.executeEventCallback(event);
        this.checkPetsAlive();
      } else {
        // This should never happen - hasGlobalEvents was true but queue returned null
        console.error('AbilityCycle: Expected event from queue but got null. Queue state inconsistent.');
        break; // Exit the loop to prevent infinite loop
      }
    }
    
    // Final cleanup - remove any remaining dead pets and check empty spaces
    let petRemoved = this.removeDeadPets();
    if (petRemoved) {
      this.emptyFrontSpaceCheck(); // Only queues events, doesn't execute them
    }
  }

  executeFrequentEvents() {
    this.abilityService.executeFriendLostPerkEvents();
    this.abilityService.executeGainedPerkEvents();
    this.abilityService.executeFriendGainedPerkEvents();
    this.abilityService.executeFriendGainedAilmentEvents();
    this.abilityService.executeFriendlyToyBrokeEvents();
  }

  checkPetsAlive() {
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
  }
//  1. Check if toy exists and has startOfBattle ability
// 2. Queue toy ability in the ToyService event system
// 3. Set priority based on toy tier (lower tier = higher priority)
// 4. Special Puma interaction - Puma pets trigger toy abilities at their level
// 5. Execute later in the start-of-battle phase sequence
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
    try {
      this.runSimulation();
    } catch (error) {
      console.error(error)
      window.alert('Something went wrong, please send a bug report.');
    }
  }

  runSimulation() {
    debugger;
    //save info to local
    this.localStorageService.setFormStorage(this.formGroup);
    //clear previous simulation results
    this.resetSimulation();


    for (let i = 0; i < this.simulationBattleAmt; i++) {
      //get some input like summon amount
      this.initBattle();
      //reset pet to original state, reset turn counter
      this.startBattle();
      //queque toy sob event
      this.initToys();

      // // give all pets dazed equipment
      // for (let pet of this.player.petArray) {
      //   pet.equipment = new Dazed();
      // }

      // for (let pet of this.opponent.petArray) {
      //   pet.equipment = new Dazed();
      // }
      
      this.abilityService.initEndTurnEvents(this.player);
      this.abilityService.initEndTurnEvents(this.opponent);
      
      //init equipment abilities
      this.setAbilityEquipments(this.player);
      this.setAbilityEquipments(this.opponent);

      //before battle phase
      this.abilityService.triggerBeforeStartOfBattleEvents(this.player);
      this.abilityService.triggerBeforeStartOfBattleEvents(this.opponent);
      this.abilityService.executeBeforeStartOfBattleEvents();

      //normal abilities
      this.checkPetsAlive();
      while (this.abilityService.hasAbilityCycleEvents) {
        this.abilityCycle();
      }

      //init sob
      this.startOfBattleService.resetStartOfBattleFlags();
      this.startOfBattleService.initStartOfBattleEvents();
      //merge into pet sob(gecko)
      this.startOfBattleService.executeToyPetEvents();

      //add churro check
      this.toyService.executeStartOfBattleEvents(); //toy sob
      this.executeFrequentEvents();
      this.startOfBattleService.executeNonToyPetEvents(); //pet sob
      this.executeFrequentEvents();
      
      //caterpillar
      this.abilityService.triggerTransformEvents(this.player);
      this.abilityService.triggerTransformEvents(this.opponent);
      this.checkPetsAlive();
      while (this.abilityService.hasAbilityCycleEvents) {
        this.abilityCycle();
      }
      
      //loop until battle ends
      while (this.battleStarted) {
        this.nextTurn();
      }
      this.reset();
    }
    this.simulated = true;
  }

  removeDeadPets() {
    let petRemoved = false;
    petRemoved = this.player.removeDeadPets();
    petRemoved = this.opponent.removeDeadPets() || petRemoved;

    return petRemoved;
  }

  emptyFrontSpaceCheck() {
    
    if (this.player.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.player);
    }

    if (this.opponent.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceEvents(this.opponent);
    }

    this.abilityService.executeEmptyFrontSpaceEvents();

    if (this.player.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceToyEvents(this.player);
    }

    if (this.opponent.pet0 == null) {
      this.abilityService.triggerEmptyFrontSpaceToyEvents(this.opponent);
    }

    this.abilityService.executeEmptyFrontSpaceToyEvents();
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
    this.gameService.gameApi.opponentSummonedAmount = this.formGroup.get('opponentSummonedAmount').value;
    this.gameService.gameApi.playerSummonedAmount = this.formGroup.get('playerSummonedAmount').value;
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

    // init before attack events
    if (this.player.pet0.beforeAttack) {
      this.abilityService.setBeforeAttackEvent({
        callback: this.player.pet0.beforeAttack.bind(this.player.pet0),
        priority: this.player.pet0.attack,
        player: this.player
      })
    }

    if (this.opponent.pet0.beforeAttack) {
      this.abilityService.setBeforeAttackEvent({
        callback: this.opponent.pet0.beforeAttack.bind(this.opponent.pet0),
        priority: this.opponent.pet0.attack,
        player: this.opponent
      })
    }

    //before attack phase
    this.abilityService.executeBeforeAttackEvents();
    
    this.abilityService.triggerBeforeFriendAttacksEvents(this.player, this.player.pet0);
    this.abilityService.triggerBeforeFriendAttacksEvents(this.opponent, this.opponent.pet0);
    this.abilityService.executeBeforeFriendAttacksEvents();

    //normal abilities
    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();
    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }

    if (!this.player.alive() || !this.opponent.alive()) {
      return;
    }

    this.pushPetsForwards();
    //attack
    this.fight();

    this.player.checkPetsAlive();
    this.opponent.checkPetsAlive();

    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }
    //merge to ability cyle
    this.player.checkGoldenSpawn();
    this.opponent.checkGoldenSpawn();
    
    while (this.abilityService.hasAbilityCycleEvents) {
      this.abilityCycle();
    }

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
  //need to set when gave perk too
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
      if (pet.equipment instanceof FairyDust) {
        pet.equipment.callback(pet);
      }
      if (pet.equipment?.equipmentClass == 'beforeStartOfBattle') {
        pet.equipment.callback(pet);
      }
      if (pet.equipment?.equipmentClass == 'beforeAttack') {
        pet.equipment.callback(pet);
      }
      if (pet.equipment?.equipmentClass == 'afterFaint') {
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
        pantherMessage = ` (Panther)`;
      }
      for (let i = 0; i < multiplier; i++) {
        if (pet.equipment instanceof Pie) {
          pet.increaseAttack(4);
          pet.increaseHealth(4);
          this.logService.createLog({
            message: `${pet.name} gained ${4} attack and ${4} health (Pie)${pantherMessage}`,
            type: 'equipment',
            player: player
          })
        }
        if (pet.equipment instanceof Cherry) {
          pet.parent.gainTrumpets(2 * multiplier, pet, false, multiplier, true);
        }
        if (pet.equipment instanceof Pancakes) {
          for (let pett of player.petArray) {
            if (pet == pett) {
              continue;
            }
            pett.increaseAttack(2);
            pett.increaseHealth(2);
            this.logService.createLog({
              message: `${pett.name} gained ${2} attack and ${2} health (Pancake)${pantherMessage}`,
              type: 'equipment',
              player: player
            })
          }
        }
        if (pet.equipment instanceof LovePotion) {
          pet.equipment.callback(pet);
        }
        if (pet.equipment instanceof GingerbreadMan) {
          pet.equipment.callback(pet);
        }
        if (pet.equipment instanceof HealthPotion) {
          pet.equipment.callback(pet);
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

    // if button is pressed on HTML
    if (player == null) {
      if (!confirm('Are you sure you want to randomize?')) {
        return
      }
    }

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
    
    for (let selector of this.petSelectors.toArray()) {
      selector.substitutePet();
    }
  
  }

  resetPlayer(player: 'player' | 'opponent') {
    if (!confirm(`Are you sure you want to reset ${player}?`)) {
      return
    }
    let petSelectors = this.petSelectors.toArray().slice(player == 'player' ? 0 : 5, player == 'player' ? 5 : 10);
    for (let petSelector of petSelectors) {
      petSelector.removePet();
    }
  }

  export() {
    // fizes strange bug of export failing on load
    // fixes strange bug with circular dependency
    // this.simulate();

    // added this and it is fixed?
    this.localStorageService.setFormStorage(this.formGroup);
    
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
