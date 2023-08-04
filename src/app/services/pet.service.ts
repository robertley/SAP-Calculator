import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { Ant } from "../classes/pets/turtle/tier-1/ant.class";
import { LogService } from "./log.servicee";
import { Player } from "../classes/player.class";
import { Equipment } from "../classes/equipment.class";
import { Cricket } from "../classes/pets/turtle/tier-1/cricket.class";
import { Fish } from "../classes/pets/turtle/tier-1/fish.class";
import { Horse } from "../classes/pets/turtle/tier-1/horse.class";
import { Mosquito } from "../classes/pets/turtle/tier-1/mosquito.class";
import { Duck } from "../classes/pets/turtle/tier-1/duck.class";
import { Beaver } from "../classes/pets/turtle/tier-1/beaver.class";
import { Otter } from "../classes/pets/turtle/tier-1/otter.class";
import { Pig } from "../classes/pets/turtle/tier-1/pig.class";
import { Mouse } from "../classes/pets/turtle/tier-1/mouse.class";
import { Snail } from "../classes/pets/turtle/tier-2/snail.class";
import { Crab } from "../classes/pets/turtle/tier-2/crab.class";
import { Swan } from "../classes/pets/turtle/tier-2/swan.class";
import { Rat } from "../classes/pets/turtle/tier-2/rat.class";
import { Hedgehog } from "../classes/pets/turtle/tier-2/hedgehog.class";
import { AbilityService } from "./ability.service";
import { Peacock } from "../classes/pets/turtle/tier-2/peacock.class";
import { Flamingo } from "../classes/pets/turtle/tier-2/flamingo.class";
import { Worm } from "../classes/pets/turtle/tier-2/worm.class";
import { Kangaroo } from "../classes/pets/turtle/tier-2/kangaroo.class";
import { Spider } from "../classes/pets/turtle/tier-2/spider.class";
import { Dodo } from "../classes/pets/turtle/tier-3/dodo.class";
import { Badger } from "../classes/pets/turtle/tier-3/badger.class";
import { Dolphin } from "../classes/pets/turtle/tier-3/dolphin.class";
import { Giraffe } from "../classes/pets/turtle/tier-3/giraffe.class";
import { Elephant } from "../classes/pets/turtle/tier-3/elephant.class";
import { Camel } from "../classes/pets/turtle/tier-3/camel.class";
import { Rabbit } from "../classes/pets/turtle/tier-3/rabbit.class";
import { Ox } from "../classes/pets/turtle/tier-3/ox.class";
import { Dog } from "../classes/pets/turtle/tier-3/dog.class";
import { Sheep } from "../classes/pets/turtle/tier-3/sheep.class";
import { GameService } from "./game.service";
import { Tiger } from "../classes/pets/turtle/tier-6/tiger.class";
import { Parrot } from "../classes/pets/turtle/tier-4/parrot.class";
import { Skunk } from "app/classes/pets/turtle/tier-4/skunk.class";
import { Hippo } from "app/classes/pets/turtle/tier-4/hippo.class";
import { Bison } from "app/classes/pets/turtle/tier-4/bison.class";
import { Blowfish } from "app/classes/pets/turtle/tier-4/blowfish.class";
import { Turtle } from "app/classes/pets/turtle/tier-4/turtle.class";
import { Squirrel } from "app/classes/pets/turtle/tier-4/squirrel.class";
import { Penguin } from "app/classes/pets/turtle/tier-4/penguin.class";
import { Deer } from "app/classes/pets/turtle/tier-4/deer.class";
import { Whale } from "../classes/pets/turtle/tier-4/whale.class";
import { Bee } from "../classes/pets/hidden/bee.class";
import { ZombieCricket } from "../classes/pets/hidden/zombie-cricket.class";
import { Scorpion } from "../classes/pets/turtle/tier-5/scorpion.class";
import { Crocodile } from "../classes/pets/turtle/tier-5/crocodile.class";
import { Rhino } from "../classes/pets/turtle/tier-5/rhino.class";
import { Monkey } from "../classes/pets/turtle/tier-5/monkey.class";
import { Armadillo } from "../classes/pets/turtle/tier-5/armadillo.class";
import { Cow } from "../classes/pets/turtle/tier-5/cow.class";
import { Seal } from "../classes/pets/turtle/tier-5/seal.class";
import { Rooster } from "../classes/pets/turtle/tier-5/rooster.class";
import { Shark } from "../classes/pets/turtle/tier-5/shark.class";
import { Turkey } from "../classes/pets/turtle/tier-5/turkey.class";
import { Leopard } from "../classes/pets/turtle/tier-6/leopard.class";
import { Boar } from "app/classes/pets/turtle/tier-6/boar.class";
import { Wolverine } from "app/classes/pets/turtle/tier-6/wolverine.class";
import { Gorilla } from "app/classes/pets/turtle/tier-6/gorilla.class";
import { Dragon } from "app/classes/pets/turtle/tier-6/dragon.class";
import { Mammoth } from "app/classes/pets/turtle/tier-6/mammoth.class";
import { Cat } from "app/classes/pets/turtle/tier-6/cat.class";
import { Snake } from "app/classes/pets/turtle/tier-6/snake.class";
import { Fly } from "app/classes/pets/turtle/tier-6/fly.class";
import { getRandomInt } from "../util/helper-functions";
import { Moth } from "../classes/pets/puppy/tier-1/moth.class";
import { Bluebird } from "../classes/pets/puppy/tier-1/bluebird.class";
import { Chinchilla } from "../classes/pets/puppy/tier-1/chinchilla.class";
import { Beetle } from "../classes/pets/puppy/tier-1/beetle.class";
import { Ladybug } from "../classes/pets/puppy/tier-1/ladybug.class";
import { Chipmunk } from "../classes/pets/puppy/tier-1/chipmunk.class";
import { Gecko } from "../classes/pets/puppy/tier-1/gecko.class";
import { Ferret } from "../classes/pets/puppy/tier-1/ferret.class";
import { Bat } from "../classes/pets/puppy/tier-2/bat.class";
import { Frigatebird } from "../classes/pets/puppy/tier-2/frigatebird.class";
import { Robin } from "../classes/pets/puppy/tier-2/robin.class";
import { Dromedary } from "../classes/pets/puppy/tier-2/dromedary.class";
import { Shrimp } from "../classes/pets/puppy/tier-2/shrimp.class";
import { Toucan } from "../classes/pets/puppy/tier-2/toucan.class";
import { BelugaSturgeon } from "../classes/pets/puppy/tier-2/beluga-sturgeon.class";
import { TabbyCat } from "../classes/pets/puppy/tier-2/tabby-cat.class";
import { Mandrill } from "../classes/pets/puppy/tier-2/mandrill.class";
import { Lemur } from "../classes/pets/puppy/tier-2/lemur.class";
import { HoopoeBird } from "../classes/pets/puppy/tier-3/hoopoe-bird.class";
import { TropicalFish } from "../classes/pets/puppy/tier-3/tropical-fish.class";
import { HatchingChick } from "../classes/pets/puppy/tier-3/hatching-chick.class";
import { Goldfish } from "../classes/pets/puppy/tier-3/goldfish.class";
import { Owl } from "../classes/pets/puppy/tier-3/owl.class";
import { Mole } from "../classes/pets/puppy/tier-3/mole.class";
import { Raccoon } from "../classes/pets/puppy/tier-3/raccoon.class";
import { FlyingSquirrel } from "../classes/pets/puppy/tier-3/flying-squirrel.class";
import { Pangolin } from "../classes/pets/puppy/tier-3/pangolin.class";
import { Puppy } from "../classes/pets/puppy/tier-3/puppy.class";
import { Microbe } from "../classes/pets/puppy/tier-4/microbe.class";
import { Lobster } from "../classes/pets/puppy/tier-4/lobster.class";
import { Buffalo } from "../classes/pets/puppy/tier-4/buffalo.class";
import { Llama } from "../classes/pets/puppy/tier-4/llama.class";
import { Caterpillar } from "../classes/pets/puppy/tier-4/caterpillar.class";
import { Doberman } from "../classes/pets/puppy/tier-4/doberman.class";
import { Tahr } from "../classes/pets/puppy/tier-4/tahr.class";
import { WhaleShark } from "../classes/pets/puppy/tier-4/whale-shark.class";
import { Chameleon } from "../classes/pets/puppy/tier-4/chameleon.class";
import { Gharial } from "../classes/pets/puppy/tier-4/gharial.class";

@Injectable({
    providedIn: 'root'
})
export class PetService {

    turtlePackPets: Map<number, string[]> = new Map();
    puppyPackPets: Map<number, string[]> = new Map();
    // used for spider / stork
    // TODO configurable
    tier3Pets: string[];

    constructor(private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService
    ) {

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
                "Mouse",
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
            "Frigatebird",
            "Robin",
            "Bat",
            "Dromedary",
            "Shrimp",
            "Toucan",
            "Beluga Sturgeon",
            "Tabby Cat",
            "Mandrill",
            "Lemur"
        ])

        this.puppyPackPets.set(3, [
            "Hoopoe Bird",
            "Tropical Fish",
            "Hatching Chick",
            "Goldfish",
            "Owl",
            "Mole",
            "Raccoon",
            "Flying Squirrel",
            "Pangolin",
            "Puppy"
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
            "Gharial"
        ])

        this.puppyPackPets.set(6, [
            "Tiger" // temp
        ])

        this.tier3Pets = this.turtlePackPets.get(3);
        this.gameService.setTierGroupPets(this.tier3Pets);
    }

    createPet(petForm: PetForm, parent: Player): Pet {
        switch(petForm.name) {
            case 'Ant':
                return new Ant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Cricket':
                return new Cricket(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Fish':
                return new Fish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Horse':
                return new Horse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mosquito':
                return new Mosquito(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Duck':
                return new Duck(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Beaver':
                return new Beaver(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Otter':
                return new Otter(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Pig':
                return new Pig(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mouse':
                return new Mouse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Snail':
                return new Snail(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Crab':
                return new Crab(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Swan':
                return new Swan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rat':
                return new Rat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Hedgehog':
                return new Hedgehog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Peacock':
                return new Peacock(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Flamingo':
                return new Flamingo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Worm':
                return new Worm(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Kangaroo':
                return new Kangaroo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Spider':
                return new Spider(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dodo':
                return new Dodo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Badger':
                return new Badger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dolphin':
                return new Dolphin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Giraffe':
                return new Giraffe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Elephant':
                return new Elephant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Camel':
                return new Camel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rabbit':
                return new Rabbit(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Ox':
                return new Ox(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dog':
                return new Dog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Sheep':
                return new Sheep(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        
            // tier 4
            case 'Skunk':
                return new Skunk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Hippo':
                return new Hippo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Bison':
                return new Bison(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Blowfish':
                return new Blowfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Turtle':
                return new Turtle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Squirrel':
                return new Squirrel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Penguin':
                return new Penguin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Deer':
                return new Deer(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Whale':
                return new Whale(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Parrot':
                return new Parrot(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);

            // tier 5
            case 'Scorpion':
                return new Scorpion(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Crocodile':
                return new Crocodile(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rhino':
                return new Rhino(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Monkey':
                return new Monkey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Armadillo':
                return new Armadillo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Cow':
                return new Cow(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Seal':
                return new Seal(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Rooster':
                return new Rooster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Shark':
                return new Shark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Turkey':
                return new Turkey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);

            // tier 6
            case 'Leopard':
                return new Leopard(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Boar':
                return new Boar(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Tiger':
                return new Tiger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Wolverine':
                return new Wolverine(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Gorilla':
                return new Gorilla(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dragon':
                return new Dragon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mammoth':
                return new Mammoth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Cat':
                return new Cat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Snake':
                return new Snake(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Fly':
                return new Fly(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        
            // Puppy
            // Tier 1
            case 'Moth':
                return new Moth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Bluebird':
                return new Bluebird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Chinchilla':
                return new Chinchilla(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Beetle':
                return new Beetle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Ladybug':
                return new Ladybug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Chipmunk':
                return new Chipmunk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Gecko':
                return new Gecko(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Ferret':
                return new Ferret(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        
            // tier 2
            case 'Frigatebird':
                return new Frigatebird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Robin':
                return new Robin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Bat':
                return new Bat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Dromedary':
                return new Dromedary(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Shrimp':
                return new Shrimp(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Toucan':
                return new Toucan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Beluga Sturgeon':
                return new BelugaSturgeon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Tabby Cat':
                return new TabbyCat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mandrill':
                return new Mandrill(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Lemur':
                return new Lemur(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Hoopoe Bird':
                return new HoopoeBird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Tropical Fish':
                return new TropicalFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Hatching Chick':
                return new HatchingChick(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Goldfish':
                return new Goldfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Owl':
                return new Owl(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Mole':
                return new Mole(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Raccoon':
                return new Raccoon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Flying Squirrel':
                return new FlyingSquirrel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Pangolin':
                return new Pangolin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Puppy':
                return new Puppy(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            
            // tier 4
            case 'Microbe':
                return new Microbe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Lobster':
                return new Lobster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Buffalo':
                return new Buffalo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Llama':
                return new Llama(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Caterpillar':
                return new Caterpillar(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Doberman':
                return new Doberman(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Tahr':
                return new Tahr(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Whale Shark':
                return new WhaleShark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Chameleon':
                return new Chameleon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
            case 'Gharial':
                return new Gharial(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.exp, petForm.equipment);
        }
    }

    createDefaultVersionOfPet(pet: Pet, attack: number = null, health: number = null) {
        let newPet;
        if (pet instanceof Ant) {
            newPet = new Ant(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Bee) {
            newPet = new Bee(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Cricket) {
            newPet = new Cricket(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Fish) {
            newPet = new Fish(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Horse) {
            newPet = new Horse(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Mosquito) {
            newPet = new Mosquito(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof ZombieCricket) {
            newPet = new ZombieCricket(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Duck) {
            newPet = new Duck(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Beaver) {
            newPet = new Beaver(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Otter) {
            newPet = new Otter(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Pig) {
            newPet = new Pig(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Mouse) {
            newPet = new Mouse(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Crab) {
            newPet = new Crab(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Swan) {
            newPet = new Swan(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Rat) {
            newPet = new Rat(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Hedgehog) {
            newPet = new Hedgehog(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Peacock) {
            newPet = new Peacock(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Flamingo) {
            newPet = new Flamingo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Worm) {
            newPet = new Worm(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Kangaroo) {
            newPet = new Kangaroo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Spider) {
            newPet = new Spider(this.logService, this.abilityService, this, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Dodo) {
            newPet = new Dodo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Badger) {
            newPet = new Badger(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Dolphin) {
            newPet = new Dolphin(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Giraffe) {
            newPet = new Giraffe(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Elephant) {
            newPet = new Elephant(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Camel) {
            newPet = new Camel(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Rabbit) {
            newPet = new Rabbit(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Ox) {
            newPet = new Ox(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Dog) {
            newPet = new Dog(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Sheep) {
            newPet = new Sheep(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        
        // tier 4
        if (pet instanceof Skunk) {
            newPet = new Skunk(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Hippo) {
            newPet = new Hippo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Bison) {
            newPet = new Bison(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Blowfish) {
            newPet = new Blowfish(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Turtle) {
            newPet = new Turtle(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Squirrel) {
            newPet = new Squirrel(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Penguin) {
            newPet = new Penguin(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Deer) {
            newPet = new Deer(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Whale) {
            newPet = new Whale(this.logService, this.abilityService, this, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Parrot) {
            newPet = new Parrot(this.logService, this.abilityService, this, pet.parent, attack, health, levelToExp(pet.level));
        }

        // tier 5

        if (pet instanceof Scorpion) {
            newPet = new Scorpion(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Crocodile) {
            newPet = new Crocodile(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Rhino) {
            newPet = new Rhino(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Monkey) {
            newPet = new Monkey(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Armadillo) {
            newPet = new Armadillo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Cow) {
            newPet = new Cow(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Seal) {
            newPet = new Seal(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Rooster) {
            newPet = new Rooster(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Shark) {
            newPet = new Shark(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Turkey) {
            newPet = new Turkey(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }

        // tier 6
        if (pet instanceof Leopard) {
            newPet = new Leopard(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Boar) {
            newPet = new Boar(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Tiger) {
            newPet = new Tiger(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Wolverine) {
            newPet = new Wolverine(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Gorilla) {
            newPet = new Gorilla(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Dragon) {
            newPet = new Dragon(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Mammoth) {
            newPet = new Mammoth(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Cat) {
            newPet = new Cat(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Snake) {
            newPet = new Snake(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Fly) {
            newPet = new Fly(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }

        // Puppy
        // Tier 1
        if (pet instanceof Moth) {
            newPet = new Moth(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Bluebird) {
            newPet = new Bluebird(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Chinchilla) {
            newPet = new Chinchilla(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Beetle) {
            newPet = new Beetle(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Ladybug) {
            newPet = new Ladybug(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Chipmunk) {
            newPet = new Chipmunk(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Gecko) {
            newPet = new Gecko(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Ferret) {
            newPet = new Ferret(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }

        // Tier 2
        if (pet instanceof Frigatebird) {
            newPet = new Frigatebird(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Robin) {
            newPet = new Robin(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Bat) {
            newPet = new Bat(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Dromedary) {
            newPet = new Dromedary(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Shrimp) {
            newPet = new Shrimp(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Toucan) {
            newPet = new Toucan(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof BelugaSturgeon) {
            newPet = new BelugaSturgeon(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof TabbyCat) {
            newPet = new TabbyCat(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Mandrill) {
            newPet = new Mandrill(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Lemur) {
            newPet = new Lemur(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }

        // Tier 3
        if (pet instanceof HoopoeBird) {
            newPet = new HoopoeBird(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof TropicalFish) {
            newPet = new TropicalFish(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof HatchingChick) {
            newPet = new HatchingChick(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Goldfish) {
            newPet = new Goldfish(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Owl) {
            newPet = new Owl(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Mole) {
            newPet = new Mole(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Raccoon) {
            newPet = new Raccoon(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof FlyingSquirrel) {
            newPet = new FlyingSquirrel(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Pangolin) {
            newPet = new Pangolin(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Puppy) {
            newPet = new Puppy(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        // Tier 4
        if (pet instanceof Microbe) {
            newPet = new Microbe(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Lobster) {
            newPet = new Lobster(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Buffalo) {
            newPet = new Buffalo(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Llama) {
            newPet = new Llama(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Caterpillar) {
            newPet = new Caterpillar(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Doberman) {
            newPet = new Doberman(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Tahr) {
            newPet = new Tahr(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof WhaleShark) {
            newPet = new WhaleShark(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Chameleon) {
            newPet = new Chameleon(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }
        if (pet instanceof Gharial) {
            newPet = new Gharial(this.logService, this.abilityService, pet.parent, attack, health, levelToExp(pet.level));
        }

        return newPet;
    }

    getRandomPet(parent: Player) {
        let tier = getRandomInt(1, 3);
        let pets;
        if (parent.pack == 'Turtle') {
            pets = this.turtlePackPets.get(tier);
        } else if (parent.pack == 'Puppy') {
            pets = this.puppyPackPets.get(tier);
        }
        let petNum = getRandomInt(0, pets.length - 1);
        let pet = pets[petNum];
        return this.createPet(
            {
                attack: null,
                equipment: null,
                exp: getRandomInt(0, 5),
                health: null,
                name: pet
            },
            parent
        )
    }
}

export interface PetForm {
    name: string;
    attack: number;
    health: number;
    exp: number;
    equipment: Equipment;
}

function levelToExp(level: number) {
    return level == 1 ? 0 : level == 2 ? 2 : 5;
}