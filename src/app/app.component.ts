import { Component, Injector, ViewChildren, QueryList, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Player } from './classes/player.class';
import { Pet } from './classes/pet.class';

import { InjectorService } from './services/injector.service';
import { LogService } from './services/log.service';
import { Battle } from './interfaces/battle.interface';
import { createPack, money_round } from './util/helper-functions';
import { GameService } from './services/game.service';
import { Log } from './interfaces/log.interface';
import { AbilityService } from './services/ability.service';

import { PetService } from './services/pet.service';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PetSelectorComponent } from './components/pet-selector/pet-selector.component';
import { ToyService } from './services/toy.service';
import { cloneDeep } from 'lodash';
import { LocalStorageService } from './services/local-storage.service';
import { Modal } from 'bootstrap';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EquipmentService } from './services/equipment.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SimulationRunner } from './engine/simulation-runner';
import { SimulationConfig } from './interfaces/simulation-config.interface';

const DAY = '#85ddf2';
const NIGHT = '#33377a';

const REVERSE_KEY_MAP = {
  "pP": "playerPack", "oP": "opponentPack", "pT": "playerToy", "pTL": "playerToyLevel",
  "oT": "opponentToy", "oTL": "opponentToyLevel", "t": "turn", "pGS": "playerGoldSpent",
  "oGS": "opponentGoldSpent", "pRA": "playerRollAmount", "oRA": "opponentRollAmount",
  "pSA": "playerSummonedAmount", "oSA": "opponentSummonedAmount", "pL3": "playerLevel3Sold",
  "oL3": "opponentLevel3Sold", "p": "playerPets", "o": "opponentPets", "an": "angler",
  "ap": "allPets", "lf": "logFilter", "fs": "fontSize", "cp": "customPacks",
  "os": "oldStork", "tp": "tokenPets", "ks": "komodoShuffle", "m": "mana",
  "sa": "showAdvanced", "ae": "ailmentEquipment", "pTA": "playerTransformationAmount", "oTA": "opponentTransformationAmount",
  // Pet Object Keys
  "n": "name", "a": "attack", "h": "health", "e": "exp", "eq": "equipment", "bSP": "belugaSwallowedPet", "tH": "timesHurt"
};

function expandKeys(data) {
  if (Array.isArray(data)) {
    return data.map(item => expandKeys(item));
  }
  if (data !== null && typeof data === 'object') {
    const newObj = {};
    for (const key in data) {
      const newKey = REVERSE_KEY_MAP[key] || key;
      newObj[newKey] = expandKeys(data[key]);
    }
    return newObj;
  }
  return data;
}


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

  version = '0.9.2';
  sapVersion = '0.33.3-156 BETA'
  lastUpdated = '1/11/2026';

  title = 'sap-calculator';
  player: Player;
  opponent: Player;
  maxTurns = 71;
  turns = 0;
  attackCount = 0;
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

  private isLoadedFromUrl = false;

  constructor(private logService: LogService,
    private injector: Injector,
    private abilityService: AbilityService,
    private gameService: GameService,
    private equipmentService: EquipmentService,
    private petService: PetService,
    private toyService: ToyService,
    private localStorageService: LocalStorageService
  ) {
    InjectorService.setInjector(this.injector);
    this.player = new Player(logService, abilityService, gameService);
    this.opponent = new Player(logService, abilityService, gameService);
    this.opponent.isOpponent = true;
    this.gameService.init(this.player, this.opponent);
    this.petService.init();
    this.initFormGroup();
    // this.loadLocalStorage();
    // this.initApp();
    // this.initGameApi();
    // this.setDayNight();

    // get the end of url
    // let url = window.location.href;
    // let urlSplit = url.split('/');
    // let lastUrl = urlSplit[urlSplit.length - 1];
    // let code = decodeURIComponent((lastUrl + '').replace(/\+/g, '%20'));;
    // // remove ?code= from string
    // code = code.replace('?code=', '');
    // if (code) {
    //   this.api = true;
    //   this.loadCalculatorFromValue(JSON.parse(code));
    //   this.simulate();
    //   this.buildApiResponse();
    // }
    const params = new URLSearchParams(window.location.search);
    const apiCode = params.get('code'); // This safely gets ONLY the value of the 'code' parameter

    if (apiCode) {
      this.api = true;
      try {
        const jsonData = JSON.parse(decodeURIComponent(apiCode));
        this.loadCalculatorFromValue(jsonData);
        this.simulate();
        this.buildApiResponse();
      } catch (e) {
        console.error("Error parsing API data from URL:", e);
        this.apiResponse = JSON.stringify({ error: "Invalid or corrupted data provided in the URL." });
      }
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
    this.isLoadedFromUrl = this.loadStateFromUrl(true);

    if (!this.isLoadedFromUrl) {
      this.loadLocalStorage();
    }

    this.initApp();
    this.initGameApi();
    this.setDayNight();
    this.toys = this.toyService.toys;
  }

  loadStateFromUrl(isInitialLoad: boolean = false): boolean {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get('c');

    if (encodedData) {
      try {
        let finalJsonString;
        const decodedData = decodeURIComponent(encodedData);
        if (decodedData.trim().startsWith('{')) {

          const truncatedJson = JSON.parse(decodedData);

          const fullKeyJson = expandKeys(truncatedJson);

          finalJsonString = JSON.stringify(fullKeyJson);
        } else {
          const compressedData = atob(encodedData);
          const decodedData = decodeURIComponent(compressedData);
          const truncatedJson = JSON.parse(decodedData);

          const fullKeyJson = expandKeys(truncatedJson);

          finalJsonString = JSON.stringify(fullKeyJson);
        }

        this.import(finalJsonString);

        console.log("Calculator state loaded from URL.");
        return true;
      } catch (e) {
        console.error("Failed to parse calculator state from URL.", e);
        alert("Could not load the shared calculator link. The data may be corrupted.");
        return false;
      }
    }

    return false; // No data found in URL
  }


  ngAfterViewInit(): void {
    if (this.isLoadedFromUrl) {
      this.petSelectors.forEach((petSelector) => {
        petSelector.fixLoadEquipment();
      });
    }

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
    const defaultState = {
      playerPack: "Turtle",
      opponentPack: "Turtle",
      playerToy: null,
      playerToyLevel: "1",
      opponentToy: null,
      opponentToyLevel: "1",
      turn: 11,
      playerGoldSpent: 10,
      opponentGoldSpent: 10,
      playerRollAmount: 4,
      opponentRollAmount: 4,
      playerSummonedAmount: 0,
      opponentSummonedAmount: 0,
      playerTransformationAmount: 0,
      opponentTransformationAmount: 0,
      playerLevel3Sold: 0,
      opponentLevel3Sold: 0,
      playerPets: Array(5).fill(null),
      opponentPets: Array(5).fill(null),
      angler: false,
      allPets: false,
      logFilter: null,
      fontSize: 13,
      customPacks: [],
      oldStork: false,
      tokenPets: false,
      komodoShuffle: false,
      mana: false,
      showAdvanced: false,
      ailmentEquipment: false
    };

    const finalState = { ...defaultState, ...calculator };

    this.formGroup.patchValue(finalState, { emitEvent: false });

    let customPacks = calculator.customPacks;
    calculator.customPacks = [];
    this.loadCustomPacks(customPacks);
    this.formGroup.patchValue(calculator, { emitEvent: false });

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
    this.gameService.gameApi.playerTransformationAmount = this.formGroup.get('playerTransformationAmount').value;
    this.gameService.gameApi.opponentTransformationAmount = this.formGroup.get('opponentTransformationAmount').value;
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
    this.formGroup.get('playerPack').setValue(this.formGroup.get('playerPack').value, { emitEvent: false });
    this.formGroup.get('opponentPack').setValue(this.formGroup.get('opponentPack').value, { emitEvent: false });
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
    this.gameService.gameApi.playerTransformationAmount = this.formGroup.get('playerTransformationAmount').value;
    this.gameService.gameApi.opponentTransformationAmount = this.formGroup.get('opponentTransformationAmount').value;
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
    let petsDummyArray = [0, 1, 2, 3, 4]
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
      triggersConsumed: new FormControl(false),
      playerRollAmount: new FormControl(4),
      opponentRollAmount: new FormControl(4),
      playerLevel3Sold: new FormControl(0),
      opponentLevel3Sold: new FormControl(0),
      playerSummonedAmount: new FormControl(0),
      opponentSummonedAmount: new FormControl(0),
      playerTransformationAmount: new FormControl(0),
      opponentTransformationAmount: new FormControl(0),
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
    this.formGroup.get('playerTransformationAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.playerTransformationAmount = value;
    });
    this.formGroup.get('opponentTransformationAmount').valueChanges.subscribe((value) => {
      this.gameService.gameApi.opponentTransformationAmount = value;
    });

  }

  toggleAdvanced() {
    let advanced = this.formGroup.get('showAdvanced').value;
    this.formGroup.get('showAdvanced').setValue(!advanced);
  }

  initPetForms() {
    let petsDummyArray = [0, 1, 2, 3, 4];
    let playerPetFormGroups = petsDummyArray.map(foo => {
      return new FormGroup({
        name: new FormControl(this.player[`pet${foo}`]?.name),
        attack: new FormControl(this.player[`pet${foo}`]?.attack ?? 0),
        health: new FormControl(this.player[`pet${foo}`]?.health ?? 0),
        exp: new FormControl(this.player[`pet${foo}`]?.exp ?? 0),
        equipment: new FormControl(this.player[`pet${foo}`]?.equipment),
        belugaSwallowedPet: new FormControl(this.player[`pet${foo}`]?.belugaSwallowedPet),
        mana: new FormControl(this.player[`pet${foo}`]?.mana ?? 0),
        triggersConsumed: new FormControl(this.player[`pet${foo}`]?.triggersConsumed ?? 0),
        abominationSwallowedPet1: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet1),
        abominationSwallowedPet2: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet2),
        abominationSwallowedPet3: new FormControl(this.player[`pet${foo}`]?.abominationSwallowedPet3),
        battlesFought: new FormControl(this.player[`pet${foo}`]?.battlesFought ?? 0),
        timesHurt: new FormControl(this.player[`pet${foo}`]?.timesHurt ?? 0),
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
        triggersConsumed: new FormControl(this.opponent[`pet${foo}`]?.triggersConsumed ?? 0),
        abominationSwallowedPet1: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet1),
        abominationSwallowedPet2: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet2),
        abominationSwallowedPet3: new FormControl(this.opponent[`pet${foo}`]?.abominationSwallowedPet3),
        battlesFought: new FormControl(this.opponent[`pet${foo}`]?.battlesFought ?? 0),
        timesHurt: new FormControl(this.opponent[`pet${foo}`]?.timesHurt ?? 0),
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
      case 'Danger':
        petPool = this.petService.dangerPackPets;
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
    let level = Number(this.formGroup.get(levelControlName).value);
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



  simulate(count: number = 1000) {
    try {
      this.runSimulation(count);
    } catch (error) {
      console.error(error)
      window.alert('Something went wrong, please send a bug report.');
    }
  }

  runSimulation(count: number = 1000) {
    this.simulationBattleAmt = count;
    this.localStorageService.setFormStorage(this.formGroup);

    // Build config
    const config: SimulationConfig = {
      playerPack: this.formGroup.get('playerPack').value,
      opponentPack: this.formGroup.get('opponentPack').value,
      playerToy: this.formGroup.get('playerToy').value,
      playerToyLevel: this.formGroup.get('playerToyLevel').value,
      opponentToy: this.formGroup.get('opponentToy').value,
      opponentToyLevel: this.formGroup.get('opponentToyLevel').value,
      turn: this.formGroup.get('turn').value,
      playerGoldSpent: this.formGroup.get('playerGoldSpent').value,
      opponentGoldSpent: this.formGroup.get('opponentGoldSpent').value,
      playerRollAmount: this.gameService.gameApi.playerRollAmount,
      opponentRollAmount: this.gameService.gameApi.opponentRollAmount,
      playerSummonedAmount: this.gameService.gameApi.playerSummonedAmount,
      opponentSummonedAmount: this.gameService.gameApi.opponentSummonedAmount,
      playerLevel3Sold: this.gameService.gameApi.playerLevel3Sold,
      opponentLevel3Sold: this.gameService.gameApi.opponentLevel3Sold,
      playerTransformationAmount: this.gameService.gameApi.playerTransformationAmount,
      opponentTransformationAmount: this.gameService.gameApi.opponentTransformationAmount,
      playerPets: this.formGroup.get('playerPets').value,
      opponentPets: this.formGroup.get('opponentPets').value,
      angler: this.formGroup.get('angler').value,
      allPets: this.formGroup.get('allPets').value,
      oldStork: this.formGroup.get('oldStork').value,
      tokenPets: this.formGroup.get('tokenPets').value,
      komodoShuffle: this.formGroup.get('komodoShuffle').value,
      mana: this.formGroup.get('mana').value,
      simulationCount: count
    };

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
    this.gameService.init(this.player, this.opponent);

    this.playerWinner = result.playerWins;
    this.opponentWinner = result.opponentWins;
    this.draw = result.draws;
    this.battles = result.battles || [];
    this.viewBattle = result.battles[0] || null;
    this.simulated = true;
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
    if (!log.player.isOpponent) {
      return 'log-player';
    } else {
      return 'log-opponent'
    }
  }

  getRandomEvents(battle: Battle) {
    let events = ""
    let randomLogs = battle.logs.filter((log) => { return log.randomEvent == true });
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
    this.formGroup.get('playerPack').setValue(this.previousPackPlayer, { emitEvent: false });
    this.formGroup.get('opponentPack').setValue(this.previousPackOpponent, { emitEvent: false });
  }

  drop(event: CdkDragDrop<string[]>, playerString: string) {
    let previousIndex = event.previousIndex;
    let currentIndex = event.currentIndex;
    if (playerString == 'player') {
      // since the array is reversed, we need to revers the indexes
      previousIndex = 4 - previousIndex;
      currentIndex = 4 - currentIndex;
    }
    let formArray = this.formGroup.get(`${playerString}Pets`) as FormArray;
    moveItemInArray(formArray.controls, previousIndex, currentIndex);
    formArray.updateValueAndValidity();

    setTimeout(() => {
      // Allow Angular to update view indices before substituting
      for (let selector of this.petSelectors.toArray()) {
        selector.substitutePet();
      }
    });

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

  import(importVal: string, isInitialLoad: boolean = false): boolean {
    let success = false;
    try {
      const calculator = JSON.parse(importVal);

      this.loadCalculatorFromValue(calculator);
      this.initApp();
      if (!isInitialLoad) {
        setTimeout(() => {
          if (this.petSelectors) {
            this.petSelectors.forEach((petSelector) => {
              petSelector.fixLoadEquipment();
            });
          }
        }, 0);
      }
      success = true;
    } catch (e) {
      console.error(e);
      // acceptable faliure
    }
    return success;
  }

  generateShareLink(): void {
    this.localStorageService.setFormStorage(this.formGroup);

    const rawValue = this.formGroup.value;
    const cleanValue = cloneDeep(rawValue);

    const petsToClean = [...(cleanValue.playerPets || []), ...(cleanValue.opponentPets || [])];

    for (const pet of petsToClean) {
      if (pet) {
        // Remove all complex objects and circular references
        delete pet.parent;
        delete pet.logService;
        delete pet.abilityService;
        delete pet.gameService;
        delete pet.petService;

        if (pet.equipment) {
          pet.equipment = { name: pet.equipment.name };
        }
      }
    }

    const calculatorStateString = JSON.stringify(cleanValue);

    const encodedData = encodeURIComponent(calculatorStateString);

    const baseUrl = window.location.origin + window.location.pathname;
    const shareableLink = `${baseUrl}?c=${encodedData}`;

    navigator.clipboard.writeText(shareableLink).then(() => {
      alert('Shareable link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link. See console for details.');
    });
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
