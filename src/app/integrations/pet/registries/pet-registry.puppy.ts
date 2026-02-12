import { PetRegistryMap } from '../pet-registry.types';
import { Moth } from 'app/domain/entities/catalog/pets/puppy/tier-1/moth.class';
import { Bluebird } from 'app/domain/entities/catalog/pets/puppy/tier-1/bluebird.class';
import { Chinchilla } from 'app/domain/entities/catalog/pets/puppy/tier-1/chinchilla.class';
import { Beetle } from 'app/domain/entities/catalog/pets/puppy/tier-1/beetle.class';
import { Ladybug } from 'app/domain/entities/catalog/pets/puppy/tier-1/ladybug.class';
import { Chipmunk } from 'app/domain/entities/catalog/pets/puppy/tier-1/chipmunk.class';
import { Gecko } from 'app/domain/entities/catalog/pets/puppy/tier-1/gecko.class';
import { Ferret } from 'app/domain/entities/catalog/pets/puppy/tier-1/ferret.class';
import { Bat } from 'app/domain/entities/catalog/pets/puppy/tier-2/bat.class';
import { Bilby } from 'app/domain/entities/catalog/pets/puppy/tier-2/bilby.class';
import { Robin } from 'app/domain/entities/catalog/pets/puppy/tier-2/robin.class';
import { Dromedary } from 'app/domain/entities/catalog/pets/puppy/tier-2/dromedary.class';
import { Shrimp } from 'app/domain/entities/catalog/pets/puppy/tier-2/shrimp.class';
import { BelugaSturgeon } from 'app/domain/entities/catalog/pets/puppy/tier-2/beluga-sturgeon.class';
import { TabbyCat } from 'app/domain/entities/catalog/pets/puppy/tier-2/tabby-cat.class';
import { Mandrill } from 'app/domain/entities/catalog/pets/puppy/tier-2/mandrill.class';
import { Lemur } from 'app/domain/entities/catalog/pets/puppy/tier-2/lemur.class';
import { Goldfish } from 'app/domain/entities/catalog/pets/puppy/tier-2/goldfish.class';
import { Toucan } from 'app/domain/entities/catalog/pets/puppy/tier-3/toucan.class';
import { HoopoeBird } from 'app/domain/entities/catalog/pets/puppy/tier-3/hoopoe-bird.class';
import { TropicalFish } from 'app/domain/entities/catalog/pets/puppy/tier-3/tropical-fish.class';
import { HatchingChick } from 'app/domain/entities/catalog/pets/puppy/tier-3/hatching-chick.class';
import { Owl } from 'app/domain/entities/catalog/pets/puppy/tier-3/owl.class';
import { Mole } from 'app/domain/entities/catalog/pets/puppy/tier-3/mole.class';
import { Pangolin } from 'app/domain/entities/catalog/pets/puppy/tier-3/pangolin.class';
import { Puppy } from 'app/domain/entities/catalog/pets/puppy/tier-3/puppy.class';
import { PurpleFrog } from 'app/domain/entities/catalog/pets/puppy/tier-3/purple-frog.class';
import { Hare } from 'app/domain/entities/catalog/pets/puppy/tier-3/hare.class';
import { Microbe } from 'app/domain/entities/catalog/pets/puppy/tier-4/microbe.class';
import { Lobster } from 'app/domain/entities/catalog/pets/puppy/tier-4/lobster.class';
import { Buffalo } from 'app/domain/entities/catalog/pets/puppy/tier-4/buffalo.class';
import { Llama } from 'app/domain/entities/catalog/pets/puppy/tier-4/llama.class';
import { Caterpillar } from 'app/domain/entities/catalog/pets/puppy/tier-4/caterpillar.class';
import { Doberman } from 'app/domain/entities/catalog/pets/puppy/tier-4/doberman.class';
import { Tahr } from 'app/domain/entities/catalog/pets/puppy/tier-4/tahr.class';
import { WhaleShark } from 'app/domain/entities/catalog/pets/puppy/tier-4/whale-shark.class';
import { Chameleon } from 'app/domain/entities/catalog/pets/puppy/tier-4/chameleon.class';
import { Gharial } from 'app/domain/entities/catalog/pets/puppy/tier-4/gharial.class';
import { Stonefish } from 'app/domain/entities/catalog/pets/puppy/tier-5/stonefish.class';
import { Chicken } from 'app/domain/entities/catalog/pets/puppy/tier-5/chicken.class';
import { Eagle } from 'app/domain/entities/catalog/pets/puppy/tier-5/eagles.class';
import { OrchidMantis } from 'app/domain/entities/catalog/pets/puppy/tier-5/orchid-mantis.class';
import { Panther } from 'app/domain/entities/catalog/pets/puppy/tier-5/panther.class';
import { Axolotl } from 'app/domain/entities/catalog/pets/puppy/tier-5/axolotl.class';
import { Goat } from 'app/domain/entities/catalog/pets/puppy/tier-5/goat.class';
import { SnappingTurtle } from 'app/domain/entities/catalog/pets/puppy/tier-5/snapping-turtle.class';
import { Mosasaurus } from 'app/domain/entities/catalog/pets/puppy/tier-5/mosasaurus.class';
import { StingRay } from 'app/domain/entities/catalog/pets/puppy/tier-5/sting-ray.class';
import { MantisShrimp } from 'app/domain/entities/catalog/pets/puppy/tier-6/mantis-shrimp.class';
import { Lionfish } from 'app/domain/entities/catalog/pets/puppy/tier-6/lion-fish.class';
import { Tyrannosaurus } from 'app/domain/entities/catalog/pets/puppy/tier-6/tyrannosaurus.class';
import { Octopus } from 'app/domain/entities/catalog/pets/puppy/tier-6/octopus.class';
import { Anglerfish } from 'app/domain/entities/catalog/pets/puppy/tier-6/anglerfish.class';
import { Sauropod } from 'app/domain/entities/catalog/pets/puppy/tier-6/sauropod.class';
import { ElephantSeal } from 'app/domain/entities/catalog/pets/puppy/tier-6/elephant-seal.class';
import { Puma } from 'app/domain/entities/catalog/pets/puppy/tier-6/puma.class';
import { Mongoose } from 'app/domain/entities/catalog/pets/puppy/tier-6/mongoose.class';

export const PUPPY_PET_REGISTRY: PetRegistryMap = {
  Moth: Moth,
  Bluebird: Bluebird,
  Chinchilla: Chinchilla,
  Beetle: Beetle,
  Ladybug: Ladybug,
  Chipmunk: Chipmunk,
  Gecko: Gecko,
  Ferret: Ferret,
  Robin: Robin,
  Bat: Bat,
  Bilby: Bilby,
  Dromedary: Dromedary,
  Shrimp: Shrimp,
  Toucan: Toucan,
  'Beluga Sturgeon': BelugaSturgeon,
  'Tabby Cat': TabbyCat,
  Mandrill: Mandrill,
  Lemur: Lemur,
  'Gold Fish': Goldfish,
  'Hoopoe Bird': HoopoeBird,
  'Tropical Fish': TropicalFish,
  'Hatching Chick': HatchingChick,
  Owl: Owl,
  Mole: Mole,
  Pangolin: Pangolin,
  Puppy: Puppy,
  'Purple Frog': PurpleFrog,
  Hare: Hare,
  Microbe: Microbe,
  Lobster: Lobster,
  Buffalo: Buffalo,
  Llama: Llama,
  Caterpillar: Caterpillar,
  Doberman: Doberman,
  Tahr: Tahr,
  'Whale Shark': WhaleShark,
  Chameleon: Chameleon,
  Gharial: Gharial,
  Stonefish: Stonefish,
  Goat: Goat,
  Chicken: Chicken,
  'Orchid Mantis': OrchidMantis,
  Panther: Panther,
  Axolotl: Axolotl,
  'Snapping Turtle': SnappingTurtle,
  Mosasaurus: Mosasaurus,
  'Sting Ray': StingRay,
  'Mantis Shrimp': MantisShrimp,
  Lionfish: Lionfish,
  Tyrannosaurus: Tyrannosaurus,
  Octopus: Octopus,
  Anglerfish: Anglerfish,
  Sauropod: Sauropod,
  'Elephant Seal': ElephantSeal,
  Puma: Puma,
  Mongoose: Mongoose,
  Eagle: Eagle,
};




