import { Ant } from "../../../classes/pets/turtle/tier-1/ant.class";
import { Cricket } from "../../../classes/pets/turtle/tier-1/cricket.class";
import { Fish } from "../../../classes/pets/turtle/tier-1/fish.class";
import { Horse } from "../../../classes/pets/turtle/tier-1/horse.class";
import { Mosquito } from "../../../classes/pets/turtle/tier-1/mosquito.class";
import { Duck } from "../../../classes/pets/turtle/tier-1/duck.class";
import { Beaver } from "../../../classes/pets/turtle/tier-1/beaver.class";
import { Otter } from "../../../classes/pets/turtle/tier-1/otter.class";
import { Pig } from "../../../classes/pets/turtle/tier-1/pig.class";
import { Pigeon } from "../../../classes/pets/turtle/tier-1/pigeon.class";
import { Snail } from "../../../classes/pets/turtle/tier-2/snail.class";
import { Crab } from "../../../classes/pets/turtle/tier-2/crab.class";
import { Swan } from "../../../classes/pets/turtle/tier-2/swan.class";
import { Rat } from "../../../classes/pets/turtle/tier-2/rat.class";
import { Hedgehog } from "../../../classes/pets/turtle/tier-2/hedgehog.class";
import { Peacock } from "../../../classes/pets/turtle/tier-2/peacock.class";
import { Flamingo } from "../../../classes/pets/turtle/tier-2/flamingo.class";
import { Worm } from "../../../classes/pets/turtle/tier-2/worm.class";
import { Kangaroo } from "../../../classes/pets/turtle/tier-2/kangaroo.class";
import { Spider } from "../../../classes/pets/turtle/tier-2/spider.class";
import { Dodo } from "../../../classes/pets/turtle/tier-3/dodo.class";
import { Badger } from "../../../classes/pets/turtle/tier-3/badger.class";
import { Dolphin } from "../../../classes/pets/turtle/tier-3/dolphin.class";
import { Giraffe } from "../../../classes/pets/turtle/tier-3/giraffe.class";
import { Elephant } from "../../../classes/pets/turtle/tier-3/elephant.class";
import { Camel } from "../../../classes/pets/turtle/tier-3/camel.class";
import { Rabbit } from "../../../classes/pets/turtle/tier-3/rabbit.class";
import { Ox } from "../../../classes/pets/turtle/tier-3/ox.class";
import { Dog } from "../../../classes/pets/turtle/tier-3/dog.class";
import { Sheep } from "../../../classes/pets/turtle/tier-3/sheep.class";
import { Parrot } from "../../../classes/pets/turtle/tier-4/parrot.class";
import { Skunk } from "../../../classes/pets/turtle/tier-4/skunk.class";
import { Hippo } from "../../../classes/pets/turtle/tier-4/hippo.class";
import { Bison } from "../../../classes/pets/turtle/tier-4/bison.class";
import { Blowfish } from "../../../classes/pets/turtle/tier-4/blowfish.class";
import { Turtle } from "../../../classes/pets/turtle/tier-4/turtle.class";
import { Squirrel } from "../../../classes/pets/turtle/tier-4/squirrel.class";
import { Penguin } from "../../../classes/pets/turtle/tier-4/penguin.class";
import { Deer } from "../../../classes/pets/turtle/tier-4/deer.class";
import { Whale } from "../../../classes/pets/turtle/tier-4/whale.class";
import { Scorpion } from "../../../classes/pets/turtle/tier-5/scorpion.class";
import { Crocodile } from "../../../classes/pets/turtle/tier-5/crocodile.class";
import { Rhino } from "../../../classes/pets/turtle/tier-5/rhino.class";
import { Monkey } from "../../../classes/pets/turtle/tier-5/monkey.class";
import { Armadillo } from "../../../classes/pets/turtle/tier-5/armadillo.class";
import { Cow } from "../../../classes/pets/turtle/tier-5/cow.class";
import { Seal } from "../../../classes/pets/turtle/tier-5/seal.class";
import { Rooster } from "../../../classes/pets/turtle/tier-5/rooster.class";
import { Shark } from "../../../classes/pets/turtle/tier-5/shark.class";
import { Turkey } from "../../../classes/pets/turtle/tier-5/turkey.class";
import { Leopard } from "../../../classes/pets/turtle/tier-6/leopard.class";
import { Boar } from "../../../classes/pets/turtle/tier-6/boar.class";
import { Tiger } from "../../../classes/pets/turtle/tier-6/tiger.class";
import { Wolverine } from "../../../classes/pets/turtle/tier-6/wolverine.class";
import { Gorilla } from "../../../classes/pets/turtle/tier-6/gorilla.class";
import { Dragon } from "../../../classes/pets/turtle/tier-6/dragon.class";
import { Mammoth } from "../../../classes/pets/turtle/tier-6/mammoth.class";
import { Cat } from "../../../classes/pets/turtle/tier-6/cat.class";
import { Snake } from "../../../classes/pets/turtle/tier-6/snake.class";
import { Fly } from "../../../classes/pets/turtle/tier-6/fly.class";

export const TURTLE_PET_REGISTRY: { [key: string]: any } = {
  'Ant': Ant,
  'Cricket': Cricket,
  'Fish': Fish,
  'Horse': Horse,
  'Mosquito': Mosquito,
  'Duck': Duck,
  'Beaver': Beaver,
  'Otter': Otter,
  'Pig': Pig,
  'Pigeon': Pigeon,
  'Snail': Snail,
  'Crab': Crab,
  'Swan': Swan,
  'Rat': Rat,
  'Hedgehog': Hedgehog,
  'Peacock': Peacock,
  'Flamingo': Flamingo,
  'Worm': Worm,
  'Kangaroo': Kangaroo,
  'Spider': Spider,
  'Dodo': Dodo,
  'Badger': Badger,
  'Dolphin': Dolphin,
  'Giraffe': Giraffe,
  'Elephant': Elephant,
  'Camel': Camel,
  'Rabbit': Rabbit,
  'Ox': Ox,
  'Dog': Dog,
  'Sheep': Sheep,
  'Parrot': Parrot,
  'Skunk': Skunk,
  'Hippo': Hippo,
  'Bison': Bison,
  'Blowfish': Blowfish,
  'Turtle': Turtle,
  'Squirrel': Squirrel,
  'Penguin': Penguin,
  'Deer': Deer,
  'Whale': Whale,
  'Scorpion': Scorpion,
  'Crocodile': Crocodile,
  'Rhino': Rhino,
  'Monkey': Monkey,
  'Armadillo': Armadillo,
  'Cow': Cow,
  'Seal': Seal,
  'Rooster': Rooster,
  'Shark': Shark,
  'Turkey': Turkey,
  'Leopard': Leopard,
  'Boar': Boar,
  'Tiger': Tiger,
  'Wolverine': Wolverine,
  'Gorilla': Gorilla,
  'Dragon': Dragon,
  'Mammoth': Mammoth,
  'Cat': Cat,
  'Snake': Snake,
  'Fly': Fly
};
