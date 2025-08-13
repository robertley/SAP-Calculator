import { Injectable } from "@angular/core";
import { Pet } from "../classes/pet.class";
import { Ant } from "../classes/pets/turtle/tier-1/ant.class";
import { LogService } from "./log.service";
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
import { Mouse } from "../classes/pets/custom/tier-1/mouse.class";
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
import { Bilby } from "../classes/pets/puppy/tier-2/bilby.class";
import { Robin } from "../classes/pets/puppy/tier-2/robin.class";
import { Dromedary } from "../classes/pets/puppy/tier-2/dromedary.class";
import { Shrimp } from "../classes/pets/puppy/tier-2/shrimp.class";
import { Toucan } from "../classes/pets/puppy/tier-3/toucan.class";
import { BelugaSturgeon } from "../classes/pets/puppy/tier-2/beluga-sturgeon.class";
import { TabbyCat } from "../classes/pets/puppy/tier-2/tabby-cat.class";
import { Mandrill } from "../classes/pets/puppy/tier-2/mandrill.class";
import { Lemur } from "../classes/pets/puppy/tier-2/lemur.class";
import { HoopoeBird } from "../classes/pets/puppy/tier-3/hoopoe-bird.class";
import { TropicalFish } from "../classes/pets/puppy/tier-3/tropical-fish.class";
import { HatchingChick } from "../classes/pets/puppy/tier-3/hatching-chick.class";
import { Goldfish } from "../classes/pets/puppy/tier-2/goldfish.class";
import { Owl } from "../classes/pets/puppy/tier-3/owl.class";
import { Mole } from "../classes/pets/puppy/tier-3/mole.class";
import { Raccoon } from "../classes/pets/custom/tier-5/raccoon.class";
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
import { Stonefish } from "../classes/pets/puppy/tier-5/stonefish.class";
import { Poodle } from "../classes/pets/custom/tier-5/poodle.class";
import { Chicken } from "../classes/pets/puppy/tier-5/chicken.class";
import { Eagle } from "../classes/pets/puppy/tier-5/eagles.class";
import { OrchidMantis } from "../classes/pets/puppy/tier-5/orchid-mantis.class";
import { Panther } from "../classes/pets/puppy/tier-5/panther.class";
import { Axolotl } from "../classes/pets/puppy/tier-5/axolotl.class";
import { Goat } from "../classes/pets/puppy/tier-5/goat.class";
import { SnappingTurtle } from "../classes/pets/puppy/tier-5/snapping-turtle.class";
import { Mosasaurus } from "../classes/pets/puppy/tier-5/mosasaurus.class";
import { StringRay } from "../classes/pets/puppy/tier-5/string-ray.class";
import { MantisShrimp } from "../classes/pets/puppy/tier-6/mantis-shrimp.class";
import { Lionfish } from "../classes/pets/puppy/tier-6/lion-fish.class";
import { Tyrannosaurus } from "../classes/pets/puppy/tier-6/tyrannosaurus.class";
import { Octopus } from "../classes/pets/puppy/tier-6/octopus.class";
import { Anglerfish } from "../classes/pets/puppy/tier-6/anglerfish.class";
import { Sauropod } from "../classes/pets/puppy/tier-6/sauropod.class";
import { ElephantSeal } from "../classes/pets/puppy/tier-6/elephant-seal.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { Mongoose } from "../classes/pets/puppy/tier-6/mongoose.class";
import { Pillbug } from "../classes/pets/star/tier-1/pillbug.class";
import { Duckling } from "../classes/pets/star/tier-1/duckling.class";
import { Cockroach } from "../classes/pets/star/tier-1/cockroach.class";
import { Frog } from "../classes/pets/star/tier-1/frog.class";
import { Seahorse } from "../classes/pets/star/tier-1/seahorse.class";
import { Iguana } from "../classes/pets/star/tier-1/iguana.class";
import { Hummingbird } from "../classes/pets/star/tier-1/hummingbird.class";
import { Koala } from "../classes/pets/star/tier-2/koala.class";
import { Yak } from "../classes/pets/star/tier-2/yak.class.";
import { DumboOctopus } from "../classes/pets/star/tier-2/dumbo-octopus.class";
import { Salamander } from "../classes/pets/star/tier-2/salamander.class";
import { Panda } from "../classes/pets/star/tier-2/panda.class";
import { GuineaPig } from "../classes/pets/star/tier-2/guinea-pig.class";
import { Pug } from "../classes/pets/star/tier-2/pug.class";
import { Jellyfish } from "../classes/pets/star/tier-2/jellyfish.class";
import { AtlanticPuffin } from "../classes/pets/star/tier-2/atlantic-puffin.class";
import { Dove } from "../classes/pets/star/tier-2/dove.class";
import { Stork } from "../classes/pets/star/tier-2/stork.class";
import { Leech } from "../classes/pets/star/tier-3/leech.class";
import { Woodpecker } from "../classes/pets/star/tier-3/woodpecker.class";
import { Toad } from "../classes/pets/star/tier-3/toad.class";
import { Starfish } from "../classes/pets/star/tier-3/starfish.class";
import { Clownfish } from "../classes/pets/star/tier-3/clownfish.class";
import { Blobfish } from "../classes/pets/star/tier-3/blobfish.class";
import { Cabybara } from "../classes/pets/star/tier-3/capybara.class";
import { Okapi } from "../classes/pets/star/tier-3/okapi.class";
import { Cassowary } from "../classes/pets/star/tier-3/cassowary.class";
import { Orangutang } from "../classes/pets/star/tier-4/orangutang.class";
import { Eel } from "../classes/pets/star/tier-4/eel.class";
import { Hawk } from "../classes/pets/star/tier-4/hawk.class";
import { Platypus } from "../classes/pets/star/tier-4/platypus.class";
import { PrayingMantis } from "../classes/pets/star/tier-4/praying-mantis.class";
import { Crow } from "../classes/pets/star/tier-4/crow.class";
import { Donkey } from "../classes/pets/star/tier-4/donkey.class";
import { Pelican } from "../classes/pets/star/tier-4/pelican.class";
import { Anteater } from "../classes/pets/star/tier-4/anteater.class";
import { SwordFish } from "../classes/pets/star/tier-5/sword-fish.class";
import { PolarBear } from "../classes/pets/star/tier-5/polar-bear.class";
import { SiberianHuskey } from "../classes/pets/star/tier-5/siberian-huskey.class";
import { Lion } from "../classes/pets/star/tier-5/lion.class";
import { Triceratops } from "../classes/pets/star/tier-5/triceratops.class";
import { Zebra } from "../classes/pets/star/tier-5/zebra.class";
import { Fox } from "../classes/pets/star/tier-5/fox.class";
import { Hamster } from "../classes/pets/star/tier-5/hamster.class";
import { Shoebill } from "../classes/pets/star/tier-5/shoebill.class";
import { Vulture } from "../classes/pets/star/tier-5/vulture.class";
import { Komodo } from "../classes/pets/star/tier-6/komodo.class";
import { Ostrich } from "../classes/pets/star/tier-6/ostrich.class";
import { Reindeer } from "../classes/pets/star/tier-6/reindeer.class";
import { Stegosaurus } from "../classes/pets/star/tier-6/stegosaurus.class";
import { Piranha } from "../classes/pets/star/tier-6/piranha.class";
import { HammerheadShark } from "../classes/pets/star/tier-6/hammerhead-shark.class";
import { Velociraptor } from "../classes/pets/star/tier-6/velociraptor.class";
import { SabertoothTiger } from "../classes/pets/star/tier-6/sabertooth-tiger.class";
import { Orca } from "../classes/pets/star/tier-6/orca.class";
import { Spinosaurus } from "../classes/pets/star/tier-6/spinosaurus.class";
import { Bulldog } from "../classes/pets/golden/tier-1/bulldog.class";
import { Groundhog } from "../classes/pets/golden/tier-1/groundhog.class";
import { ConeSnail } from "../classes/pets/golden/tier-1/cone-snail.class";
import { Goose } from "../classes/pets/golden/tier-1/goose.class";
import { PiedTamarin } from "../classes/pets/golden/tier-1/pied-tamarin.class";
import { Silkmoth } from "../classes/pets/golden/tier-1/silkmoth.class";
import { Lemming } from "../classes/pets/golden/tier-1/lemming.class";
import { Magpie } from "../classes/pets/golden/tier-1/magpie.class";
import { HerculesBeetle } from "../classes/pets/golden/tier-2/hercules-beetle.class";
import { Stoat } from "../classes/pets/golden/tier-2/stoat.class";
import { BlackNeckedStilt } from "../classes/pets/golden/tier-2/black-necked-stilt.class";
import { Squid } from "../classes/pets/golden/tier-2/squid.class";
import { SeaUrchin } from "../classes/pets/golden/tier-2/sea-urchin.class";
import { DoorHeadAnt } from "../classes/pets/golden/tier-2/door-head-ant.class";
import { Lizard } from "../classes/pets/golden/tier-2/lizard.class";
import { SeaTurtle } from "../classes/pets/golden/tier-2/sea-turtle.class";
import { AfricanPenguin } from "../classes/pets/golden/tier-2/african-penguin.class";
import { MuskOx } from "../classes/pets/golden/tier-3/musk-ox.class";
import { Flea } from "../classes/pets/golden/tier-3/flea.class";
import { SurgeonFish } from "../classes/pets/golden/tier-3/surgeon-fish.class";
import { Weasel } from "../classes/pets/golden/tier-3/weasel.class";
import { Guineafowl } from "../classes/pets/golden/tier-3/guineafowl.class";
import { BettaFish } from "../classes/pets/custom/tier-3/betta-fish.class";
import { Meerkat } from "../classes/pets/golden/tier-2/meerkat.class";
import { FlyingFish } from "../classes/pets/golden/tier-3/flying-fish.class";
import { Baboon } from "../classes/pets/golden/tier-3/baboon.class";
import { Osprey } from "../classes/pets/golden/tier-3/osprey.class";
import { Manatee } from "../classes/pets/golden/tier-4/manatee.class";
import { Cuttlefish } from "../classes/pets/golden/tier-4/cuttlefish.class";
import { EgyptianVulture } from "../classes/pets/golden/tier-4/egyptian-vulture.class";
import { SaigaAntelope } from "../classes/pets/golden/tier-4/saiga-antelope.class";
import { Sealion } from "../classes/pets/golden/tier-4/sealion.class";
import { Vaquita } from "../classes/pets/golden/tier-4/vaquita.class";
import { Slug } from "../classes/pets/golden/tier-4/slug.class";
import { PoisonDartFrog } from "../classes/pets/golden/tier-4/poison-dart-frog.class";
import { SecretaryBird } from "../classes/pets/golden/tier-5/secretary-bird.class";
import { RoyalFlycatcher } from "../classes/pets/golden/tier-3/royal-flycatcher.class";
import { Falcon } from "../classes/pets/golden/tier-4/falcon.class";
import { MantaRay } from "../classes/pets/golden/tier-4/manta-ray.class";
import { Macaque } from "../classes/pets/golden/tier-5/macaque.class";
import { Nyala } from "../classes/pets/golden/tier-5/nyala.class";
import { NurseShark } from "../classes/pets/golden/tier-5/nurse-shark.class";
import { BelugaWhale } from "../classes/pets/golden/tier-5/beluga-whale.class";
import { Wolf } from "../classes/pets/golden/tier-5/wolf.class";
import { SilverFox } from "../classes/pets/custom/tier-5/silver-fox.class";
import { FireAnt } from "../classes/pets/golden/tier-5/fire-ant.class";
import { Cockatoo } from "../classes/pets/golden/tier-5/cockatoo.class";
import { BlueRingedOctopus } from "../classes/pets/golden/tier-5/blue-ringed-octopus.class";
import { Crane } from "../classes/pets/golden/tier-5/crane.class";
import { Emu } from "../classes/pets/golden/tier-5/emu.class";
import { Wildebeast } from "../classes/pets/golden/tier-6/wildebeast.class";
import { HighlandCow } from "../classes/pets/golden/tier-6/highland-cow.class";
import { Catfish } from "../classes/pets/golden/tier-6/catfish.class";
import { Pteranodon } from "../classes/pets/golden/tier-6/pteranodon.class";
import { Warthog } from "../classes/pets/golden/tier-6/warthog.class";
import { Cobra } from "../classes/pets/golden/tier-6/cobra.class";
import { GrizzlyBear } from "../classes/pets/golden/tier-6/grizzly-bear.class";
import { GermanShephard } from "../classes/pets/golden/tier-6/german-shephard.class";
import { BirdOfParadise } from "../classes/pets/golden/tier-6/bird-of-paradise.class";
import { Oyster } from "../classes/pets/golden/tier-6/oyster.class";
import { Bus } from "../classes/pets/hidden/bus.class";
import { Butterfly } from "../classes/pets/hidden/butterfly.class";
import { Chick } from "../classes/pets/hidden/chick.class";
import { DirtyRat } from "../classes/pets/hidden/dirty-rat.class";
import { GoldenRetriever } from "../classes/pets/hidden/golden-retriever.class";
import { LizardTail } from "../classes/pets/hidden/lizard-tail.class";
import { Nest } from "../classes/pets/hidden/nest.class";
import { Ram } from "../classes/pets/hidden/ram.class";
import { SmallerSlug } from "../classes/pets/hidden/smaller-slug.class";
import { SmallestSlug } from "../classes/pets/hidden/smallest-slug.class";
import { ZombieFly } from "../classes/pets/hidden/zombie-fly.class";
import { Marmoset } from "../classes/pets/star/tier-1/marmoset.class";
import { FormArray } from "@angular/forms";
import { Jerboa } from "../classes/pets/custom/tier-4/jerboa.class";
import { FrilledDragon } from "app/classes/pets/custom/tier-1/frilled-dragon";
import { Wombat } from "app/classes/pets/custom/tier-2/wombat.class";
import { Frigatebird } from "../classes/pets/custom/tier-2/frigatebird.class";
import { Aardvark } from "app/classes/pets/custom/tier-3/aardvark.class";
import { Bear } from "app/classes/pets/golden/tier-3/bear.class";
import { EmperorTamarin } from "app/classes/pets/custom/tier-3/emperor-tamarin";
import { Porcupine } from "app/classes/pets/custom/tier-3/porcupine.class";
import { Wasp } from "app/classes/pets/custom/tier-3/wasp.class";
import { Dragonfly } from "../classes/pets/custom/tier-4/dragonfly.class";
import { Lynx } from "../classes/pets/custom/tier-4/lynx.class";
import { Seagull } from "../classes/pets/custom/tier-4/seagull.class";
import { EquipmentService } from "./equipment.service";
import { Alpaca } from "../classes/pets/custom/tier-5/alpaca.class";
import { Hyena } from "../classes/pets/custom/tier-5/hyena.class";
import { Moose } from "../classes/pets/custom/tier-5/moose.class";
import { Lioness } from "../classes/pets/custom/tier-6/lioness.class";
import { Tapir } from "../classes/pets/custom/tier-6/tapir.class";
import { Walrus } from "../classes/pets/custom/tier-6/walrus.class";
import { WhiteTiger } from "../classes/pets/custom/tier-6/white-tiger.class";
import { Opossum } from "../classes/pets/golden/tier-1/oposum.class";
import { Kiwi } from "../classes/pets/star/tier-1/kiwi.class";
import { Pigeon } from "../classes/pets/turtle/tier-1/pigeon.class";
import { Hare } from "../classes/pets/puppy/tier-3/hare.class";
import { Baku } from "../classes/pets/unicorn/tier-1/baku.class";
import { QuestionMarks } from '../classes/pets/unicorn/tier-1/question-marks.class';
import { AxehandleHound } from "../classes/pets/unicorn/tier-1/axehandle-hound.class";
import { Barghest } from "../classes/pets/unicorn/tier-1/barghest.class";
import { Tsuchinoko } from "../classes/pets/unicorn/tier-1/tsuchinoko.class";
import { Murmel } from "../classes/pets/unicorn/tier-1/murmel.class";
import { Alchemedes } from "../classes/pets/unicorn/tier-1/alchemedes.class";
import { Pengobble } from '../classes/pets/unicorn/tier-1/pengobble.class';
import { Warf } from "../classes/pets/unicorn/tier-1/warf.class";
import { Bunyip } from "../classes/pets/unicorn/tier-1/bunyip.class";
import { SneakyEgg } from "../classes/pets/unicorn/tier-1/sneaky-egg.class";
import { CrackedEgg } from "../classes/pets/hidden/cracked-egg.class";
import { CuddleToad } from "../classes/pets/unicorn/tier-1/cuddle-toad.class";
import { GhostKitten } from "../classes/pets/unicorn/tier-2/ghost-kitten.class";
import { FrostWolf } from "../classes/pets/unicorn/tier-2/frost-wolf.class";
import { Mothman } from "../classes/pets/unicorn/tier-2/mothman.class";
import { DropBear } from "../classes/pets/unicorn/tier-2/drop-bear.class";
import { Jackalope } from "../classes/pets/unicorn/tier-2/jackalope.class";
import { LuckyCat } from "../classes/pets/unicorn/tier-3/lucky-cat.class";
import { Ogopogo } from "../classes/pets/unicorn/tier-2/ogopogo.class";
import { Thunderbird } from "../classes/pets/unicorn/tier-2/thunderbird.class";
import { Gargoyle } from "../classes/pets/unicorn/tier-2/gargoyle.class";
import { Bigfoot } from "../classes/pets/unicorn/tier-2/bigfoot.class";
import { SkeletonDog } from "../classes/pets/unicorn/tier-3/skeleton-dog.class";
import { Mandrake } from "../classes/pets/unicorn/tier-3/mandrake.class";
import { FurBearingTrout } from "../classes/pets/unicorn/tier-3/fur-bearing-trout.class";
import { ManaHound } from "../classes/pets/unicorn/tier-3/mana-hound.class";
import { Calygreyhound } from "../classes/pets/unicorn/tier-3/calygreyhound.class";
import { BrainCramp } from "../classes/pets/unicorn/tier-3/brain-cramp.class";
import { Minotaur } from "../classes/pets/unicorn/tier-4/minotaur.class";
import { Wyvern } from "../classes/pets/unicorn/tier-2/wyvern.class";
import { Ouroboros } from "../classes/pets/unicorn/tier-3/ouroboros.class";
import { Griffin } from "../classes/pets/unicorn/tier-3/griffin.class";
import { Kraken } from "../classes/pets/unicorn/tier-4/kraken.class";
import { Visitor } from "../classes/pets/unicorn/tier-4/visitor.class";
import { VampireBat } from "../classes/pets/unicorn/tier-5/vampire-bat.class";
import { TigerBug } from "../classes/pets/unicorn/tier-4/tiger-bug.class";
import { Tatzelwurm } from "../classes/pets/unicorn/tier-3/tatzelwurm.class";
import { Cyclops } from "../classes/pets/unicorn/tier-4/cyclops.class";
import { Chimera } from "../classes/pets/unicorn/tier-4/chimera.class";
import { Roc } from "../classes/pets/unicorn/tier-4/roc.class";
import { WormOfSand } from "../classes/pets/unicorn/tier-4/worm-of-sand.class";
import { Abomination } from "../classes/pets/unicorn/tier-4/abomination.class";
import { RedDragon } from "../classes/pets/unicorn/tier-5/red-dragon.class";
import { Unicorn } from "../classes/pets/unicorn/tier-4/unicorn.class";
import { LovelandFrogman } from "../classes/pets/unicorn/tier-5/loveland-frogman.class";
import { Amalgamation } from "../classes/pets/unicorn/tier-5/amalgamation.class";
import { SalmonOfKnowledge } from "../classes/pets/unicorn/tier-5/salmon-of-knowledge.class";
import { JerseyDevil } from "../classes/pets/unicorn/tier-5/jersey-devil.class";
import { Pixiu } from "../classes/pets/unicorn/tier-5/pixiu.class";
import { Kitsune } from "../classes/pets/unicorn/tier-5/kitsune.class";
import { Nessie } from "../classes/pets/unicorn/tier-5/nessie.class";
import { NessieQ } from "../classes/pets/hidden/nessie-q.class";
import { BadDog } from "../classes/pets/unicorn/tier-5/bad-dog.class";
import { Werewolf } from "../classes/pets/unicorn/tier-5/werewolf.class";
import { Manticore } from "../classes/pets/unicorn/tier-6/manticore.class";
import { Phoenix } from "../classes/pets/unicorn/tier-6/phoenix.class";
import { YoungPhoenix } from "../classes/pets/hidden/young-phoenix.class";
import { Quetzalcoatl } from "../classes/pets/unicorn/tier-6/quetzalcoatl.class";
import { TeamSpirit } from "../classes/pets/unicorn/tier-6/team-spirit.class";
import { Sleipnir } from "../classes/pets/unicorn/tier-6/sleipnir.class";
import { SeaSerpent } from "../classes/pets/unicorn/tier-6/sea-serpent.class";
import { Yeti } from "../classes/pets/unicorn/tier-6/yeti.class";
import { Cerberus } from "../classes/pets/unicorn/tier-6/cerberus.class";
import { FirePup } from "../classes/pets/hidden/fire-pup.class";
import { Hydra } from "../classes/pets/unicorn/tier-6/hydra.class";
import { Behemoth } from "../classes/pets/unicorn/tier-6/behemoth.class";
import { Monty } from "../classes/pets/hidden/monty.class";
import { Rock } from "../classes/pets/hidden/rock.class";
import { Basilisk } from "../classes/pets/custom/tier-1/basilisk.class";
import { Daycrawler } from "../classes/pets/hidden/daycrawler.class";
import { Nightcrawler } from "../classes/pets/custom/tier-2/nightcrawler.class";
import { Sphinx } from "../classes/pets/custom/tier-2/sphinx.class";
import { Chupacabra } from "../classes/pets/custom/tier-2/chupacabra.class";
import { GoldenBeetle } from "../classes/pets/custom/tier-2/golden-beetle.class";
import { FooDog } from "../classes/pets/custom/tier-3/foo-dog.class";
import { Tree } from "../classes/pets/custom/tier-3/tree.class";
import { SmallerSlime } from "../classes/pets/hidden/smaller-slime.class";
import { Slime } from "../classes/pets/custom/tier-3/slime.class";
import { Pegasus } from "../classes/pets/custom/tier-3/pegasus.class";
import { DeerLord } from "../classes/pets/custom/tier-3/deer-lord.class";
import { Fairy } from "../classes/pets/custom/tier-4/fairy.class";
import { Rootling } from "../classes/pets/custom/tier-4/rootling.class";
import { Anubis } from "../classes/pets/custom/tier-4/anubis.class";
import { OldMouse } from "../classes/pets/custom/tier-4/old-mouse.class";
import { Hippocampus } from "../classes/pets/custom/tier-4/hippocampus.class";
import { Boitata } from "../classes/pets/custom/tier-5/boitata.class";
import { Kappa } from "../classes/pets/custom/tier-5/kappa.class";
import { Mimic } from "../classes/pets/custom/tier-5/mimic.class";
import { Nurikabe } from "../classes/pets/custom/tier-5/nurikabe.class";
import { Tandgnost } from "../classes/pets/custom/tier-5/tandgnost.class";
import { Tandgrisner } from "../classes/pets/custom/tier-5/tandgrisner.class";
import { GreatOne } from "../classes/pets/custom/tier-6/great-one.class";
import { Leviathan } from "../classes/pets/custom/tier-6/leviathan.class";
import { QuestingBeast } from "../classes/pets/custom/tier-6/questing-beast.class";
import { Cockatrice } from "../classes/pets/custom/tier-6/cockatrice.class";
import {Albatross} from "../classes/pets/custom/tier-6/albatross.class";
import { ChimGoat } from "../classes/pets/hidden/chim-goat.class";
import { ChimLion } from "../classes/pets/hidden/chim-lion.class";
import { ChimSnake } from "../classes/pets/hidden/chim-snake.class";
import { Head } from "../classes/pets/hidden/head.class";
import { GoodDog } from "../classes/pets/hidden/good-dog.class";

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
    playerCustomPackPets: Map<string, Map<number, string[]>> = new Map();
    allPets: Map<number, string[]> = new Map();
    startOfBattlePets: string[] = [
        "Beetle",
        "Cone Snail",
        "Frilled Dragon",
        "Frog",
        "Gecko",
        "Goose",
        "Hummigbird",
        "Mosquito",
        "Moth",
        "Seahorse",
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
        "Velociraptor",
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
        private gameService: GameService
    ) {
        
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
            "Flying Squirrel",
            "Pangolin",
            "Puppy",
            "Hare"
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
            "String Ray"
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
            "Duckling",
            "Cockroach",
            "Frog",
            "Seahorse",
            "Hummingbird",
            "Marmoset",
            "Kiwi"
        ])

        this.starPackPets.set(2, [
            "Koala",
            "Yak",
            "Salamander",
            "Panda",
            "Guinea Pig",
            "Jellyfish",
            "Atlantic Puffin",
            "Dove",
            "Stork",
            "Iguana",
            "DumboOctopus"
        ])

        this.starPackPets.set(3, [
            "Leech",
            "Woodpecker",
            "Toad",
            "Cabybara",
            "Okapi",
            "Cassowary",
            "Anteater",
            "Pug",
            "Eel",
        ])

        this.starPackPets.set(4, [
            "Orangutang",
            "Hawk",
            "Clownfish",
            "Platypus",
            "Praying Mantis",
            "Crow",
            "Donkey",
            "Pelican",
            "Starfish",
            "Blobfish",
        ])

        this.starPackPets.set(5, [
            "Sword Fish",
            "Polar Bear",
            "Siberian Husky",
            "Lion",
            "Triceratops",
            "Zebra",
            "Fox",
            "Hamster",
            "Shoebill",
            "Vulture"
        ])

        this.starPackPets.set(6, [
            "Komodo",
            "Ostrich",
            "Reindeer",
            "Stegosaurus",
            "Piranha",
            "Hammerhead Shark",
            "Velociraptor",
            "Sabertooth Tiger",
            "Orca",
            "Spinosaurus"
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
            "Bear",
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
            "Wildebeast",
            "Highland Cow",
            "Catfish",
            "Pteranodon",
            "Warthog",
            "Cobra",
            "Grizzly Bear",
            "German Shephard",
            "Bird of Paradise",
            "Oyster"
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

        this.customPackPets.set(1, [
            "Frilled Dragon",
            "Mouse",
            "Basilisk",
        ]);
        this.customPackPets.set(2, [
            "Frigatebird",
            "Wombat",
            "Frigatebird",
            "Nightcrawler",
            "Sphinx",
            "Chupacabra",
            "Golden Beetle"
        ]);
        this.customPackPets.set(3, [
            "Aardvark",
            "Emperor Tamarin",
            "Porcupine",
            "Wasp",
            "Foo Dog",
            "Tree",
            "Slime",
            "Pegasus",
            "Deer Lord",
            "Betta Fish"
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
            "Hippocampus"
        ]);
        this.customPackPets.set(5, [
            "Alpaca",
            "Poodle",
            "Hyena",
            "Moose",
            "Raccoon",
            "Silver Fox",
            "Boitata",
            "Kappa",
            "Mimic",
            "Nurikabe",
            "Tandgnost",
            "Tandgrisner"
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
            "Albatross"
        ]);

        this.setAllPets();
        
    }

    setAllPets() {
        this.allPets = new Map();
        for (let i = 1; i <= 6; i++) {
          this.allPets.set(i, []);
        }
        for (let [tier, pets] of this.turtlePackPets) {
          this.allPets.get(tier).push(...pets);
        }
        for (let [tier, pets] of this.puppyPackPets) {
          this.allPets.get(tier).push(...pets);
        }
        for (let [tier, pets] of this.starPackPets) {
          this.allPets.get(tier).push(...pets);
        }
        for (let [tier, pets] of this.goldenPackPets) {
          this.allPets.get(tier).push(...pets);
        }
        for (let [tier, pets] of this.unicornPackPets) {
          this.allPets.get(tier).push(...pets);
        }
        // remove duplicates from each tier
        for (let [tier, pets] of this.allPets) {
          this.allPets.set(tier, [...new Set(pets)]);
        }
    }

    createPet(petForm: PetForm, parent: Player): Pet {
        switch(petForm.name) {
            case 'Ant':
                return new Ant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cricket':
                return new Cricket(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fish':
                return new Fish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Horse':
                return new Horse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mosquito':
                return new Mosquito(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Duck':
                return new Duck(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Beaver':
                return new Beaver(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Otter':
                return new Otter(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pig':
                return new Pig(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mouse':
                return new Mouse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pigeon':
                return new Pigeon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // tier 2
            case 'Snail':
                return new Snail(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Crab':
                return new Crab(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Swan':
                return new Swan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rat':
                return new Rat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hedgehog':
                return new Hedgehog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Peacock':
                return new Peacock(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Flamingo':
                return new Flamingo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Worm':
                return new Worm(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Kangaroo':
                return new Kangaroo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Spider':
                return new Spider(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dodo':
                return new Dodo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Badger':
                return new Badger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dolphin':
                return new Dolphin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Giraffe':
                return new Giraffe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Elephant':
                return new Elephant(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Camel':
                return new Camel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rabbit':
                return new Rabbit(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ox':
                return new Ox(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dog':
                return new Dog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sheep':
                return new Sheep(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
        
            // tier 4
            case 'Skunk':
                return new Skunk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hippo':
                return new Hippo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bison':
                return new Bison(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Blowfish':
                return new Blowfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Turtle':
                return new Turtle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Squirrel':
                return new Squirrel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Penguin':
                return new Penguin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Deer':
                return new Deer(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Whale':
                return new Whale(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Parrot':
                return new Parrot(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // tier 5
            case 'Scorpion':
                return new Scorpion(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Crocodile':
                return new Crocodile(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rhino':
                return new Rhino(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Monkey':
                return new Monkey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Armadillo':
                return new Armadillo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cow':
                return new Cow(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Seal':
                return new Seal(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rooster':
                return new Rooster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Shark':
                return new Shark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Turkey':
                return new Turkey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // tier 6
            case 'Leopard':
                return new Leopard(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Boar':
                return new Boar(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tiger':
                return new Tiger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Wolverine':
                return new Wolverine(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Gorilla':
                return new Gorilla(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dragon':
                return new Dragon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mammoth':
                return new Mammoth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cat':
                return new Cat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Snake':
                return new Snake(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fly':
                return new Fly(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
        
            // Puppy
            // Tier 1
            case 'Moth':
                return new Moth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bluebird':
                return new Bluebird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chinchilla':
                return new Chinchilla(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Beetle':
                return new Beetle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ladybug':
                return new Ladybug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chipmunk':
                return new Chipmunk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Gecko':
                return new Gecko(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ferret':
                return new Ferret(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
        
            // tier 2
            case 'Robin':
                return new Robin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bat':
                return new Bat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bilby':
                return new Bilby(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dromedary':
                return new Dromedary(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Shrimp':
                return new Shrimp(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Toucan':
                return new Toucan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Beluga Sturgeon':
                return new BelugaSturgeon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tabby Cat':
                return new TabbyCat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mandrill':
                return new Mandrill(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lemur':
                return new Lemur(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hoopoe Bird':
                return new HoopoeBird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tropical Fish':
                return new TropicalFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hatching Chick':
                return new HatchingChick(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Goldfish':
                return new Goldfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Owl':
                return new Owl(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mole':
                return new Mole(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Raccoon':
                return new Raccoon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Flying Squirrel':
                return new FlyingSquirrel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pangolin':
                return new Pangolin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Puppy':
                return new Puppy(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hare':
                return new Hare(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // tier 4
            case 'Microbe':
                return new Microbe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lobster':
                return new Lobster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Buffalo':
                return new Buffalo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Llama':
                return new Llama(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Caterpillar':
                return new Caterpillar(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Doberman':
                return new Doberman(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tahr':
                return new Tahr(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Whale Shark':
                return new WhaleShark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chameleon':
                return new Chameleon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Gharial':
                return new Gharial(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // tier 5
            case 'Stonefish':
                return new Stonefish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Poodle':
                return new Poodle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Goat':
                return new Goat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chicken':
                return new Chicken(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Eagle':
                return new Eagle(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Orchid Mantis':
                return new OrchidMantis(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);           
            case 'Panther':
                return new Panther(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Axolotl':
                return new Axolotl(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Snapping Turtle':
                return new SnappingTurtle(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mosasaurus':
                return new Mosasaurus(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'String Ray':
                return new StringRay(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // tier 6
            case 'Mantis Shrimp':
                return new MantisShrimp(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lionfish':
                return new Lionfish(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tyrannosaurus':
                return new Tyrannosaurus(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Octopus':
                return new Octopus(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Anglerfish':
                return new Anglerfish(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sauropod':
                return new Sauropod(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Elephant Seal':
                return new ElephantSeal(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Puma':
                return new Puma(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mongoose':
                return new Mongoose(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
    
            // Star
            // Tier 1
            case 'Pillbug':
                return new Pillbug(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Duckling':
                return new Duckling(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cockroach':
                return new Cockroach(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Frog':
                return new Frog(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Seahorse':
                return new Seahorse(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Iguana':
                return new Iguana(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hummingbird':
                return new Hummingbird(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Marmoset':
                return new Marmoset(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Kiwi':
                return new Kiwi(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 2
            case 'Koala':
                return new Koala(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Yak':
                return new Yak(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Salamander':
                return new Salamander(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Panda':
                return new Panda(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Guinea Pig':
                return new GuineaPig(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Jellyfish':
                return new Jellyfish(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pug':
                return new Pug(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Atlantic Puffin':
                return new AtlanticPuffin(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dove':
                return new Dove(this.logService, this.abilityService,  parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Stork':
                return new Stork(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'DumboOctopus':
                return new DumboOctopus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            // Tier 3
            case 'Leech':
                return new Leech(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Woodpecker':
                return new Woodpecker(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Toad':
                return new Toad(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Starfish':
                return new Starfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Clownfish':
                return new Clownfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Blobfish':
                return new Blobfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cabybara':
                return new Cabybara(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Okapi':
                return new Okapi(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cassowary':
                return new Cassowary(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 4
            case 'Orangutang':
                return new Orangutang(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Eel':
                return new Eel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hawk':
                return new Hawk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Platypus':
                return new Platypus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Praying Mantis':
                return new PrayingMantis(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Crow':
                return new Crow(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Donkey':
                return new Donkey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pelican':
                return new Pelican(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Anteater':
                return new Anteater(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 5
            case 'Sword Fish':
                return new SwordFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Polar Bear':
                return new PolarBear(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Siberian Husky':
                return new SiberianHuskey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lion':
                return new Lion(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Triceratops':
                return new Triceratops(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Zebra':
                return new Zebra(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fox':
                return new Fox(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hamster':
                return new Hamster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Shoebill':
                return new Shoebill(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Vulture':
                return new Vulture(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 6
            case 'Komodo':
                return new Komodo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ostrich':
                return new Ostrich(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Reindeer':
                return new Reindeer(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Stegosaurus':
                return new Stegosaurus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Piranha':
                return new Piranha(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hammerhead Shark':
                return new HammerheadShark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Velociraptor':
                return new Velociraptor(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sabertooth Tiger':
                return new SabertoothTiger(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Orca':
                return new Orca(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Spinosaurus':
                return new Spinosaurus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Golden
            // Tier 1
            case 'Bulldog':
                return new Bulldog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Groundhog':
                return new Groundhog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cone Snail':
                return new ConeSnail(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Goose':
                return new Goose(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lemming':
                return new Lemming(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pied Tamarin':
                return new PiedTamarin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Opossum':
                return new Opossum(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Silkmoth':
                return new Silkmoth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Magpie':
                return new Magpie(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 2
            case 'Hercules Beetle':
                return new HerculesBeetle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Stoat':
                return new Stoat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Black Necked Stilt':
                return new BlackNeckedStilt(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Squid':
                return new Squid(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sea Urchin':
                return new SeaUrchin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Door Head Ant':
                return new DoorHeadAnt(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lizard':
                return new Lizard(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sea Turtle':
                return new SeaTurtle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'African Penguin':
                return new AfricanPenguin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 3
            case 'Musk Ox':
                return new MuskOx(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Flea':
                return new Flea(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Royal Flycatcher':
                return new RoyalFlycatcher(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Surgeon Fish':
                return new SurgeonFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Weasel':
                return new Weasel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Guineafowl':
                return new Guineafowl(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Betta Fish':
                return new BettaFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Meerkat':
                return new Meerkat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Flying Fish':
                return new FlyingFish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Baboon':
                return new Baboon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Osprey':
                return new Osprey(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 4
            case 'Manatee':
                return new Manatee(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cuttlefish':
                return new Cuttlefish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Egyptian Vulture':
                return new EgyptianVulture(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Saiga Antelope':
                return new SaigaAntelope(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sealion':
                return new Sealion(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Vaquita':
                return new Vaquita(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Slug':
                return new Slug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Poison Dart Frog':
                return new PoisonDartFrog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Secretary Bird':
                return new SecretaryBird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Falcon':
                return new Falcon(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Manta Ray':
                return new MantaRay(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 5
            case 'Macaque':
                return new Macaque(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nyala':
                return new Nyala(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nurse Shark':
                return new NurseShark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Beluga Whale':
                return new BelugaWhale(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment, petForm.belugaSwallowedPet);
            case 'Wolf':
                return new Wolf(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Silver Fox':
                return new SilverFox(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fire Ant':
                return new FireAnt(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cockatoo':
                return new Cockatoo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Blue Ringed Octopus':
                return new BlueRingedOctopus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Crane':
                return new Crane(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Emu':
                return new Emu(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 6
            case 'Wildebeast':
                return new Wildebeast(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Highland Cow':
                return new HighlandCow(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Catfish':
                return new Catfish(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pteranodon':
                return new Pteranodon(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Warthog':
                return new Warthog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cobra':
                return new Cobra(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Grizzly Bear':
                return new GrizzlyBear(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'German Shephard':
                return new GermanShephard(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bird of Paradise':
                return new BirdOfParadise(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Oyster':
                return new Oyster(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Custom Pets
            case 'Jerboa':
                return new Jerboa(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Frilled Dragon':
                return new FrilledDragon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Wombat':
                return new Wombat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Frigatebird':
                return new Frigatebird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Aardvark':
                return new Aardvark(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bear':
                return new Bear(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Emperor Tamarin':
                return new EmperorTamarin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Porcupine':
                return new Porcupine(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Wasp':
                return new Wasp(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dragonfly':
                return new Dragonfly(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lynx':
                return new Lynx(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Seagull':
                return new Seagull(this.logService, this.abilityService, this, this.gameService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Alpaca':
                return new Alpaca(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hyena':
                return new Hyena(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Moose':
                return new Moose(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lioness':
                return new Lioness(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tapir':
                return new Tapir(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Walrus':
                return new Walrus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'White Tiger':
                return new WhiteTiger(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Basilisk':
                return new Basilisk(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nightcrawler':
                return new Nightcrawler(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sphinx':
                return new Sphinx(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chupacabra':
                return new Chupacabra(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Golden Beetle':
                return new GoldenBeetle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Foo Dog':
                return new FooDog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tree':
                return new Tree(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Slime':
                return new Slime(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment, petForm.battlesFought);
            case 'Pegasus':
                return new Pegasus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Deer Lord':
                return new DeerLord(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fairy':
                return new Fairy(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rootling':
                return new Rootling(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Anubis':
                return new Anubis(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Old Mouse':
                return new OldMouse(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hippocampus':
                return new Hippocampus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Boitata':
                return new Boitata(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Kappa':
                return new Kappa(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mimic':
                return new Mimic(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nurikabe':
                return new Nurikabe(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tandgnost':
                return new Tandgnost(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tandgrisner':
                return new Tandgrisner(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Great One':
                return new GreatOne(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Leviathan':
                return new Leviathan(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Questing Beast':
                return new QuestingBeast(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cockatrice':
                return new Cockatrice(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);


            // Token Pets
            case 'Bee':
                return new Bee(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bus':
                return new Bus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Butterfly':
                return new Butterfly(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chick':
                return new Chick(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Dirty Ray':
                return new DirtyRat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Golden Retriever':
                return new GoldenRetriever(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Lizard Tail':
                return new LizardTail(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nest':
                return new Nest(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ram':
                return new Ram(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Smaller Slug':
                return new SmallerSlug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Smallest Slug':
                return new SmallestSlug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Zombie Cricket':
                return new ZombieCricket(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Zombie Fly':
                return new ZombieFly(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cracked Egg':
                return new CrackedEgg(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nessie?':
                return new NessieQ(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Young Phoenix':
                return new YoungPhoenix(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fire Pup':
                return new FirePup(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Monty':
                return new Monty(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Rock':
                return new Rock(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Daycrawler':
                return new Daycrawler(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Smaller Slime':
                return new SmallerSlime(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chim-Goat':
                return new ChimGoat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chim-Lion':
                return new ChimLion(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chim-Snake':
                return new ChimSnake(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Head':
                return new Head(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Good Dog':
                return new GoodDog(this.logService, this.abilityService, this, this.gameService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
                // Unicorn Pack
            // Tier 1

            case 'Baku':
                return new Baku(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Axehandle Hound':
                return new AxehandleHound(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Barghest':
                return new Barghest(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tsuchinoko':
                return new Tsuchinoko(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);    
            case 'Murmel':
                return new Murmel(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Alchemedes':
                return new Alchemedes(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pengobble':
                return new Pengobble(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Warf':
                return new Warf(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bunyip':
                return new Bunyip(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sneaky Egg':
                return new SneakyEgg(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cuddle Toad':
                return new CuddleToad(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case '???':
                return new QuestionMarks(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
                // Tier 2
            case 'Ghost Kitten':
                return new GhostKitten(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Frost Wolf':
                return new FrostWolf(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mothman':
                return new Mothman(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Drop Bear':
                return new DropBear(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Jackalope':
                return new Jackalope(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ogopogo':
                return new Ogopogo(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Thunderbird':
                return new Thunderbird(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Gargoyle':
                return new Gargoyle(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bigfoot':
                return new Bigfoot(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            
            // Tier 3
            case 'Lucky Cat':
                return new LuckyCat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Skeleton Dog':
                return new SkeletonDog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mandrake':
                return new Mandrake(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Fur-Bearing Trout':
                return new FurBearingTrout(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Mana Hound':
                return new ManaHound(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Calygreyhound':
                return new Calygreyhound(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Brain Cramp':
                return new BrainCramp(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Minotaur':
                return new Minotaur(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Wyvern':
                return new Wyvern(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Ouroboros':
                return new Ouroboros(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Griffin':
                return new Griffin(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 4
            case 'Kraken':
                return new Kraken(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Visitor':
                return new Visitor(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Vampire Bat':
                return new VampireBat(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tiger Bug':
                return new TigerBug(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Tatzelwurm':
                return new Tatzelwurm(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cyclops':
                return new Cyclops(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Chimera':
                return new Chimera(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Roc':
                return new Roc(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Worm of Sand':
                return new WormOfSand(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Abomination':
                return new Abomination(this.logService, this.abilityService, this, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment, petForm.abominationSwallowedPet1, petForm.abominationSwallowedPet2, petForm.abominationSwallowedPet3);

            // Tier 5
            case 'Red Dragon':
                return new RedDragon(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Unicorn':
                return new Unicorn(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Loveland Frogman':
                return new LovelandFrogman(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Salmon of Knowledge':
                return new SalmonOfKnowledge(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Jersey Devil':
                return new JerseyDevil(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Pixiu':
                return new Pixiu(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Kitsune':
                return new Kitsune(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Nessie':
                return new Nessie(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Bad Dog':
                return new BadDog(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Werewolf':
                return new Werewolf(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
                case 'Amalgamation':
                    return new Amalgamation(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

            // Tier 6
            case 'Manticore':
                return new Manticore(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Phoenix':
                return new Phoenix(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Quetzalcoatl':
                return new Quetzalcoatl(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Team Spirit':
                return new TeamSpirit(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sleipnir':
                return new Sleipnir(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Sea Serpent':
                return new SeaSerpent(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Yeti':
                return new Yeti(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Cerberus':
                return new Cerberus(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Hydra':
                return new Hydra(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);
            case 'Behemoth':
                return new Behemoth(this.logService, this.abilityService, parent, petForm.health, petForm.attack, petForm.mana, petForm.exp, petForm.equipment);

        }
    }

    createDefaultVersionOfPet(pet: Pet, attack: number = null, health: number = null) {
        let newPet;
        if (pet instanceof Ant) {
            newPet = new Ant(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bee) {
            newPet = new Bee(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cricket) {
            newPet = new Cricket(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Fish) {
            newPet = new Fish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Horse) {
            newPet = new Horse(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mosquito) {
            newPet = new Mosquito(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ZombieCricket) {
            newPet = new ZombieCricket(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Duck) {
            newPet = new Duck(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Beaver) {
            newPet = new Beaver(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Otter) {
            newPet = new Otter(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pig) {
            newPet = new Pig(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mouse) {
            newPet = new Mouse(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pigeon) {
            newPet = new Pigeon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // tier 2
        if (pet instanceof Crab) {
            newPet = new Crab(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Swan) {
            newPet = new Swan(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rat) {
            newPet = new Rat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hedgehog) {
            newPet = new Hedgehog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Peacock) {
            newPet = new Peacock(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Flamingo) {
            newPet = new Flamingo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Worm) {
            newPet = new Worm(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Kangaroo) {
            newPet = new Kangaroo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Spider) {
            newPet = new Spider(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dodo) {
            newPet = new Dodo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Badger) {
            newPet = new Badger(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dolphin) {
            newPet = new Dolphin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Giraffe) {
            newPet = new Giraffe(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Elephant) {
            newPet = new Elephant(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Camel) {
            newPet = new Camel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rabbit) {
            newPet = new Rabbit(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ox) {
            newPet = new Ox(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dog) {
            newPet = new Dog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Sheep) {
            newPet = new Sheep(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        
        // tier 4
        if (pet instanceof Skunk) {
            newPet = new Skunk(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hippo) {
            newPet = new Hippo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bison) {
            newPet = new Bison(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Blowfish) {
            newPet = new Blowfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Turtle) {
            newPet = new Turtle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Squirrel) {
            newPet = new Squirrel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Penguin) {
            newPet = new Penguin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Deer) {
            newPet = new Deer(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Whale) {
            newPet = new Whale(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Parrot) {
            newPet = new Parrot(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // tier 5

        if (pet instanceof Scorpion) {
            newPet = new Scorpion(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Crocodile) {
            newPet = new Crocodile(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rhino) {
            newPet = new Rhino(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Monkey) {
            newPet = new Monkey(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Armadillo) {
            newPet = new Armadillo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cow) {
            newPet = new Cow(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Seal) {
            newPet = new Seal(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rooster) {
            newPet = new Rooster(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Shark) {
            newPet = new Shark(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Turkey) {
            newPet = new Turkey(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // tier 6
        if (pet instanceof Leopard) {
            newPet = new Leopard(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Boar) {
            newPet = new Boar(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tiger) {
            newPet = new Tiger(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Wolverine) {
            newPet = new Wolverine(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Gorilla) {
            newPet = new Gorilla(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dragon) {
            newPet = new Dragon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mammoth) {
            newPet = new Mammoth(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cat) {
            newPet = new Cat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Snake) {
            newPet = new Snake(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Fly) {
            newPet = new Fly(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Puppy
        // Tier 1
        if (pet instanceof Moth) {
            newPet = new Moth(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bluebird) {
            newPet = new Bluebird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chinchilla) {
            newPet = new Chinchilla(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Beetle) {
            newPet = new Beetle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ladybug) {
            newPet = new Ladybug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chipmunk) {
            newPet = new Chipmunk(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Gecko) {
            newPet = new Gecko(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ferret) {
            newPet = new Ferret(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 2
        if (pet instanceof Robin) {
            newPet = new Robin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bat) {
            newPet = new Bat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bilby) {
            newPet = new Bilby(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dromedary) {
            newPet = new Dromedary(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Shrimp) {
            newPet = new Shrimp(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Toucan) {
            newPet = new Toucan(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BelugaSturgeon) {
            newPet = new BelugaSturgeon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof TabbyCat) {
            newPet = new TabbyCat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mandrill) {
            newPet = new Mandrill(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lemur) {
            newPet = new Lemur(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 3
        if (pet instanceof HoopoeBird) {
            newPet = new HoopoeBird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof TropicalFish) {
            newPet = new TropicalFish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof HatchingChick) {
            newPet = new HatchingChick(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Goldfish) {
            newPet = new Goldfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Owl) {
            newPet = new Owl(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mole) {
            newPet = new Mole(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Raccoon) {
            newPet = new Raccoon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FlyingSquirrel) {
            newPet = new FlyingSquirrel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pangolin) {
            newPet = new Pangolin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Puppy) {
            newPet = new Puppy(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hare) {
            newPet = new Hare(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        
        // Tier 4
        if (pet instanceof Microbe) {
            newPet = new Microbe(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lobster) {
            newPet = new Lobster(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Buffalo) {
            newPet = new Buffalo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Llama) {
            newPet = new Llama(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Caterpillar) {
            newPet = new Caterpillar(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Doberman) {
            newPet = new Doberman(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tahr) {
            newPet = new Tahr(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof WhaleShark) {
            newPet = new WhaleShark(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chameleon) {
            newPet = new Chameleon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Gharial) {
            newPet = new Gharial(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 5
        if (pet instanceof Stonefish) {
            newPet = new Stonefish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Poodle) {
            newPet = new Poodle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Goat) {
            newPet = new Goat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chicken) {
            newPet = new Chicken(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Eagle) {
            newPet = new Eagle(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof OrchidMantis) {
            newPet = new OrchidMantis(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Panther) {
            newPet = new Panther(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Axolotl) {
            newPet = new Axolotl(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SnappingTurtle) {
            newPet = new SnappingTurtle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mosasaurus) {
            newPet = new Mosasaurus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof StringRay) {
            newPet = new StringRay(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 6
        if (pet instanceof MantisShrimp) {
            newPet = new MantisShrimp(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lionfish) {
            newPet = new Lionfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tyrannosaurus) {
            newPet = new Tyrannosaurus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Octopus) {
            newPet = new Octopus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Anglerfish) {
            newPet = new Anglerfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Sauropod) {
            newPet = new Sauropod(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ElephantSeal) {
            newPet = new ElephantSeal(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Puma) {
            newPet = new Puma(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mongoose) {
            newPet = new Mongoose(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Star
        // Tier 1
        if (pet instanceof Pillbug) {
            newPet = new Pillbug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Duckling) {
            newPet = new Duckling(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cockroach) {
            newPet = new Cockroach(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Kiwi) {
            newPet = new Kiwi(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Frog) {
            newPet = new Frog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Seahorse) {
            newPet = new Seahorse(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Iguana) {
            newPet = new Iguana(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hummingbird) {
            newPet = new Hummingbird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Marmoset) {
            newPet = new Marmoset(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }


        // Tier 2
        if (pet instanceof Koala) {
            newPet = new Koala(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Yak) {
            newPet = new Yak(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Salamander) {
            newPet = new Salamander(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Panda) {
            newPet = new Panda(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GuineaPig) {
            newPet = new GuineaPig(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Jellyfish) {
            newPet = new Jellyfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pug) {
            newPet = new Pug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof AtlanticPuffin) {
            newPet = new AtlanticPuffin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dove) {
            newPet = new Dove(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Stork) {
            newPet = new Stork(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof DumboOctopus) {
            newPet = new DumboOctopus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 3
        if (pet instanceof Leech) {
            newPet = new Leech(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Woodpecker) {
            newPet = new Woodpecker(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Toad) {
            newPet = new Toad(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Starfish) {
            newPet = new Starfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Clownfish) {
            newPet = new Clownfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Blobfish) {
            newPet = new Blobfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Cabybara) {
            newPet = new Cabybara(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Okapi) {
            newPet = new Okapi(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Cassowary) {
            newPet = new Cassowary(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 

        // Tier 4
        if (pet instanceof Orangutang) {
            newPet = new Orangutang(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Eel) {
            newPet = new Eel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Hawk) {
            newPet = new Hawk(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Platypus) {
            newPet = new Platypus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof PrayingMantis) {
            newPet = new PrayingMantis(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        } 
        if (pet instanceof Crow) {
            newPet = new Crow(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Donkey) {
            newPet = new Donkey(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pelican) {
            newPet = new Pelican(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Anteater) {
            newPet = new Anteater(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 5
        if (pet instanceof SwordFish) {
            newPet = new SwordFish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof PolarBear) {
            newPet = new PolarBear(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SiberianHuskey) {
            newPet = new SiberianHuskey(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lion) {
            newPet = new Lion(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Triceratops) {
            newPet = new Triceratops(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Zebra) {
            newPet = new Zebra(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Fox) {
            newPet = new Fox(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hamster) {
            newPet = new Hamster(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Shoebill) {
            newPet = new Shoebill(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Vulture) {
            newPet = new Vulture(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 6
        if (pet instanceof Komodo) {
            newPet = new Komodo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ostrich) {
            newPet = new Ostrich(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Reindeer) {
            newPet = new Reindeer(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Stegosaurus) {
            newPet = new Stegosaurus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Piranha) {
            newPet = new Piranha(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof HammerheadShark) {
            newPet = new HammerheadShark(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Velociraptor) {
            newPet = new Velociraptor(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SabertoothTiger) {
            newPet = new SabertoothTiger(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Orca) {
            newPet = new Orca(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Spinosaurus) {
            newPet = new Spinosaurus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Golden
        // Tier 1
        if (pet instanceof Bulldog) {
            newPet = new Bulldog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Groundhog) {
            newPet = new Groundhog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ConeSnail) {
            newPet = new ConeSnail(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Goose) {
            newPet = new Goose(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lemming) {
            newPet = new Lemming(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof PiedTamarin) {
            newPet = new PiedTamarin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Opossum) {
            newPet = new Opossum(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Silkmoth) {
            newPet = new Silkmoth(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Magpie) {
            newPet = new Magpie(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 2
        if (pet instanceof HerculesBeetle) {
            newPet = new HerculesBeetle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Stoat) {
            newPet = new Stoat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BlackNeckedStilt) {
            newPet = new BlackNeckedStilt(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Squid) {
            newPet = new Squid(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SeaUrchin) {
            newPet = new SeaUrchin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof DoorHeadAnt) {
            newPet = new DoorHeadAnt(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lizard) {
            newPet = new Lizard(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SeaTurtle) {
            newPet = new SeaTurtle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof AfricanPenguin) {
            newPet = new AfricanPenguin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 3
        if (pet instanceof MuskOx) {
            newPet = new MuskOx(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Flea) {
            newPet = new Flea(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof RoyalFlycatcher) {
            newPet = new RoyalFlycatcher(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SurgeonFish) {
            newPet = new SurgeonFish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Weasel) {
            newPet = new Weasel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Guineafowl) {
            newPet = new Guineafowl(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BettaFish) {
            newPet = new BettaFish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Meerkat) {
            newPet = new Meerkat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FlyingFish) {
            newPet = new FlyingFish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Baboon) {
            newPet = new Baboon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Osprey) {
            newPet = new Osprey(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 4
        if (pet instanceof Manatee) {
            newPet = new Manatee(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cuttlefish) {
            newPet = new Cuttlefish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof EgyptianVulture) {
            newPet = new EgyptianVulture(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SaigaAntelope) {
            newPet = new SaigaAntelope(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Sealion) {
            newPet = new Sealion(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Vaquita) {
            newPet = new Vaquita(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Slug) {
            newPet = new Slug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof PoisonDartFrog) {
            newPet = new PoisonDartFrog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SecretaryBird) {
            newPet = new SecretaryBird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Falcon) {
            newPet = new Falcon(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof MantaRay) {
            newPet = new MantaRay(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 5
        if (pet instanceof Macaque) {
            newPet = new Macaque(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Nyala) {
            newPet = new Nyala(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof NurseShark) {
            newPet = new NurseShark(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BelugaWhale) {
            newPet = new BelugaWhale(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Wolf) {
            newPet = new Wolf(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SilverFox) {
            newPet = new SilverFox(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FireAnt) {
            newPet = new FireAnt(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cockatoo) {
            newPet = new Cockatoo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BlueRingedOctopus) {
            newPet = new BlueRingedOctopus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Crane) {
            newPet = new Crane(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Emu) {
            newPet = new Emu(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 6
        if (pet instanceof Wildebeast) {
            newPet = new Wildebeast(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof HighlandCow) {
            newPet = new HighlandCow(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Catfish) {
            newPet = new Catfish(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pteranodon) {
            newPet = new Pteranodon(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Warthog) {
            newPet = new Warthog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cobra) {
            newPet = new Cobra(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GrizzlyBear) {
            newPet = new GrizzlyBear(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GermanShephard) {
            newPet = new GermanShephard(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BirdOfParadise) {
            newPet = new BirdOfParadise(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Oyster) {
            newPet = new Oyster(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Token pets
        if (pet instanceof Bee) {
            newPet = new Bee(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bus) {
            newPet = new Bus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Butterfly) {
            newPet = new Butterfly(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chick) {
            newPet = new Chick(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof DirtyRat) {
            newPet = new DirtyRat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GoldenRetriever) {
            newPet = new GoldenRetriever(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof LizardTail) {
            newPet = new LizardTail(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Nest) {
            newPet = new Nest(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ram) {
            newPet = new Ram(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SmallerSlug) {
            newPet = new SmallerSlug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SmallestSlug) {
            newPet = new SmallestSlug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ZombieCricket) {
            newPet = new ZombieCricket(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ZombieFly) {
            newPet = new ZombieFly(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof CrackedEgg) {
            newPet = new CrackedEgg(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof NessieQ) {
            newPet = new NessieQ(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof YoungPhoenix) {
            newPet = new YoungPhoenix(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FirePup) {
            newPet = new FirePup(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Monty) {
            newPet = new Monty(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rock) {
            newPet = new Rock(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Daycrawler) {
            newPet = new Daycrawler(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SmallerSlime) {
            newPet = new SmallerSlime(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ChimGoat) {
            newPet = new ChimGoat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ChimLion) {
            newPet = new ChimLion(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ChimSnake) {
            newPet = new ChimSnake(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Head) {
            newPet = new Head(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GoodDog) {
            newPet = new GoodDog(this.logService, this.abilityService, this, this.gameService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Custom Pack Pets
        if (pet instanceof Jerboa) {
            newPet = new Jerboa(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FrilledDragon) {
            newPet = new FrilledDragon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Wombat) {
            newPet = new Wombat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Frigatebird) {
            newPet = new Frigatebird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Aardvark) {
            newPet = new Aardvark(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bear) {
            newPet = new Bear(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof EmperorTamarin) {
            newPet = new EmperorTamarin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Porcupine) {
            newPet = new Porcupine(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Wasp) {
            newPet = new Wasp(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Dragonfly) {
            newPet = new Dragonfly(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lynx) {
            newPet = new Lynx(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Seagull) {
            newPet = new Seagull(this.logService, this.abilityService, this, this.gameService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Alpaca) {
            newPet = new Alpaca(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hyena) {
            newPet = new Hyena(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Moose) {
            newPet = new Moose(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Lioness) {
            newPet = new Lioness(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tapir) {
            newPet = new Tapir(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Walrus) {
            newPet = new Walrus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof WhiteTiger) {
            newPet = new WhiteTiger(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Basilisk) {
            newPet = new Basilisk(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Nightcrawler) {
            newPet = new Nightcrawler(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Sphinx) {
            newPet = new Sphinx(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chupacabra) {
            newPet = new Chupacabra(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GoldenBeetle) {
            newPet = new GoldenBeetle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FooDog) {
            newPet = new FooDog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tree) {
            newPet = new Tree(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Slime) {
            newPet = new Slime(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pegasus) {
            newPet = new Pegasus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof DeerLord) {
            newPet = new DeerLord(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Fairy) {
            newPet = new Fairy(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Rootling) {
            newPet = new Rootling(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Anubis) {
            newPet = new Anubis(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof OldMouse) {
            newPet = new OldMouse(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hippocampus) {
            newPet = new Hippocampus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Boitata) {
            newPet = new Boitata(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Kappa) {
            newPet = new Kappa(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mimic) {
            newPet = new Mimic(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Nurikabe) {
            newPet = new Nurikabe(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tandgnost) {
            newPet = new Tandgnost(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tandgrisner) {
            newPet = new Tandgrisner(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof GreatOne) {
            newPet = new GreatOne(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Leviathan) {
            newPet = new Leviathan(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof QuestingBeast) {
            newPet = new QuestingBeast(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cockatrice) {
            newPet = new Cockatrice(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Albatross) {
            newPet = new Albatross(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }



        // Unicorn
        // Tier 1
        if (pet instanceof Baku) {
            newPet = new Baku(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof AxehandleHound) {
            newPet = new AxehandleHound(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Barghest) {
            newPet = new Barghest(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tsuchinoko) {
            newPet = new Tsuchinoko(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Murmel) {
            newPet = new Murmel(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Alchemedes) {
            newPet = new Alchemedes(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pengobble) {
            newPet = new Pengobble(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Warf) {
            newPet = new Warf(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bunyip) {
            newPet = new Bunyip(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SneakyEgg) {
            newPet = new SneakyEgg(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof CuddleToad) {
            newPet = new CuddleToad(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof QuestionMarks) {
            newPet = new QuestionMarks(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 2
        if (pet instanceof GhostKitten) {
            newPet = new GhostKitten(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FrostWolf) {
            newPet = new FrostWolf(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mothman) {
            newPet = new Mothman(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof DropBear) {
            newPet = new DropBear(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Jackalope) {
            newPet = new Jackalope(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ogopogo) {
            newPet = new Ogopogo(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Thunderbird) {
            newPet = new Thunderbird(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Gargoyle) {
            newPet = new Gargoyle(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Bigfoot) {
            newPet = new Bigfoot(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 3
        if (pet instanceof LuckyCat) {
            newPet = new LuckyCat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SkeletonDog) {
            newPet = new SkeletonDog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Mandrake) {
            newPet = new Mandrake(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof FurBearingTrout) {
            newPet = new FurBearingTrout(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof ManaHound) {
            newPet = new ManaHound(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Calygreyhound) {
            newPet = new Calygreyhound(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BrainCramp) {
            newPet = new BrainCramp(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Minotaur) {
            newPet = new Minotaur(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Wyvern) {
            newPet = new Wyvern(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Ouroboros) {
            newPet = new Ouroboros(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Griffin) {
            newPet = new Griffin(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 4
        if (pet instanceof Kraken) {
            newPet = new Kraken(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Visitor) {
            newPet = new Visitor(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof VampireBat) {
            newPet = new VampireBat(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof TigerBug) {
            newPet = new TigerBug(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Tatzelwurm) {
            newPet = new Tatzelwurm(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cyclops) {
            newPet = new Cyclops(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Chimera) {
            newPet = new Chimera(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Roc) {
            newPet = new Roc(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof WormOfSand) {
            newPet = new WormOfSand(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Abomination) {
            newPet = new Abomination(this.logService, this.abilityService, this, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 5
        if (pet instanceof RedDragon) {
            newPet = new RedDragon(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Unicorn) {
            newPet = new Unicorn(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof LovelandFrogman) {
            newPet = new LovelandFrogman(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SalmonOfKnowledge) {
            newPet = new SalmonOfKnowledge(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof JerseyDevil) {
            newPet = new JerseyDevil(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Pixiu) {
            newPet = new Pixiu(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Kitsune) {
            newPet = new Kitsune(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Nessie) {
            newPet = new Nessie(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof BadDog) {
            newPet = new BadDog(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Werewolf) {
            newPet = new Werewolf(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Amalgamation) {
            newPet = new Amalgamation(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }

        // Tier 6
        if (pet instanceof Manticore) {
            newPet = new Manticore(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Phoenix) {
            newPet = new Phoenix(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Quetzalcoatl) {
            newPet = new Quetzalcoatl(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof TeamSpirit) {
            newPet = new TeamSpirit(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Sleipnir) {
            newPet = new Sleipnir(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof SeaSerpent) {
            newPet = new SeaSerpent(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Yeti) {
            newPet = new Yeti(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Cerberus) {
            newPet = new Cerberus(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Hydra) {
            newPet = new Hydra(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }
        if (pet instanceof Behemoth) {
            newPet = new Behemoth(this.logService, this.abilityService, pet.parent, attack, health, 0, levelToExp(pet.level));
        }


        return newPet;
    }

    getRandomPet(parent: Player) {
        let tier = getRandomInt(1,6);
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
            3: ['Badger', 'Sheep', 'Hoopoe Bird', 'Mole', 'Pangolin', 'Blobfish', 'Flea', 'Weasel', 'Osprey', 'Bear', 'Betta Fish', 'Skeleton Dog', 'Fur-Bearing Trout', 'Calygreyhound', 'Slime'],
            4: ['Turtle', 'Deer', 'Anteater', 'Microbe', 'Tahr', 'Chameleon', 'Cuttlefish', 'Vaquita', 'Slug', 'Chimera', 'Visitor'],
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

export interface PetForm {
    name: string;
    attack: number;
    health: number;
    mana: number;
    exp: number;
    equipment: Equipment;
    belugaSwallowedPet?: string;
    abominationSwallowedPet1?: string;
    abominationSwallowedPet2?: string;
    abominationSwallowedPet3?: string;
    battlesFought?: number;
}

function levelToExp(level: number) {
    return level == 1 ? 0 : level == 2 ? 2 : 5;
}