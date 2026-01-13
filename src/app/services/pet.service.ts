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
@Injectable({
    providedIn: 'root'
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
    startOfBattlePets: string[] = [
        "Beetle",
        "Cone Snail",
        "Frilled Dragon",
        "Frog",
        "Gecko",
        "Goose",
        "Hummingbird",
        "Mosquito",
        "Moth",
        "Seahorse",
        "Budgie",
        "Nudibranch",
        "Pygmy Seahorse",
        "Atlantic Puffin",
        "Bat",
        "Crab",
        "Panda",
        "Robin",
        "Salamander",
        "Wombat",
        "Dodo",
        "Dolphin",
        "Eel",
        "Meerkat",
        "Pug",
        "Woodpecker",
        "Doberman",
        "Hawk",
        "Lynx",
        "Pelican",
        "Skunk",
        "Whale",
        "Armadillo",
        "Crocodile",
        "Hyena",
        "Macaque",
        "Sword Fish",
        "Highland Cow",
        "Leopard",
        "Mantis Shrimp",
        "Stegosaurus",
        "Therizinosaurus",
        "White Tiger",
        "Alchemedes",
        "Axehandle Hound",
        "Barghest",
        "Bunyip",
        "Sneaky Egg",
        "Tsuchinoko",
        "Ogopogo",
        "Thunderbird",
        "Mana Hound",
        "Mandrake",
        "Kraken",
        "Roc",
        "Red Dragon",
        "Salmon of Knowledge",
        "Werewolf",
        "Sleipnir",
        "Basilisk",
        "Tree",
        "Anubis",
        "Cockatrice"
    ]

    constructor(private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService,
        private petFactory: PetFactoryService
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
            this.playerCustomPackPets.set(customPack.get('name').value, pack);
        }
    }

    init() {
        this.turtlePackPets.set(1,
            [
                "Ant",
                "Cricket",
                "Duck",
                "Fish",
                "Horse",
                "Mosquito",
                "Beaver",
                "Otter",
                "Pig",
                "Pigeon"
            ]);
        this.turtlePackPets.set(2,
            [
                "Snail",
                "Crab",
                "Swan",
                "Rat",
                "Hedgehog",
                "Peacock",
                "Flamingo",
                "Worm",
                "Kangaroo",
                "Spider"
            ])
        this.turtlePackPets.set(3,
            [
                "Dodo",
                "Badger",
                "Dolphin",
                "Giraffe",
                "Elephant",
                "Camel",
                "Rabbit",
                "Ox",
                "Dog",
                "Sheep"
            ]);

        this.turtlePackPets.set(4,
            [
                "Skunk",
                "Hippo",
                "Bison",
                "Blowfish",
                "Turtle",
                "Squirrel",
                "Penguin",
                "Deer",
                "Whale",
                "Parrot",
            ]);

        this.turtlePackPets.set(5,
            [
                "Scorpion",
                "Crocodile",
                "Rhino",
                "Monkey",
                "Armadillo",
                "Cow",
                "Seal",
                "Rooster",
                "Shark",
                "Turkey",
            ]);

        this.turtlePackPets.set(6,
            [
                "Leopard",
                "Tiger",
                "Boar",
                "Wolverine",
                "Gorilla",
                "Dragon",
                "Mammoth",
                "Cat",
                "Snake",
                "Fly"
            ]);

        this.puppyPackPets.set(1, [
            "Duck",
            "Beaver",
            "Moth",
            "Bluebird",
            "Chinchilla",
            "Beetle",
            "Ladybug",
            "Chipmunk",
            "Gecko",
            "Ferret"
        ])

        this.puppyPackPets.set(2, [
            "Robin",
            "Bat",
            "Bilby",
            "Dromedary",
            "Shrimp",
            "Beluga Sturgeon",
            "Tabby Cat",
            "Mandrill",
            "Lemur",
            "Goldfish"
        ])

        this.puppyPackPets.set(3, [
            "Hoopoe Bird",
            "Tropical Fish",
            "Toucan",
            "Hatching Chick",
            "Owl",
            "Mole",
            "Pangolin",
            "Gharial",
            "Hare",
            "Purple Frog"
        ])

        this.puppyPackPets.set(4, [
            "Microbe",
            "Lobster",
            "Buffalo",
            "Llama",
            "Caterpillar",
            "Doberman",
            "Tahr",
            "Whale Shark",
            "Chameleon",
            "Puppy"
        ])

        this.puppyPackPets.set(5, [
            "Stonefish",
            "Goat",
            "Chicken",
            "Eagle",
            "Orchid Mantis",
            "Panther",
            "Axolotl",
            "Snapping Turtle",
            "Mosasaurus",
            "Sting Ray"
        ])

        this.puppyPackPets.set(6, [
            "Dragon",
            "Mantis Shrimp",
            "Lionfish",
            "Tyrannosaurus",
            "Octopus",
            "Anglerfish",
            "Sauropod",
            "Elephant Seal",
            "Puma",
            "Mongoose"
        ])

        this.starPackPets.set(1, [
            "Mouse",
            "Pillbug",
            "Cockroach",
            "Frog",
            "Hummingbird",
            "Marmoset",
            "Pheasant",
            "Kiwi",
            "Chihuahua",
            "Firefly"
        ])

        this.starPackPets.set(2, [
            "Koala",
            "Salamander",
            "Guinea Pig",
            "Jellyfish",
            "Dove",
            "Stork",
            "Iguana",
            "Dumbo Octopus",
            "Bass",
            "Shima Enaga"
        ])

        this.starPackPets.set(3, [
            "Leech",
            "Toad",
            "Capybara",
            "Okapi",
            "Cassowary",
            "Anteater",
            "Pug",
            "Orangutan",
            "Tuna"
        ])

        this.starPackPets.set(4, [
            "Hawk",
            "Clownfish",
            "Platypus",
            "Praying Mantis",
            "Donkey",
            "Fairy Armadillo",
            "Fossa",
            "Elk",
            "Sparrow",
            'Siamese'
        ])

        this.starPackPets.set(5, [
            "Sword Fish",
            "Triceratops",
            "Hamster",
            "Shoebill",
            "Woodpecker",
            "Starfish",
            "Blobfish",
            "Pelican",
            "Vulture",
            "Ibex"
        ])

        this.starPackPets.set(6, [
            "Ostrich",
            "Reindeer",
            "Piranha",
            "Orca",
            "Spinosaurus",
            "Real Velociraptor",
            "Sabertooth Tiger",
            "Ammonite",
            "Velociraptor",
            "Alpaca"
        ])

        this.goldenPackPets.set(1, [
            "Chipmunk",
            "Bulldog",
            "Groundhog",
            "Cone Snail",
            "Goose",
            "Lemming",
            "Pied Tamarin",
            "Opossum",
            "Silkmoth",
            "Magpie"
        ])

        this.goldenPackPets.set(2, [
            "Hercules Beetle",
            "Stoat",
            "Black Necked Stilt",
            "Squid",
            "Sea Urchin",
            "Door Head Ant",
            "Lizard",
            "Sea Turtle",
            "Meerkat",
            "African Penguin"
        ])

        this.goldenPackPets.set(3, [
            "Musk Ox",
            "Flea",
            "Betta Fish",
            "Royal Flycatcher",
            "Surgeon Fish",
            "Weasel",
            "Guineafowl",
            "Flying Fish",
            "Baboon",
            "Osprey"
        ]);

        this.goldenPackPets.set(4, [
            "Manatee",
            "Cuttlefish",
            "Saiga Antelope",
            "Sealion",
            "Vaquita",
            "Slug",
            "Poison Dart Frog",
            "Falcon",
            "Manta Ray",
            "Cockatoo"
        ])

        this.goldenPackPets.set(5, [
            "Macaque",
            "Nyala",
            "Nurse Shark",
            "Beluga Whale",
            "Wolf",
            "Secretary Bird",
            "Fire Ant",
            "Blue Ringed Octopus",
            "Crane",
            "Emu",
            "Egyptian Vulture",
        ])

        this.goldenPackPets.set(6, [
            "Wildebeest",
            "Highland Cow",
            "Catfish",
            "Pteranodon",
            "Warthog",
            "Cobra",
            "Grizzly Bear",
            "German Shepherd",
            "Bird of Paradise",
            "Oyster",
            "Rockhopper Penguin"
        ])

        this.unicornPackPets.set(1, [
            "Baku",
            "Axehandle Hound",
            "Barghest",
            "Tsuchinoko",
            "Murmel",
            "Alchemedes",
            "Pengobble",
            "Warf",
            "Bunyip",
            "Sneaky Egg",
            "Cuddle Toad",
            "???"
        ])

        this.unicornPackPets.set(2, [
            "Ghost Kitten",
            "Frost Wolf",
            "Mothman",
            "Drop Bear",
            "Jackalope",
            "Ogopogo",
            "Thunderbird",
            "Gargoyle",
            "Wyvern",
            "Bigfoot"
        ])

        this.unicornPackPets.set(3, [
            "Skeleton Dog",
            "Mandrake",
            "Fur-Bearing Trout",
            "Mana Hound",
            "Calygreyhound",
            "Brain Cramp",
            "Lucky Cat",
            "Tatzelwurm",
            "Ouroboros",
            "Griffin"
        ])

        this.unicornPackPets.set(4, [
            "Kraken",
            "Visitor",
            "Unicorn",
            "Tiger Bug",
            "Minotaur",
            "Cyclops",
            "Chimera",
            "Roc",
            "Worm of Sand",
            "Abomination"
        ]);

        this.unicornPackPets.set(5, [
            "Red Dragon",
            "Vampire Bat",
            "Loveland Frogman",
            "Salmon of Knowledge",
            "Jersey Devil",
            "Pixiu",
            "Kitsune",
            "Nessie",
            "Bad Dog",
            "Werewolf",
            "Amalgamation"
        ]);

        this.unicornPackPets.set(6, [
            "Manticore",
            "Phoenix",
            "Quetzalcoatl",
            "Team Spirit",
            "Sleipnir",
            "Sea Serpent",
            "Yeti",
            "Cerberus",
            "Hydra",
            "Behemoth"
        ]);

        this.dangerPackPets.set(1, [
            "African Wild Dog",
            "Iriomote Cat",
            "Ili Pika",
            "Malay Tapir",
            "Bombus Dahlbomii",
            "Ethiopian Wolf",
            "Fan Mussel",
            "Togian Babirusa",
            "Tooth Billed Pigeon",
            "Volcano Snail"
        ]);
        this.dangerPackPets.set(2, [
            "Araripe Manakin",
            "Darwin's Fox",
            "European Mink",
            "Proboscis Monkey",
            "Pygmy Hog",
            "Saola",
            "Saker Falcon",
            "Taita Shrew",
            "Takhi",
            "White-Bellied Heron"
        ]);
        this.dangerPackPets.set(3, [
            "Amami Rabbit",
            "Blue-Throated Macaw",
            "Hirola",
            "Monkey-Faced Bat",
            "Takin",
            "Tree Kangaroo",
            "Tucuxi",
            "Pygmy Hippo",
            "Roloway Monkey",
            "Spoon-Billed Sandpiper"
        ]);
        this.dangerPackPets.set(4, [
            "Amazon River Dolphin",
            "Angelshark",
            "Bonobo",
            "Giant Otter",
            "Giant Tortoise",
            "Golden Tamarin",
            "Humphead Wrasse",
            "Kakapo",
            "Longcomb Sawfish",
            "Tasmanian Devil"
        ]);
        this.dangerPackPets.set(5, [
            "Aye-aye",
            "Banggai Cardinalfish",
            "Geometric Tortoise",
            "Giant Pangasius",
            "Hawaiian Monk Seal",
            "Marine Iguana",
            "Red Panda",
            "Snow Leopard",
            "Taita Thrush",
            "Painted Terrapin"
        ]);
        this.dangerPackPets.set(6, [
            "Amsterdam Albatross",
            "Bay Cat",
            "Black Rhino",
            "Blue Whale",
            "California Condor",
            "Green Sea Turtle",
            "Helmeted Hornbill",
            "Philippine Eagle",
            "Silky Sifaka",
            "Sumatran Tiger"
        ]);

        this.customPackPets.set(1, [
            "Frilled Dragon",
            "Mouse",
            "Duckling",
            "Seahorse",
            "Budgie",
            "Farmer Mouse",
            "Nudibranch",
            "Peacock Spider",
            "Pygmy Seahorse",
            "Quoll",
            "Silverfish",
            "Sloth",
            "Umbrella Bird",
            "Weevil",
        ]);
        this.customPackPets.set(2, [
            "Frigatebird",
            "Wombat",
            "Frigatebird",
            "Nightcrawler",
            "Sphinx",
            "Chupacabra",
            "Golden Beetle",
            "Yak",
            "Panda",
            "Atlantic Puffin",
            "Albino Squirrel",
            "Amphisbaena",
            "Desert Rain Frog",
            "Dung Beetle",
            "Farmer Chicken",
            "Fruit Fly",
            "Giant Squirrel",
            "Hermit Crab",
            "Honduran White Bat",
            "Mandarinfish",
            "Mink",
            "Olm",
            "Pink Robin",
            "Roadrunner",
            "Spotted Handfish",
            "Tadpole",
            "Thorny Dragon",
            "Vervet",
        ]);
        this.customPackPets.set(3, [
            "Aardvark",
            "Emperor Tamarin",
            "Porcupine",
            "Wasp",
            "Foo Dog",
            "Basilisk",
            "Tree",
            "Slime",
            "Pegasus",
            "Deer Lord",
            "Bear",
            "Flying Squirrel",
            "Barnacle",
            "Blue Dragon",
            "Brazillian Treehopper",
            "Caladrius",
            "Centipede",
            "Dimetrodon",
            "Dugong",
            "Farmer Pig",
            "Gerenuk",
            "Great Potoo",
            "Jewel Caterpillar",
            "Pangasius",
            "Patagonian Mara",
            "Pony",
            "Quail Chick",
            "Queen Bee",
            "Quetzalcoatlus",
            "Sage-Grouse",
            "Sarcastic Fringehead",
            "Silkie Chicken",
            "Sugar Glider",
            "Vampire Parrot",
        ]);
        this.customPackPets.set(4, [
            "Jerboa",
            "Dragonfly",
            "Lynx",
            "Seagull",
            "Fairy",
            "Rootling",
            "Anubis",
            "Old Mouse",
            "Hippocampus",
            "Goblin Shark",
            "Red Lipped Batfish",
            "Platybelodon",
            "Eel",
            "Crow",
            "Tandgnost",
            "Ahuizotl",
            "Andrewsarchus",
            "Bloodhound",
            "Blue-Footed Booby",
            "Cuckoo",
            "Deinocheirus",
            "Farmer Cat",
            "Gazelle",
            "Gelada",
            "Hoatzin",
            "Leaf Gecko",
            "Leafy Sea Dragon",
            "Locust",
            "Poodle Moth",
            "Racket Tail",
            "Ruspolis Turaco",
            "Spider Crab",
            "Spiny Bush Viper",
            "Tardigrade",
            "Trout",
            "Yeti Crab",
        ]);
        this.customPackPets.set(5, [
            "Poodle",
            "Hyena",
            "Moose",
            "Raccoon",
            "Sea Cucumber",
            "Silver Fox",
            "Boitata",
            "Kappa",
            "Mimic",
            "Nurikabe",
            "Tandgrisner",
            "Fox",
            "Lion",
            "Polar Bear",
            "Siberian Husky",
            "Zebra",
            "Blue Jay",
            "Brahma Chicken",
            "Estemmenosuchus",
            "Farmer Crow",
            "Flounder",
            "Giant Isopod",
            "Hippogriff",
            "Jackal",
            "Lusca",
            "Maltese",
            "Namazu",
            "Pacific Fanfish",
            "Tarasque",
            "Venus Flytrap",
            "Woolly Rhino",
        ]);
        this.customPackPets.set(6, [
            "Lioness",
            "Tapir",
            "Walrus",
            "White Tiger",
            "Great One",
            "Leviathan",
            "Questing Beast",
            "Cockatrice",
            "Albatross",
            "Amargasaurus",
            "Tarantula Hawk",
            "Hammerhead Shark",
            "Komodo",
            "Stegosaurus",
            "Harpy Eagle",
            "Therizinosaurus",
            "Akhlut",
            "Bakunawa",
            "Black Bear",
            "Chimpanzee",
            "Coconut Crab",
            "Dunkleosteus",
            "Eagle Owl",
            "Hooded Seal",
            "Lamprey",
            "Markhor",
            "Small One",
            "Sunfish",
            "Terror Bird",
            "Vampire Squid",
            "Winter Spirit",
            "Yellow Boxfish",
        ]);

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
        const result = this.petFactory.createPetFromForm(petForm, parent, this, PET_REGISTRY);
        if (result) {
            return result;
        }
        // Fallback
        return new Mouse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment, petForm.triggersConsumed);
    }


    createDefaultVersionOfPet(pet: Pet, attack: number = null, health: number = null) {
        return this.petFactory.createPet(pet, this, attack, health);
    }


    getRandomPet(parent: Player) {
        let tier = getRandomInt(1, 6);
        let pets;
        if (parent.pack == 'Turtle') {
            pets = this.turtlePackPets.get(tier);
        } else if (parent.pack == 'Puppy') {
            pets = this.puppyPackPets.get(tier);
        } else if (parent.pack == 'Star') {
            pets = this.starPackPets.get(tier);
        } else if (parent.pack == 'Golden') {
            pets = this.goldenPackPets.get(tier);
        } else if (parent.pack == 'Unicorn') {
            pets = this.unicornPackPets.get(tier);
        } else if (parent.pack == 'Danger') {
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
                mana: null
            },
            parent
        )
    }

    getRandomFaintPet(parent: Player, tier?: number): Pet {
        let faintPetsByTier = {
            1: ['Ant', 'Cricket', 'Groundhog', 'Pied Tamarin'],
            2: ['Rat', 'Hedgehog', 'Flamingo', 'Spider', 'Stork', 'Beluga Sturgeon', 'Squid', 'Black Necked Stilt', 'Frost Wolf', 'Mothman', 'Gargoyle', 'Bigfoot', 'Nightcrawler'],
            3: ['Badger', 'Sheep', 'Anteater', 'Hoopoe Bird', 'Mole', 'Pangolin', 'Blobfish', 'Flea', 'Weasel', 'Osprey', 'Bear', 'Betta Fish', 'Skeleton Dog', 'Fur-Bearing Trout', 'Calygreyhound', 'Slime'],
            4: ['Turtle', 'Deer', 'Microbe', 'Tahr', 'Chameleon', 'Cuttlefish', 'Vaquita', 'Slug', 'Chimera', 'Visitor'],
            5: ['Rooster', 'Eagle', 'Fire Ant', 'Stonefish', 'Nyala', 'Nurse Shark', 'Wolf', 'Nessie', 'Pixiu', 'Kappa'],
            6: ['Mammoth', 'Snapping Turtle', 'Lionfish', 'Warthog', 'Walrus', 'Phoenix', 'Sea Serpent', 'Hydra']
        };

        let faintPets = [];
        if (tier && faintPetsByTier[tier]) {
            faintPets = faintPetsByTier[tier];
        } else {
            // If no tier specified or invalid tier, use all faint pets
            faintPets = [].concat(...Object.values(faintPetsByTier));
        }
        let petName = faintPets[getRandomInt(0, faintPets.length - 1)];
        return this.createPet({
            name: petName,
            attack: null,
            equipment: null,
            exp: 0,
            health: null,
            mana: null
        }, parent);
    }
}



