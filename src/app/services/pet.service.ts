import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { LogService } from "./log.service";
import { PetFactoryService, PetForm } from "./pet-factory.service";
import { Player } from "../classes/player.class";
import { Equipment } from "../classes/equipment.class";
import { AbilityService } from "./ability.service";
import { GameService } from "./game.service";
import { getRandomInt } from "../util/helper-functions";
import { FormArray } from "@angular/forms";
import { EquipmentService } from "./equipment.service";
import { Mouse } from "../classes/pets/custom/tier-1/mouse.class";
import { PET_REGISTRY } from "./pet-registry";
import { BASE_PACK_NAMES, PackName } from "../util/pack-names";
import * as petJson from "../files/pets.json";

interface PetJsonEntry {
  Name: string;
  Tier: number | string;
  Packs?: string[];
  PacksRequired?: string[];
  Abilities?: Array<{ Level?: number; About?: string }>;
}

const PACK_CODE_TO_NAME: Record<string, PackName> = {
  Pack1: "Turtle",
  Pack2: "Puppy",
  Pack3: "Star",
  Pack4: "Golden",
  Pack5: "Unicorn",
  Danger: "Danger",
  Custom: "Custom",
  MiniPack1: "Custom",
  MiniPack2: "Custom",
  MiniPack3: "Custom",
};
@Injectable({
  providedIn: "root",
})
export class PetService {
  turtlePackPets: Map<number, string[]> = new Map();
  puppyPackPets: Map<number, string[]> = new Map();
  starPackPets: Map<number, string[]> = new Map();
  goldenPackPets: Map<number, string[]> = new Map();
  unicornPackPets: Map<number, string[]> = new Map();
  customPackPets: Map<number, string[]> = new Map();
  dangerPackPets: Map<number, string[]> = new Map();
  playerCustomPackPets: Map<string, Map<number, string[]>> = new Map();
  allPets: Map<number, string[]> = new Map();
  readonly basePackPetsByName: Record<PackName, Map<number, string[]>>;
  startOfBattlePets: string[] = [];

  constructor(
    private logService: LogService,
    private abilityService: AbilityService,
    private gameService: GameService,
    private petFactory: PetFactoryService,
  ) {
    this.basePackPetsByName = {
      Turtle: this.turtlePackPets,
      Puppy: this.puppyPackPets,
      Star: this.starPackPets,
      Golden: this.goldenPackPets,
      Unicorn: this.unicornPackPets,
      Danger: this.dangerPackPets,
      Custom: this.customPackPets,
    };
  }

  buildCustomPackPets(customPacks: FormArray) {
    for (let customPack of customPacks.controls) {
      let pack = new Map<number, string[]>();
      for (let i = 1; i <= 6; i++) {
        pack.set(i, customPack.get(`tier${i}Pets`).value);
      }
      this.playerCustomPackPets.set(customPack.get("name").value, pack);
    }
  }

  private resetPackMaps() {
    const tierMaps = [
      this.turtlePackPets,
      this.puppyPackPets,
      this.starPackPets,
      this.goldenPackPets,
      this.unicornPackPets,
      this.dangerPackPets,
      this.customPackPets,
    ];
    for (const map of tierMaps) {
      map.clear();
      for (let tier = 1; tier <= 6; tier++) {
        map.set(tier, []);
      }
    }
  }

  private getPetEntriesFromJson(): PetJsonEntry[] {
    const entries =
      (
        (petJson as unknown as { default?: PetJsonEntry[] }).default ??
        (petJson as unknown as PetJsonEntry[])
      ) ?? [];
    return entries.filter((pet) => Boolean(pet?.Name));
  }

  private populatePackMaps(pets: PetJsonEntry[]) {
    for (const pet of pets) {
      const tier = Number(pet.Tier);
      if (!Number.isFinite(tier) || tier < 1 || tier > 6) {
        continue;
      }
      for (const packName of this.getPackNamesFromEntry(pet)) {
        const tierMap = this.basePackPetsByName[packName];
        const tierPets = tierMap?.get(tier);
        if (tierPets) {
          tierPets.push(pet.Name);
        }
      }
    }
    for (const tierMap of Object.values(this.basePackPetsByName)) {
      this.deduplicateTierMap(tierMap);
    }
  }

  private getPackNamesFromEntry(pet: PetJsonEntry): PackName[] {
    const codes = new Set<string>();
    if (Array.isArray(pet.Packs)) {
      pet.Packs.forEach((code) => {
        if (code) {
          codes.add(code.trim());
        }
      });
    }
    if (Array.isArray(pet.PacksRequired)) {
      pet.PacksRequired.forEach((code) => {
        if (code) {
          codes.add(code.trim());
        }
      });
    }
    const packNames = new Set<PackName>();
    for (const code of codes) {
      const packName = PACK_CODE_TO_NAME[code];
      if (packName) {
        packNames.add(packName);
      }
    }
    return Array.from(packNames);
  }

  private deduplicateTierMap(map: Map<number, string[]>) {
    for (const [tier, pets] of map) {
      map.set(tier, [...new Set(pets)]);
    }
  }

  private buildStartOfBattlePets(pets: PetJsonEntry[]): string[] {
    const names = new Set<string>();
    for (const pet of pets) {
      if (!Array.isArray(pet.Abilities)) {
        continue;
      }
      if (
        pet.Abilities.some((ability) => {
          const about = ability?.About;
          return typeof about === "string" && about.toLowerCase().includes("start of battle");
        })
      ) {
        names.add(pet.Name);
      }
    }
    return Array.from(names);
  }

  init() {
    this.resetPackMaps();
    const pets = this.getPetEntriesFromJson();
    this.populatePackMaps(pets);
    this.startOfBattlePets = this.buildStartOfBattlePets(pets);
    this.setAllPets();
  }



  setAllPets() {
    this.allPets = new Map();
    for (let i = 1; i <= 6; i++) {
      this.allPets.set(i, []);
    }
    for (const packName of BASE_PACK_NAMES) {
      const packPets = this.basePackPetsByName[packName];
      for (let [tier, pets] of packPets) {
        this.allPets.get(tier).push(...pets);
      }
    }
    // remove duplicates from each tier
    for (let [tier, pets] of this.allPets) {
      this.allPets.set(tier, [...new Set(pets)]);
    }
  }

  createPet(petForm: PetForm, parent: Player): Pet {
    const result = this.petFactory.createPetFromForm(
      petForm,
      parent,
      this,
      PET_REGISTRY,
    );
    if (result) {
      return result;
    }
    // Fallback
    return new Mouse(
      this.logService,
      this.abilityService,
      parent,
      petForm.health,
      petForm.attack,
      petForm.mana,
      petForm.exp,
      petForm.equipment,
      petForm.triggersConsumed,
    );
  }

  createDefaultVersionOfPet(
    pet: Pet,
    attack: number = null,
    health: number = null,
  ) {
    return this.petFactory.createPet(pet, this, attack, health);
  }

  getRandomPet(parent: Player) {
    let tier = getRandomInt(1, 6);
    let pets;
    if (parent.pack == "Turtle") {
      pets = this.turtlePackPets.get(tier);
    } else if (parent.pack == "Puppy") {
      pets = this.puppyPackPets.get(tier);
    } else if (parent.pack == "Star") {
      pets = this.starPackPets.get(tier);
    } else if (parent.pack == "Golden") {
      pets = this.goldenPackPets.get(tier);
    } else if (parent.pack == "Unicorn") {
      pets = this.unicornPackPets.get(tier);
    } else if (parent.pack == "Danger") {
      pets = this.dangerPackPets.get(tier);
    } else {
      pets = this.playerCustomPackPets.get(parent.pack).get(tier);
    }
    let petNum = getRandomInt(0, pets.length - 1);
    let pet = pets[petNum];
    return this.createPet(
      {
        attack: null,
        equipment: null,
        exp: getRandomInt(0, 5),
        health: null,
        name: pet,
        mana: null,
      },
      parent,
    );
  }

  getRandomFaintPet(parent: Player, tier?: number): Pet {
    let faintPetsByTier = {
      1: ["Ant", "Cricket", "Groundhog", "Pied Tamarin"],
      2: [
        "Rat",
        "Hedgehog",
        "Flamingo",
        "Spider",
        "Stork",
        "Beluga Sturgeon",
        "Squid",
        "Black Necked Stilt",
        "Frost Wolf",
        "Mothman",
        "Gargoyle",
        "Bigfoot",
        "Nightcrawler",
      ],
      3: [
        "Badger",
        "Sheep",
        "Anteater",
        "Hoopoe Bird",
        "Mole",
        "Pangolin",
        "Blobfish",
        "Flea",
        "Weasel",
        "Osprey",
        "Bear",
        "Betta Fish",
        "Skeleton Dog",
        "Fur-Bearing Trout",
        "Calygreyhound",
        "Slime",
      ],
      4: [
        "Turtle",
        "Deer",
        "Microbe",
        "Tahr",
        "Chameleon",
        "Cuttlefish",
        "Vaquita",
        "Slug",
        "Chimera",
        "Visitor",
      ],
      5: [
        "Rooster",
        "Eagle",
        "Fire Ant",
        "Stonefish",
        "Nyala",
        "Nurse Shark",
        "Wolf",
        "Nessie",
        "Pixiu",
        "Kappa",
      ],
      6: [
        "Mammoth",
        "Snapping Turtle",
        "Lionfish",
        "Warthog",
        "Walrus",
        "Phoenix",
        "Sea Serpent",
        "Hydra",
      ],
    };

    let faintPets = [];
    if (tier && faintPetsByTier[tier]) {
      faintPets = faintPetsByTier[tier];
    } else {
      // If no tier specified or invalid tier, use all faint pets
      faintPets = [].concat(...Object.values(faintPetsByTier));
    }
    let petName = faintPets[getRandomInt(0, faintPets.length - 1)];
    return this.createPet(
      {
        name: petName,
        attack: null,
        equipment: null,
        exp: 0,
        health: null,
        mana: null,
      },
      parent,
    );
  }
}
