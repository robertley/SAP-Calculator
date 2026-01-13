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
import { Gibbon } from "../classes/pets/custom/tier-1/gibbon.class";
import { Termite } from "../classes/pets/custom/tier-1/termite.class";
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
import { AngryPygmyHog } from "../classes/pets/hidden/angry-pygmy-hog.class";
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
import { SeaCucumber } from "../classes/pets/custom/tier-5/sea-cucumber.class";
import { FlyingSquirrel } from "../classes/pets/custom/tier-3/flying-squirrel.class";
import { Pangolin } from "../classes/pets/puppy/tier-3/pangolin.class";
import { Puppy } from "../classes/pets/puppy/tier-3/puppy.class";
import { PurpleFrog } from "../classes/pets/puppy/tier-3/purple-frog.class";
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
import { StingRay } from "../classes/pets/puppy/tier-5/sting-ray.class";
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
import { Duckling } from "../classes/pets/custom/tier-1/duckling.class";
import { Cockroach } from "../classes/pets/star/tier-1/cockroach.class";
import { Frog } from "../classes/pets/star/tier-1/frog.class";
import { Chihuahua } from '../classes/pets/star/tier-1/chihuahua.class';
import { Seahorse } from "../classes/pets/custom/tier-1/seahorse.class";
import { Iguana } from "../classes/pets/star/tier-2/iguana.class";
import { Hummingbird } from "../classes/pets/star/tier-1/hummingbird.class";
import { Koala } from "../classes/pets/star/tier-2/koala.class";
import { Yak } from "../classes/pets/custom/tier-2/yak.class";
import { DumboOctopus } from "../classes/pets/star/tier-2/dumbo-octopus.class";
import { Salamander } from "../classes/pets/star/tier-2/salamander.class";
import { Panda } from "../classes/pets/custom/tier-2/panda.class";
import { GuineaPig } from "../classes/pets/star/tier-2/guinea-pig.class";
import { Pug } from "../classes/pets/star/tier-3/pug.class";
import { Cardinal } from "../classes/pets/star/tier-3/cardinal.class";
import { Jellyfish } from "../classes/pets/star/tier-2/jellyfish.class";
import { AtlanticPuffin } from "../classes/pets/custom/tier-2/atlantic-puffin.class";
import { Dove } from "../classes/pets/star/tier-2/dove.class";
import { Stork } from "../classes/pets/star/tier-2/stork.class";
import { ShimaEnaga } from "../classes/pets/star/tier-2/shima-enaga.class";
import { Leech } from "../classes/pets/star/tier-3/leech.class";
import { Woodpecker } from "../classes/pets/star/tier-5/woodpecker.class";
import { Tuna } from '../classes/pets/star/tier-3/tuna.class';
import { Toad } from "../classes/pets/star/tier-3/toad.class";
import { Starfish } from "../classes/pets/star/tier-5/starfish.class";
import { Clownfish } from "../classes/pets/star/tier-4/clownfish.class";
import { Blobfish } from "../classes/pets/star/tier-5/blobfish.class";
import { Capybara } from "../classes/pets/star/tier-3/capybara.class";
import { Okapi } from "../classes/pets/star/tier-3/okapi.class";
import { Cassowary } from "../classes/pets/star/tier-3/cassowary.class";
import { Orangutan } from "../classes/pets/star/tier-3/orangutan.class";
import { Siamese } from '../classes/pets/star/tier-4/siamese.class';
import { Elk } from '../classes/pets/star/tier-4/elk.class';
import { FairyArmadillo } from '../classes/pets/star/tier-4/fairy-armadillo.class';
import { Fossa } from '../classes/pets/star/tier-4/fossa.class';
import { Eel } from "../classes/pets/custom/tier-4/eel.class";
import { SeaAnemone } from "../classes/pets/custom/tier-4/sea-anemone.class";
import { Hawk } from "../classes/pets/star/tier-4/hawk.class";
import { Platypus } from "../classes/pets/star/tier-4/platypus.class";
import { PrayingMantis } from "../classes/pets/star/tier-4/praying-mantis.class";
import { Crow } from "../classes/pets/custom/tier-4/crow.class";
import { Donkey } from "../classes/pets/star/tier-4/donkey.class";
import { Sparrow } from "../classes/pets/star/tier-4/sparrow.class";
import { Pelican } from "../classes/pets/star/tier-5/pelican.class";
import { Anteater } from "../classes/pets/star/tier-3/anteater.class";
import { SwordFish } from "../classes/pets/star/tier-5/sword-fish.class";
import { PolarBear } from "../classes/pets/custom/tier-5/polar-bear.class";
import { SiberianHusky } from "../classes/pets/custom/tier-5/siberian-husky.class";
import { Lion } from "../classes/pets/custom/tier-5/lion.class";
import { Triceratops } from "../classes/pets/star/tier-5/triceratops.class";
import { Zebra } from "../classes/pets/custom/tier-5/zebra.class";
import { Fox } from "../classes/pets/custom/tier-5/fox.class";
import { Hamster } from "../classes/pets/star/tier-5/hamster.class";
import { Shoebill } from "../classes/pets/star/tier-5/shoebill.class";
import { Vulture } from "../classes/pets/star/tier-5/vulture.class";
import { Ibex } from "../classes/pets/star/tier-5/ibex.class";
import { Komodo } from "../classes/pets/custom/tier-6/komodo.class";
import { Ostrich } from "../classes/pets/star/tier-6/ostrich.class";
import { Reindeer } from "../classes/pets/star/tier-6/reindeer.class";
import { Stegosaurus } from "../classes/pets/custom/tier-6/stegosaurus.class";
import { Piranha } from "../classes/pets/star/tier-6/piranha.class";
import { HammerheadShark } from "../classes/pets/custom/tier-6/hammerhead-shark.class";
import { Therizinosaurus } from "../classes/pets/custom/tier-6/therizinosaurus.class";
import { HarpyEagle } from "../classes/pets/custom/tier-6/harpy-eagle.class";
import { FarmerDog } from "../classes/pets/custom/tier-6/farmer-dog";
import { RealVelociraptor } from "../classes/pets/star/tier-6/real-velociraptor.class";
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
import { BettaFish } from "../classes/pets/golden/tier-3/betta-fish.class";
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
import { Cockatoo } from "../classes/pets/golden/tier-4/cockatoo.class";
import { BlueRingedOctopus } from "../classes/pets/golden/tier-5/blue-ringed-octopus.class";
import { Crane } from "../classes/pets/golden/tier-5/crane.class";
import { Emu } from "../classes/pets/golden/tier-5/emu.class";
import { Wildebeest } from "../classes/pets/golden/tier-6/wildebeest.class";
import { HighlandCow } from "../classes/pets/golden/tier-6/highland-cow.class";
import { Catfish } from "../classes/pets/golden/tier-6/catfish.class";
import { Pteranodon } from "../classes/pets/golden/tier-6/pteranodon.class";
import { Warthog } from "../classes/pets/golden/tier-6/warthog.class";
import { Cobra } from "../classes/pets/golden/tier-6/cobra.class";
import { GrizzlyBear } from "../classes/pets/golden/tier-6/grizzly-bear.class";
import { GermanShepherd } from "../classes/pets/golden/tier-6/german-shepherd.class";
import { BirdOfParadise } from "../classes/pets/golden/tier-6/bird-of-paradise.class";
import { Oyster } from "../classes/pets/golden/tier-6/oyster.class";
import { RockhopperPenguin } from '../classes/pets/golden/tier-6/rockhopper-penguin.class';
import { Bus } from "../classes/pets/hidden/bus.class";
import { Butterfly } from "../classes/pets/hidden/butterfly.class";
import { FairyBall } from '../classes/pets/hidden/fairy-ball.class';
import { Chick } from "../classes/pets/hidden/chick.class";
import { DirtyRat } from "../classes/pets/hidden/dirty-rat.class";
import { GoldenRetriever } from "../classes/pets/hidden/golden-retriever.class";
import { GiantEyesDog } from "../classes/pets/hidden/giant-eyes-dog.class";
import { LizardTail } from "../classes/pets/hidden/lizard-tail.class";
import { Nest } from "../classes/pets/hidden/nest.class";
import { Ram } from "../classes/pets/hidden/ram.class";
import { SmallerSlug } from "../classes/pets/hidden/smaller-slug.class";
import { LoyalChinchilla } from "../classes/pets/hidden/loyal-chinchilla.class";
import { SmallestSlug } from "../classes/pets/hidden/smallest-slug.class";
import { ZombieFly } from "../classes/pets/hidden/zombie-fly.class";
import { Marmoset } from "../classes/pets/star/tier-1/marmoset.class";
import { Jerboa } from "../classes/pets/custom/tier-4/jerboa.class";
import { FrilledDragon } from "app/classes/pets/custom/tier-1/frilled-dragon";
import { Wombat } from "app/classes/pets/custom/tier-2/wombat.class";
import { Frigatebird } from "../classes/pets/custom/tier-2/frigatebird.class";
import { Aardvark } from "app/classes/pets/custom/tier-3/aardvark.class";
import { Bear } from "app/classes/pets/custom/tier-3/bear.class";
import { EmperorTamarin } from "app/classes/pets/custom/tier-3/emperor-tamarin";
import { Porcupine } from "app/classes/pets/custom/tier-3/porcupine.class";
import { Wasp } from "app/classes/pets/custom/tier-3/wasp.class";
import { Dragonfly } from "../classes/pets/custom/tier-4/dragonfly.class";
import { Lynx } from "../classes/pets/custom/tier-4/lynx.class";
import { Seagull } from "../classes/pets/custom/tier-4/seagull.class";
import { Alpaca } from "../classes/pets/star/tier-6/alpaca.class";
import { Hyena } from "../classes/pets/custom/tier-5/hyena.class";
import { Moose } from "../classes/pets/custom/tier-5/moose.class";
import { Lioness } from "../classes/pets/custom/tier-6/lioness.class";
import { Tapir } from "../classes/pets/custom/tier-6/tapir.class";
import { Walrus } from "../classes/pets/custom/tier-6/walrus.class";
import { WhiteTiger } from "../classes/pets/custom/tier-6/white-tiger.class";
import { Amargasaurus } from '../classes/pets/custom/tier-6/amargasaurus.class';
import { Opossum } from "../classes/pets/golden/tier-1/opossum.class";
import { Kiwi } from "../classes/pets/star/tier-1/kiwi.class";
import { Pheasant } from "../classes/pets/star/tier-1/pheasant.class";
import { Firefly } from '../classes/pets/star/tier-1/firefly.class';
import { Bass } from '../classes/pets/star/tier-2/bass.class';
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
import { IriomoteCat } from "../classes/pets/danger/tier-1/iriomote-cat.class";
import { IliPika } from "../classes/pets/danger/tier-1/ili-pika.class";
import { MalayTapir } from "../classes/pets/danger/tier-1/malay-tapir.class";
import { BombusDahlbomii } from "../classes/pets/danger/tier-1/bombus-dahlbomii.class";
import { EthiopianWolf } from "../classes/pets/danger/tier-1/ethiopian-wolf.class";
import { FanMussel } from "../classes/pets/danger/tier-1/fan-mussel.class";
import { TogianBabirusa } from "../classes/pets/danger/tier-1/togian-babirusa.class";
import { ToothBilledPigeon } from "../classes/pets/danger/tier-1/tooth-billed-pigeon.class";
import { VolcanoSnail } from "../classes/pets/danger/tier-1/volcano-snail.class";
import { AfricanWildDog } from "../classes/pets/danger/tier-1/african-wild-dog.class";
import { AraripeManakin } from "../classes/pets/danger/tier-2/araripe-manakin.class";
import { EuropeanMink } from "../classes/pets/danger/tier-2/european-mink.class";
import { ProboscisMonkey } from "../classes/pets/danger/tier-2/proboscis-monkey.class";
import { PygmyHog } from "../classes/pets/danger/tier-2/pygmy-hog.class";
import { Saola } from "../classes/pets/danger/tier-2/saola.class";
import { SakerFalcon } from "../classes/pets/danger/tier-2/saker-falcon.class";
import { TaitaShrew } from "../classes/pets/danger/tier-2/taita-shrew.class";
import { WhiteBelliedHeron } from "../classes/pets/danger/tier-2/white-bellied-heron.class";
import { DarwinsFox } from "../classes/pets/danger/tier-2/darwins-fox.class";
import { Takhi } from "../classes/pets/danger/tier-2/takhi.class";
import { BlueThroatedMacaw } from "../classes/pets/danger/tier-3/blue-throated-macaw.class";
import { Hirola } from "../classes/pets/danger/tier-3/hirola.class";
import { MonkeyFacedBat } from "../classes/pets/danger/tier-3/monkey-faced-bat.class";
import { PygmyHippo } from "../classes/pets/danger/tier-3/pygmy-hippo.class";
import { Takin } from "../classes/pets/danger/tier-3/takin.class";
import { Tucuxi } from "../classes/pets/danger/tier-3/tucuxi.class";
import { RolowayMonkey } from "../classes/pets/danger/tier-3/roloway-monkey.class";
import { SpoonBilledSandpiper } from "../classes/pets/danger/tier-3/spoon-billed-sandpiper.class";
import { AmamiRabbit } from "../classes/pets/danger/tier-3/amami-rabbit.class";
import { TreeKangaroo } from "../classes/pets/danger/tier-3/tree-kangaroo.class";
import { Angelshark } from "../classes/pets/danger/tier-4/angelshark.class";
import { Bonobo } from "../classes/pets/danger/tier-4/bonobo.class";
import { GiantTortoise } from "../classes/pets/danger/tier-4/giant-tortoise.class";
import { HumpheadWrasse } from "../classes/pets/danger/tier-4/humphead-wrasse.class";
import { GoldenTamarin } from "../classes/pets/danger/tier-4/golden-tamarin.class";
import { Kakapo } from "../classes/pets/danger/tier-4/kakapo.class";
import { LongcombSawfish } from "../classes/pets/danger/tier-4/longcomb-sawfish.class";
import { AmazonRiverDolphin } from "../classes/pets/danger/tier-4/amazon-river-dolphin.class";
import { TasmanianDevil } from "../classes/pets/danger/tier-4/tasmanian-devil.class";
import { GiantOtter } from "../classes/pets/danger/tier-4/giant-otter.class";
import { AyeAye } from "../classes/pets/danger/tier-5/aye-aye.class";
import { BanggaiCardinalfish } from "../classes/pets/danger/tier-5/banggai-cardinalfish.class";
import { GeometricTortoise } from "../classes/pets/danger/tier-5/geometric-tortoise.class";
import { GiantPangasius } from "../classes/pets/danger/tier-5/giant-pangasius.class";
import { HawaiianMonkSeal } from "../classes/pets/danger/tier-5/hawaiian-monk-seal.class";
import { MarineIguana } from "../classes/pets/danger/tier-5/marine-iguana.class";
import { RedPanda } from "../classes/pets/danger/tier-5/red-panda.class";
import { TaitaThrush } from "../classes/pets/danger/tier-5/taita-thrush.class";
import { PaintedTerrapin } from "../classes/pets/danger/tier-5/painted-terrapin.class";
import { SnowLeopard } from "../classes/pets/danger/tier-5/snow-leopard.class";
import { AmsterdamAlbatross } from "../classes/pets/danger/tier-6/amsterdam-albatross.class";
import { BayCat } from "../classes/pets/danger/tier-6/bay-cat.class";
import { BlackRhino } from "../classes/pets/danger/tier-6/black-rhino.class";
import { BlueWhale } from "../classes/pets/danger/tier-6/blue-whale.class";
import { CaliforniaCondor } from "../classes/pets/danger/tier-6/california-condor.class";
import { GreenSeaTurtle } from "../classes/pets/danger/tier-6/green-sea-turtle.class";
import { HelmetedHornbill } from "../classes/pets/danger/tier-6/helmeted-hornbill.class";
import { PhilippineEagle } from "../classes/pets/danger/tier-6/philippine-eagle.class";
import { SilkySifaka } from "../classes/pets/danger/tier-6/silky-sifaka.class";
import { SumatranTiger } from "../classes/pets/danger/tier-6/sumatran-tiger.class";
import { Monty } from "../classes/pets/hidden/monty.class";
import { Rock } from "../classes/pets/hidden/rock.class";
import { Basilisk } from "../classes/pets/custom/tier-3/basilisk.class";
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
import { GoblinShark } from "../classes/pets/custom/tier-4/goblin-shark.class";
import { RedLippedBatfish } from "../classes/pets/custom/tier-4/red-lipped-batfish.class";
import { Platybelodon } from "../classes/pets/custom/tier-4/platybelodon.class";
import { Boitata } from "../classes/pets/custom/tier-5/boitata.class";
import { Kappa } from "../classes/pets/custom/tier-5/kappa.class";
import { Mimic } from "../classes/pets/custom/tier-5/mimic.class";
import { Nurikabe } from "../classes/pets/custom/tier-5/nurikabe.class";
import { Tandgnost } from "../classes/pets/custom/tier-4/tandgnost.class";
import { Tandgrisner } from "../classes/pets/custom/tier-5/tandgrisner.class";
import { GreatOne } from "../classes/pets/custom/tier-6/great-one.class";
import { Leviathan } from "../classes/pets/custom/tier-6/leviathan.class";
import { QuestingBeast } from "../classes/pets/custom/tier-6/questing-beast.class";
import { Cockatrice } from "../classes/pets/custom/tier-6/cockatrice.class";
import { Albatross } from "../classes/pets/custom/tier-6/albatross.class";
import { TarantulaHawk } from "../classes/pets/custom/tier-6/tarantula-hawk.class";
import { ChimeraGoat } from "../classes/pets/hidden/chimera-goat.class";
import { ChimeraLion } from "../classes/pets/hidden/chimera-lion.class";
import { ChimeraSnake } from "../classes/pets/hidden/chimera-snake.class";
import { Head } from "../classes/pets/hidden/head.class";
import { GoodDog } from "../classes/pets/hidden/good-dog.class";
import { Salmon } from "../classes/pets/hidden/salmon.class";
import { MimicOctopus } from "../classes/pets/hidden/mimic-octopus.class";
import { Ammonite } from "../classes/pets/star/tier-6/ammonite.class";
import { Velociraptor } from "../classes/pets/star/tier-6/velociraptor.class";
import { BabyUrchin } from "../classes/pets/hidden/baby-urchin.class";
import { AdultFlounder } from "../classes/pets/hidden/adult-flounder.class";
import { Budgie } from "../classes/pets/custom/tier-1/budgie.class";
import { Burbel } from "../classes/pets/hidden/burbel.class";
import { CookedRoach } from "../classes/pets/hidden/cooked-roach.class";
import { CuckooChick } from "../classes/pets/hidden/cuckoo-chick.class";
import { FakeNessie } from "../classes/pets/hidden/fake-nessie.class";
import { FarmerMouse } from "../classes/pets/custom/tier-1/farmer-mouse.class";
import { GuineaPiglet } from "../classes/pets/hidden/guinea-piglet.class";
import { HydraHead } from "../classes/pets/hidden/hydra-head.class";
import { MobyDick } from "../classes/pets/hidden/moby-dick.class";
import { Nudibranch } from "../classes/pets/custom/tier-1/nudibranch.class";
import { PeacockSpider } from "../classes/pets/custom/tier-1/peacock-spider.class";
import { PygmySeahorse } from "../classes/pets/custom/tier-1/pygmy-seahorse.class";
import { Quail } from "../classes/pets/hidden/quail.class";
import { Quoll } from "../classes/pets/custom/tier-1/quoll.class";
import { Silverfish } from "../classes/pets/custom/tier-1/silverfish.class";
import { SleepingGelada } from "../classes/pets/hidden/sleeping-gelada.class";
import { Sloth } from "../classes/pets/custom/tier-1/sloth.class";
import { UmbrellaBird } from "../classes/pets/custom/tier-1/umbrella-bird.class";
import { Weevil } from "../classes/pets/custom/tier-1/weevil.class";
import { AlbinoSquirrel } from "../classes/pets/custom/tier-2/albino-squirrel.class";
import { Amphisbaena } from "../classes/pets/custom/tier-2/amphisbaena.class";
import { DesertRainFrog } from "../classes/pets/custom/tier-2/desert-rain-frog.class";
import { DungBeetle } from "../classes/pets/custom/tier-2/dung-beetle.class";
import { FarmerChicken } from "../classes/pets/custom/tier-2/farmer-chicken.class";
import { FruitFly } from "../classes/pets/custom/tier-2/fruit-fly.class";
import { GiantSquirrel } from "../classes/pets/custom/tier-2/giant-squirrel.class";
import { HermitCrab } from "../classes/pets/custom/tier-2/hermit-crab.class";
import { HonduranWhiteBat } from "../classes/pets/custom/tier-2/honduran-white-bat.class";
import { Mandarinfish } from "../classes/pets/custom/tier-2/mandarinfish.class";
import { Mink } from "../classes/pets/custom/tier-2/mink.class";
import { Olm } from "../classes/pets/custom/tier-2/olm.class";
import { PinkRobin } from "../classes/pets/custom/tier-2/pink-robin.class";
import { Roadrunner } from "../classes/pets/custom/tier-2/roadrunner.class";
import { SpottedHandfish } from "../classes/pets/custom/tier-2/spotted-handfish.class";
import { Tadpole } from "../classes/pets/custom/tier-2/tadpole.class";
import { ThornyDragon } from "../classes/pets/custom/tier-2/thorny-dragon.class";
import { Vervet } from "../classes/pets/custom/tier-2/vervet.class";
import { Barnacle } from "../classes/pets/custom/tier-3/barnacle.class";
import { BlueDragon } from "../classes/pets/custom/tier-3/blue-dragon.class";
import { BrazillianTreehopper } from "../classes/pets/custom/tier-3/brazillian-treehopper.class";
import { Caladrius } from "../classes/pets/custom/tier-3/caladrius.class";
import { Centipede } from "../classes/pets/custom/tier-3/centipede.class";
import { Dimetrodon } from "../classes/pets/custom/tier-3/dimetrodon.class";
import { Dugong } from "../classes/pets/custom/tier-3/dugong.class";
import { FarmerPig } from "../classes/pets/custom/tier-3/farmer-pig.class";
import { Gerenuk } from "../classes/pets/custom/tier-3/gerenuk.class";
import { GreatPotoo } from "../classes/pets/custom/tier-3/great-potoo.class";
import { JewelCaterpillar } from "../classes/pets/custom/tier-3/jewel-caterpillar.class";
import { Pangasius } from "../classes/pets/custom/tier-3/pangasius.class";
import { PatagonianMara } from "../classes/pets/custom/tier-3/patagonian-mara.class";
import { Pony } from "../classes/pets/custom/tier-3/pony.class";
import { QuailChick } from "../classes/pets/custom/tier-3/quail-chick.class";
import { QueenBee } from "../classes/pets/custom/tier-3/queen-bee.class";
import { Quetzalcoatlus } from "../classes/pets/custom/tier-3/quetzalcoatlus.class";
import { SageGrouse } from "../classes/pets/custom/tier-3/sage-grouse.class";
import { SarcasticFringehead } from "../classes/pets/custom/tier-3/sarcastic-fringehead.class";
import { SilkieChicken } from "../classes/pets/custom/tier-3/silkie-chicken.class";
import { SugarGlider } from "../classes/pets/custom/tier-3/sugar-glider.class";
import { VampireParrot } from "../classes/pets/custom/tier-3/vampire-parrot.class";
import { Ahuizotl } from "../classes/pets/custom/tier-4/ahuizotl.class";
import { Andrewsarchus } from "../classes/pets/custom/tier-4/andrewsarchus.class";
import { Bloodhound } from "../classes/pets/custom/tier-4/bloodhound.class";
import { BlueFootedBooby } from "../classes/pets/custom/tier-4/blue-footed-booby.class";
import { Cuckoo } from "../classes/pets/custom/tier-4/cuckoo.class";
import { Deinocheirus } from "../classes/pets/custom/tier-4/deinocheirus.class";
import { FarmerCat } from "../classes/pets/custom/tier-4/farmer-cat.class";
import { Gazelle } from "../classes/pets/custom/tier-4/gazelle.class";
import { Gelada } from "../classes/pets/custom/tier-4/gelada.class";
import { Hoatzin } from "../classes/pets/custom/tier-4/hoatzin.class";
import { LeafGecko } from "../classes/pets/custom/tier-4/leaf-gecko.class";
import { LeafySeaDragon } from "../classes/pets/custom/tier-4/leafy-sea-dragon.class";
import { Locust } from "../classes/pets/custom/tier-4/locust.class";
import { PoodleMoth } from "../classes/pets/custom/tier-4/poodle-moth.class";
import { RacketTail } from "../classes/pets/custom/tier-4/racket-tail.class";
import { RuspolisTuraco } from "../classes/pets/custom/tier-4/ruspolis-turaco.class";
import { SpiderCrab } from "../classes/pets/custom/tier-4/spider-crab.class";
import { SpinyBushViper } from "../classes/pets/custom/tier-4/spiny-bush-viper.class";
import { TandAndTand } from "../classes/pets/hidden/tand-and-tand.class";
import { Tardigrade } from "../classes/pets/custom/tier-4/tardigrade.class";
import { Trout } from "../classes/pets/custom/tier-4/trout.class";
import { YetiCrab } from "../classes/pets/custom/tier-4/yeti-crab.class";
import { BlueJay } from "../classes/pets/custom/tier-5/blue-jay.class";
import { BrahmaChicken } from "../classes/pets/custom/tier-5/brahma-chicken.class";
import { Estemmenosuchus } from "../classes/pets/custom/tier-5/estemmenosuchus.class";
import { FarmerCrow } from "../classes/pets/custom/tier-5/farmer-crow.class";
import { Flounder } from "../classes/pets/custom/tier-5/flounder.class";
import { GiantIsopod } from "../classes/pets/custom/tier-5/giant-isopod.class";
import { Hippogriff } from "../classes/pets/custom/tier-5/hippogriff.class";
import { Jackal } from "../classes/pets/custom/tier-5/jackal.class";
import { Lusca } from "../classes/pets/custom/tier-5/lusca.class";
import { Maltese } from "../classes/pets/custom/tier-5/maltese.class";
import { Namazu } from "../classes/pets/custom/tier-5/namazu.class";
import { PacificFanfish } from "../classes/pets/custom/tier-5/pacific-fanfish.class";
import { Tarasque } from "../classes/pets/custom/tier-5/tarasque.class";
import { VenusFlytrap } from "../classes/pets/custom/tier-5/venus-flytrap.class";
import { WoollyRhino } from "../classes/pets/custom/tier-5/woolly-rhino.class";
import { Akhlut } from "../classes/pets/custom/tier-6/akhlut.class";
import { Bakunawa } from "../classes/pets/custom/tier-6/bakunawa.class";
import { BlackBear } from "../classes/pets/custom/tier-6/black-bear.class";
import { Chimpanzee } from "../classes/pets/custom/tier-6/chimpanzee.class";
import { CoconutCrab } from "../classes/pets/custom/tier-6/coconut-crab.class";
import { Dunkleosteus } from "../classes/pets/custom/tier-6/dunkleosteus.class";
import { EagleOwl } from "../classes/pets/custom/tier-6/eagle-owl.class";
import { HoodedSeal } from "../classes/pets/custom/tier-6/hooded-seal.class";
import { Lamprey } from "../classes/pets/custom/tier-6/lamprey.class";
import { Markhor } from "../classes/pets/custom/tier-6/markhor.class";
import { SmallOne } from "../classes/pets/custom/tier-6/small-one.class";
import { Sunfish } from "../classes/pets/custom/tier-6/sunfish.class";
import { TerrorBird } from "../classes/pets/custom/tier-6/terror-bird.class";
import { VampireSquid } from "../classes/pets/custom/tier-6/vampire-squid.class";
import { WinterSpirit } from "../classes/pets/custom/tier-6/winter-spirit.class";
import { YellowBoxfish } from "../classes/pets/custom/tier-6/yellow-boxfish.class";

export const PET_REGISTRY: { [key: string]: any } = {
    'Ant': Ant,
    'Cricket': Cricket,
    'Fish': Fish,
    'Horse': Horse,
    'Mosquito': Mosquito,
    'Duck': Duck,
    'Beaver': Beaver,
    'Otter': Otter,
    'Pig': Pig,
    'Snail': Snail,
    'Crab': Crab,
    'Swan': Swan,
    'Rat': Rat,
    'Hedgehog': Hedgehog,
    'Peacock': Peacock,
    'Flamingo': Flamingo,
    'Worm': Worm,
    'Kangaroo': Kangaroo,
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
    'Skunk': Skunk,
    'Hippo': Hippo,
    'Bison': Bison,
    'Blowfish': Blowfish,
    'Turtle': Turtle,
    'Squirrel': Squirrel,
    'Penguin': Penguin,
    'Deer': Deer,
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
    'Fly': Fly,
    'Moth': Moth,
    'Bluebird': Bluebird,
    'Chinchilla': Chinchilla,
    'Beetle': Beetle,
    'Ladybug': Ladybug,
    'Chipmunk': Chipmunk,
    'Gecko': Gecko,
    'Ferret': Ferret,
    'Robin': Robin,
    'Bat': Bat,
    'Bilby': Bilby,
    'Dromedary': Dromedary,
    'Shrimp': Shrimp,
    'Toucan': Toucan,
    'Beluga Sturgeon': BelugaSturgeon,
    'Tabby Cat': TabbyCat,
    'Mandrill': Mandrill,
    'Lemur': Lemur,
    'Hoopoe Bird': HoopoeBird,
    'Tropical Fish': TropicalFish,
    'Hatching Chick': HatchingChick,
    'Goldfish': Goldfish,
    'Owl': Owl,
    'Mole': Mole,
    'Raccoon': Raccoon,
    'Flying Squirrel': FlyingSquirrel,
    'Pangolin': Pangolin,
    'Puppy': Puppy,
    'Purple Frog': PurpleFrog,
    'Hare': Hare,
    'Microbe': Microbe,
    'Lobster': Lobster,
    'Buffalo': Buffalo,
    'Llama': Llama,
    'Caterpillar': Caterpillar,
    'Doberman': Doberman,
    'Tahr': Tahr,
    'Whale Shark': WhaleShark,
    'Chameleon': Chameleon,
    'Gharial': Gharial,
    'Stonefish': Stonefish,
    'Poodle': Poodle,
    'Goat': Goat,
    'Chicken': Chicken,
    'Orchid Mantis': OrchidMantis,
    'Panther': Panther,
    'Axolotl': Axolotl,
    'Snapping Turtle': SnappingTurtle,
    'Mosasaurus': Mosasaurus,
    'Sting Ray': StingRay,
    'Mantis Shrimp': MantisShrimp,
    'Lionfish': Lionfish,
    'Tyrannosaurus': Tyrannosaurus,
    'Octopus': Octopus,
    'Anglerfish': Anglerfish,
    'Sauropod': Sauropod,
    'Elephant Seal': ElephantSeal,
    'Puma': Puma,
    'Mongoose': Mongoose,
    'Pillbug': Pillbug,
    'Duckling': Duckling,
    'Cockroach': Cockroach,
    'Frog': Frog,
    'Seahorse': Seahorse,
    'Iguana': Iguana,
    'Hummingbird': Hummingbird,
    'Marmoset': Marmoset,
    'Pheasant': Pheasant,
    'Kiwi': Kiwi,
    'Chihuahua': Chihuahua,
    'Firefly': Firefly,
    'Koala': Koala,
    'Yak': Yak,
    'Salamander': Salamander,
    'Panda': Panda,
    'Guinea Pig': GuineaPig,
    'Jellyfish': Jellyfish,
    'Pug': Pug,
    'Atlantic Puffin': AtlanticPuffin,
    'Dove': Dove,
    'Dumbo Octopus': DumboOctopus,
    'Bass': Bass,
    'Leech': Leech,
    'Woodpecker': Woodpecker,
    'Toad': Toad,
    'Starfish': Starfish,
    'Clownfish': Clownfish,
    'Blobfish': Blobfish,
    'Capybara': Capybara,
    'Okapi': Okapi,
    'Cassowary': Cassowary,
    'Anteater': Anteater,
    'Orangutan': Orangutan,
    'Eel': Eel,
    'Hawk': Hawk,
    'Platypus': Platypus,
    'Praying Mantis': PrayingMantis,
    'Crow': Crow,
    'Donkey': Donkey,
    'Fairy Armadillo': FairyArmadillo,
    'Fossa': Fossa,
    'Siamese': Siamese,
    'Elk': Elk,
    'Sparrow': Sparrow,
    'Sword Fish': SwordFish,
    'Polar Bear': PolarBear,
    'Siberian Husky': SiberianHusky,
    'Lion': Lion,
    'Triceratops': Triceratops,
    'Zebra': Zebra,
    'Fox': Fox,
    'Hamster': Hamster,
    'Shoebill': Shoebill,
    'Vulture': Vulture,
    'Ibex': Ibex,
    'Komodo': Komodo,
    'Ostrich': Ostrich,
    'Reindeer': Reindeer,
    'Stegosaurus': Stegosaurus,
    'Piranha': Piranha,
    'Hammerhead Shark': HammerheadShark,
    'Therizinosaurus': Therizinosaurus,
    'Real Velociraptor': RealVelociraptor,
    'Spinosaurus': Spinosaurus,
    'Bulldog': Bulldog,
    'Groundhog': Groundhog,
    'Cone Snail': ConeSnail,
    'Goose': Goose,
    'Lemming': Lemming,
    'Pied Tamarin': PiedTamarin,
    'Opossum': Opossum,
    'Silkmoth': Silkmoth,
    'Magpie': Magpie,
    'Hercules Beetle': HerculesBeetle,
    'Stoat': Stoat,
    'Black Necked Stilt': BlackNeckedStilt,
    'Squid': Squid,
    'Sea Urchin': SeaUrchin,
    'Door Head Ant': DoorHeadAnt,
    'Lizard': Lizard,
    'Sea Turtle': SeaTurtle,
    'African Penguin': AfricanPenguin,
    'Musk Ox': MuskOx,
    'Flea': Flea,
    'Royal Flycatcher': RoyalFlycatcher,
    'Surgeon Fish': SurgeonFish,
    'Weasel': Weasel,
    'Guineafowl': Guineafowl,
    'Betta Fish': BettaFish,
    'Meerkat': Meerkat,
    'Flying Fish': FlyingFish,
    'Baboon': Baboon,
    'Osprey': Osprey,
    'Manatee': Manatee,
    'Cuttlefish': Cuttlefish,
    'Egyptian Vulture': EgyptianVulture,
    'Saiga Antelope': SaigaAntelope,
    'Sealion': Sealion,
    'Vaquita': Vaquita,
    'Slug': Slug,
    'Poison Dart Frog': PoisonDartFrog,
    'Secretary Bird': SecretaryBird,
    'Manta Ray': MantaRay,
    'Macaque': Macaque,
    'Nyala': Nyala,
    'Nurse Shark': NurseShark,
    'Silver Fox': SilverFox,
    'Fire Ant': FireAnt,
    'Cockatoo': Cockatoo,
    'Blue Ringed Octopus': BlueRingedOctopus,
    'Crane': Crane,
    'Emu': Emu,
    'Wildebeest': Wildebeest,
    'Highland Cow': HighlandCow,
    'Catfish': Catfish,
    'Warthog': Warthog,
    'Cobra': Cobra,
    'Grizzly Bear': GrizzlyBear,
    'German Shepherd': GermanShepherd,
    'Bird of Paradise': BirdOfParadise,
    'Oyster': Oyster,
    'Rockhopper Penguin': RockhopperPenguin,
    'Jerboa': Jerboa,
    'Frilled Dragon': FrilledDragon,
    'Wombat': Wombat,
    'Frigatebird': Frigatebird,
    'Aardvark': Aardvark,
    'Bear': Bear,
    'Emperor Tamarin': EmperorTamarin,
    'Porcupine': Porcupine,
    'Wasp': Wasp,
    'Dragonfly': Dragonfly,
    'Lynx': Lynx,
    'Alpaca': Alpaca,
    'Hyena': Hyena,
    'Moose': Moose,
    'Sea Cucumber': SeaCucumber,
    'Lioness': Lioness,
    'Walrus': Walrus,
    'White Tiger': WhiteTiger,
    'Basilisk': Basilisk,
    'Nightcrawler': Nightcrawler,
    'Sphinx': Sphinx,
    'Chupacabra': Chupacabra,
    'Golden Beetle': GoldenBeetle,
    'Foo Dog': FooDog,
    'Tree': Tree,
    'Pegasus': Pegasus,
    'Deer Lord': DeerLord,
    'Fairy': Fairy,
    'Rootling': Rootling,
    'Anubis': Anubis,
    'Old Mouse': OldMouse,
    'Hippocampus': Hippocampus,
    'Platybelodon': Platybelodon,
    'Boitata': Boitata,
    'Mimic': Mimic,
    'Nurikabe': Nurikabe,
    'Tandgnost': Tandgnost,
    'Tandgrisner': Tandgrisner,
    'Great One': GreatOne,
    'Leviathan': Leviathan,
    'Questing Beast': QuestingBeast,
    'Cockatrice': Cockatrice,
    'Amargasaurus': Amargasaurus,
    'Tarantula Hawk': TarantulaHawk,
    'Angry Pygmy Hog': AngryPygmyHog,
    'Bee': Bee,
    'Bus': Bus,
    'Butterfly': Butterfly,
    'Chick': Chick,
    'Dirty Rat': DirtyRat,
    'Golden Retriever': GoldenRetriever,
    'Lizard Tail': LizardTail,
    'Nest': Nest,
    'Ram': Ram,
    'Smaller Slug': SmallerSlug,
    'Loyal Chinchilla': LoyalChinchilla,
    'Smallest Slug': SmallestSlug,
    'Zombie Cricket': ZombieCricket,
    'Zombie Fly': ZombieFly,
    'Cracked Egg': CrackedEgg,
    'Nessie?': NessieQ,
    'Young Phoenix': YoungPhoenix,
    'Fire Pup': FirePup,
    'Monty': Monty,
    'Rock': Rock,
    'Daycrawler': Daycrawler,
    'Smaller Slime': SmallerSlime,
    'Chimera Goat': ChimeraGoat,
    'Head': Head,
    'Salmon': Salmon,
    'Mimic Octopus': MimicOctopus,
    'Velociraptor': Velociraptor,
    'Baby Urchin': BabyUrchin,
    'Fairy Ball': FairyBall,
    'Baku': Baku,
    'Axehandle Hound': AxehandleHound,
    'Barghest': Barghest,
    'Tsuchinoko': Tsuchinoko,
    'Murmel': Murmel,
    'Alchemedes': Alchemedes,
    'Pengobble': Pengobble,
    'Warf': Warf,
    'Bunyip': Bunyip,
    'Sneaky Egg': SneakyEgg,
    'Cuddle Toad': CuddleToad,
    '???': QuestionMarks,
    'Ghost Kitten': GhostKitten,
    'Frost Wolf': FrostWolf,
    'Mothman': Mothman,
    'Drop Bear': DropBear,
    'Jackalope': Jackalope,
    'Ogopogo': Ogopogo,
    'Thunderbird': Thunderbird,
    'Gargoyle': Gargoyle,
    'Bigfoot': Bigfoot,
    'Lucky Cat': LuckyCat,
    'Skeleton Dog': SkeletonDog,
    'Mandrake': Mandrake,
    'Fur-Bearing Trout': FurBearingTrout,
    'Mana Hound': ManaHound,
    'Calygreyhound': Calygreyhound,
    'Brain Cramp': BrainCramp,
    'Minotaur': Minotaur,
    'Wyvern': Wyvern,
    'Ouroboros': Ouroboros,
    'Griffin': Griffin,
    'Kraken': Kraken,
    'Visitor': Visitor,
    'Vampire Bat': VampireBat,
    'Tiger Bug': TigerBug,
    'Tatzelwurm': Tatzelwurm,
    'Cyclops': Cyclops,
    'Chimera': Chimera,
    'Roc': Roc,
    'Worm of Sand': WormOfSand,
    'Red Dragon': RedDragon,
    'Unicorn': Unicorn,
    'Loveland Frogman': LovelandFrogman,
    'Salmon of Knowledge': SalmonOfKnowledge,
    'Jersey Devil': JerseyDevil,
    'Pixiu': Pixiu,
    'Kitsune': Kitsune,
    'Nessie': Nessie,
    'Bad Dog': BadDog,
    'Werewolf': Werewolf,
    'Amalgamation': Amalgamation,
    'Manticore': Manticore,
    'Phoenix': Phoenix,
    'Quetzalcoatl': Quetzalcoatl,
    'Team Spirit': TeamSpirit,
    'Sleipnir': Sleipnir,
    'Sea Serpent': SeaSerpent,
    'Yeti': Yeti,
    'Cerberus': Cerberus,
    'Hydra': Hydra,
    'Behemoth': Behemoth,
    'Ili Pika': IliPika,
    'Malay Tapir': MalayTapir,
    'Bombus Dahlbomii': BombusDahlbomii,
    'African Wild Dog': AfricanWildDog,
    'Ethiopian Wolf': EthiopianWolf,
    'Fan Mussel': FanMussel,
    'Togian Babirusa': TogianBabirusa,
    'Tooth Billed Pigeon': ToothBilledPigeon,
    'Volcano Snail': VolcanoSnail,
    'Araripe Manakin': AraripeManakin,
    'European Mink': EuropeanMink,
    'Proboscis Monkey': ProboscisMonkey,
    'Pygmy Hog': PygmyHog,
    'Saola': Saola,
    'Saker Falcon': SakerFalcon,
    'Taita Shrew': TaitaShrew,
    'Darwin\'s Fox': DarwinsFox,
    'White-Bellied Heron': WhiteBelliedHeron,
    'Amami Rabbit': AmamiRabbit,
    'Tree Kangaroo': TreeKangaroo,
    'Blue-Throated Macaw': BlueThroatedMacaw,
    'Hirola': Hirola,
    'Monkey-Faced Bat': MonkeyFacedBat,
    'Takin': Takin,
    'Tucuxi': Tucuxi,
    'Pygmy Hippo': PygmyHippo,
    'Spoon-Billed Sandpiper': SpoonBilledSandpiper,
    'Angelshark': Angelshark,
    'Giant Otter': GiantOtter,
    'Giant Tortoise': GiantTortoise,
    'Humphead Wrasse': HumpheadWrasse,
    'Kakapo': Kakapo,
    'Longcomb Sawfish': LongcombSawfish,
    'Tasmanian Devil': TasmanianDevil,
    'Amazon River Dolphin': AmazonRiverDolphin,
    'Aye-aye': AyeAye,
    'Banggai Cardinalfish': BanggaiCardinalfish,
    'Geometric Tortoise': GeometricTortoise,
    'Giant Pangasius': GiantPangasius,
    'Hawaiian Monk Seal': HawaiianMonkSeal,
    'Marine Iguana': MarineIguana,
    'Red Panda': RedPanda,
    'Taita Thrush': TaitaThrush,
    'Snow Leopard': SnowLeopard,
    'Painted Terrapin': PaintedTerrapin,
    'Amsterdam Albatross': AmsterdamAlbatross,
    'Black Rhino': BlackRhino,
    'Blue Whale': BlueWhale,
    'Green Sea Turtle': GreenSeaTurtle,
    'Helmeted Hornbill': HelmetedHornbill,
    'Philippine Eagle': PhilippineEagle,
    'Sumatran Tiger': SumatranTiger,
    'Adult Flounder': AdultFlounder,
    'Budgie': Budgie,
    'Burbel': Burbel,
    'Chimera Lion': ChimeraLion,
    'Chimera Snake': ChimeraSnake,
    'Cooked Roach': CookedRoach,
    'Cuckoo Chick': CuckooChick,
    'Fake Nessie': FakeNessie,
    'Farmer Mouse': FarmerMouse,
    'Guinea Piglet': GuineaPiglet,
    'Hydra Head': HydraHead,
    'Moby Dick': MobyDick,
    'Nudibranch': Nudibranch,
    'Peacock Spider': PeacockSpider,
    'Pygmy Seahorse': PygmySeahorse,
    'Quail': Quail,
    'Quoll': Quoll,
    'Silverfish': Silverfish,
    'Sleeping Gelada': SleepingGelada,
    'Sloth': Sloth,
    'Umbrella Bird': UmbrellaBird,
    'Weevil': Weevil,
    'Albino Squirrel': AlbinoSquirrel,
    'Amphisbaena': Amphisbaena,
    'Desert Rain Frog': DesertRainFrog,
    'Dung Beetle': DungBeetle,
    'Farmer Chicken': FarmerChicken,
    'Fruit Fly': FruitFly,
    'Giant Squirrel': GiantSquirrel,
    'Hermit Crab': HermitCrab,
    'Honduran White Bat': HonduranWhiteBat,
    'Mandarinfish': Mandarinfish,
    'Mink': Mink,
    'Olm': Olm,
    'Pink Robin': PinkRobin,
    'Roadrunner': Roadrunner,
    'Spotted Handfish': SpottedHandfish,
    'Tadpole': Tadpole,
    'Thorny Dragon': ThornyDragon,
    'Vervet': Vervet,
    'Barnacle': Barnacle,
    'Blue Dragon': BlueDragon,
    'Brazillian Treehopper': BrazillianTreehopper,
    'Caladrius': Caladrius,
    'Centipede': Centipede,
    'Dimetrodon': Dimetrodon,
    'Dugong': Dugong,
    'Farmer Pig': FarmerPig,
    'Gerenuk': Gerenuk,
    'Great Potoo': GreatPotoo,
    'Jewel Caterpillar': JewelCaterpillar,
    'Pangasius': Pangasius,
    'Patagonian Mara': PatagonianMara,
    'Pony': Pony,
    'Quail Chick': QuailChick,
    'Queen Bee': QueenBee,
    'Quetzalcoatlus': Quetzalcoatlus,
    'Sage-Grouse': SageGrouse,
    'Sarcastic Fringehead': SarcasticFringehead,
    'Silkie Chicken': SilkieChicken,
    'Sugar Glider': SugarGlider,
    'Vampire Parrot': VampireParrot,
    'Ahuizotl': Ahuizotl,
    'Andrewsarchus': Andrewsarchus,
    'Bloodhound': Bloodhound,
    'Blue-Footed Booby': BlueFootedBooby,
    'Cuckoo': Cuckoo,
    'Deinocheirus': Deinocheirus,
    'FarmerCat': FarmerCat,
    'Gazelle': Gazelle,
    'Gelada': Gelada,
    'Hoatzin': Hoatzin,
    'Leaf Gecko': LeafGecko,
    'Leafy Sea Dragon': LeafySeaDragon,
    'Locust': Locust,
    'Poodle Moth': PoodleMoth,
    'Racket Tail': RacketTail,
    'Ruspolis Turaco': RuspolisTuraco,
    'Spider Crab': SpiderCrab,
    'Spiny Bush Viper': SpinyBushViper,
    'Tand and Tand': TandAndTand,
    'Tardigrade': Tardigrade,
    'Trout': Trout,
    'Yeti Crab': YetiCrab,
    'Blue Jay': BlueJay,
    'Brahma Chicken': BrahmaChicken,
    'Estemmenosuchus': Estemmenosuchus,
    'Farmer Crow': FarmerCrow,
    'Flounder': Flounder,
    'Giant Isopod': GiantIsopod,
    'Hippogriff': Hippogriff,
    'Jackal': Jackal,
    'Lusca': Lusca,
    'Maltese': Maltese,
    'Namazu': Namazu,
    'Pacific Fanfish': PacificFanfish,
    'Tarasque': Tarasque,
    'Venus Flytrap': VenusFlytrap,
    'Woolly Rhino': WoollyRhino,
    'Akhlut': Akhlut,
    'Bakunawa': Bakunawa,
    'Black Bear': BlackBear,
    'Chimpanzee': Chimpanzee,
    'Coconut Crab': CoconutCrab,
    'Dunkleosteus': Dunkleosteus,
    'Eagle Owl': EagleOwl,
    'Hooded Seal': HoodedSeal,
    'Lamprey': Lamprey,
    'Markhor': Markhor,
    'Small One': SmallOne,
    'Sunfish': Sunfish,
    'Terror Bird': TerrorBird,
    'Vampire Squid': VampireSquid,
    'Winter Spirit': WinterSpirit,
    'Yellow Boxfish': YellowBoxfish,
    'Abomination': Abomination,
    'Albatross': Albatross,
    'Ammonite': Ammonite,
    'Bay Cat': BayCat,
    'Beluga Whale': BelugaWhale,
    'Bonobo': Bonobo,
    'California Condor': CaliforniaCondor,
    'Cardinal': Cardinal,
    'Darwins Fox': DarwinsFox,
    'Eagle': Eagle,
    'Falcon': Falcon,
    'Farmer Cat': FarmerCat,
    'Farmer Dog': FarmerDog,
    'Giant Eyes Dog': GiantEyesDog,
    'Gibbon': Gibbon,
    'Goblin Shark': GoblinShark,
    'Gold Fish': Goldfish,
    'Golden Tamarin': GoldenTamarin,
    'Good Dog': GoodDog,
    'Harpy Eagle': HarpyEagle,
    'Iriomote Cat': IriomoteCat,
    'Kappa': Kappa,
    'Mouse': Mouse,
    'Orca': Orca,
    'Parrot': Parrot,
    'Pelican': Pelican,
    'Pigeon': Pigeon,
    'Pteranodon': Pteranodon,
    'Question Marks': QuestionMarks,
    'Red Lipped Batfish': RedLippedBatfish,
    'Roloway Monkey': RolowayMonkey,
    'Sabertooth Tiger': SabertoothTiger,
    'Sea Anemone': SeaAnemone,
    'Seagull': Seagull,
    'Shima Enaga': ShimaEnaga,
    'Silky Sifaka': SilkySifaka,
    'Slime': Slime,
    'Spider': Spider,
    'Stork': Stork,
    'Takhi': Takhi,
    'Tapir': Tapir,
    'Termite': Termite,
    'Tuna': Tuna,
    'Whale': Whale,
    'Wolf': Wolf
};
