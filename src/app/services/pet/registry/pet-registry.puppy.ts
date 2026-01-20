import { Moth } from "../../../classes/pets/puppy/tier-1/moth.class";
import { Bluebird } from "../../../classes/pets/puppy/tier-1/bluebird.class";
import { Chinchilla } from "../../../classes/pets/puppy/tier-1/chinchilla.class";
import { Beetle } from "../../../classes/pets/puppy/tier-1/beetle.class";
import { Ladybug } from "../../../classes/pets/puppy/tier-1/ladybug.class";
import { Chipmunk } from "../../../classes/pets/puppy/tier-1/chipmunk.class";
import { Gecko } from "../../../classes/pets/puppy/tier-1/gecko.class";
import { Ferret } from "../../../classes/pets/puppy/tier-1/ferret.class";
import { Bat } from "../../../classes/pets/puppy/tier-2/bat.class";
import { Bilby } from "../../../classes/pets/puppy/tier-2/bilby.class";
import { Robin } from "../../../classes/pets/puppy/tier-2/robin.class";
import { Dromedary } from "../../../classes/pets/puppy/tier-2/dromedary.class";
import { Shrimp } from "../../../classes/pets/puppy/tier-2/shrimp.class";
import { BelugaSturgeon } from "../../../classes/pets/puppy/tier-2/beluga-sturgeon.class";
import { TabbyCat } from "../../../classes/pets/puppy/tier-2/tabby-cat.class";
import { Mandrill } from "../../../classes/pets/puppy/tier-2/mandrill.class";
import { Lemur } from "../../../classes/pets/puppy/tier-2/lemur.class";
import { Goldfish } from "../../../classes/pets/puppy/tier-2/goldfish.class";
import { Toucan } from "../../../classes/pets/puppy/tier-3/toucan.class";
import { HoopoeBird } from "../../../classes/pets/puppy/tier-3/hoopoe-bird.class";
import { TropicalFish } from "../../../classes/pets/puppy/tier-3/tropical-fish.class";
import { HatchingChick } from "../../../classes/pets/puppy/tier-3/hatching-chick.class";
import { Owl } from "../../../classes/pets/puppy/tier-3/owl.class";
import { Mole } from "../../../classes/pets/puppy/tier-3/mole.class";
import { Pangolin } from "../../../classes/pets/puppy/tier-3/pangolin.class";
import { Puppy } from "../../../classes/pets/puppy/tier-3/puppy.class";
import { PurpleFrog } from "../../../classes/pets/puppy/tier-3/purple-frog.class";
import { Hare } from "../../../classes/pets/puppy/tier-3/hare.class";
import { Microbe } from "../../../classes/pets/puppy/tier-4/microbe.class";
import { Lobster } from "../../../classes/pets/puppy/tier-4/lobster.class";
import { Buffalo } from "../../../classes/pets/puppy/tier-4/buffalo.class";
import { Llama } from "../../../classes/pets/puppy/tier-4/llama.class";
import { Caterpillar } from "../../../classes/pets/puppy/tier-4/caterpillar.class";
import { Doberman } from "../../../classes/pets/puppy/tier-4/doberman.class";
import { Tahr } from "../../../classes/pets/puppy/tier-4/tahr.class";
import { WhaleShark } from "../../../classes/pets/puppy/tier-4/whale-shark.class";
import { Chameleon } from "../../../classes/pets/puppy/tier-4/chameleon.class";
import { Gharial } from "../../../classes/pets/puppy/tier-4/gharial.class";
import { Stonefish } from "../../../classes/pets/puppy/tier-5/stonefish.class";
import { Chicken } from "../../../classes/pets/puppy/tier-5/chicken.class";
import { Eagle } from "../../../classes/pets/puppy/tier-5/eagles.class";
import { OrchidMantis } from "../../../classes/pets/puppy/tier-5/orchid-mantis.class";
import { Panther } from "../../../classes/pets/puppy/tier-5/panther.class";
import { Axolotl } from "../../../classes/pets/puppy/tier-5/axolotl.class";
import { Goat } from "../../../classes/pets/puppy/tier-5/goat.class";
import { SnappingTurtle } from "../../../classes/pets/puppy/tier-5/snapping-turtle.class";
import { Mosasaurus } from "../../../classes/pets/puppy/tier-5/mosasaurus.class";
import { StingRay } from "../../../classes/pets/puppy/tier-5/sting-ray.class";
import { MantisShrimp } from "../../../classes/pets/puppy/tier-6/mantis-shrimp.class";
import { Lionfish } from "../../../classes/pets/puppy/tier-6/lion-fish.class";
import { Tyrannosaurus } from "../../../classes/pets/puppy/tier-6/tyrannosaurus.class";
import { Octopus } from "../../../classes/pets/puppy/tier-6/octopus.class";
import { Anglerfish } from "../../../classes/pets/puppy/tier-6/anglerfish.class";
import { Sauropod } from "../../../classes/pets/puppy/tier-6/sauropod.class";
import { ElephantSeal } from "../../../classes/pets/puppy/tier-6/elephant-seal.class";
import { Puma } from "../../../classes/pets/puppy/tier-6/puma.class";
import { Mongoose } from "../../../classes/pets/puppy/tier-6/mongoose.class";

export const PUPPY_PET_REGISTRY: { [key: string]: any } = {
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
  'Goldfish': Goldfish,
  'Hoopoe Bird': HoopoeBird,
  'Tropical Fish': TropicalFish,
  'Hatching Chick': HatchingChick,
  'Owl': Owl,
  'Mole': Mole,
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
  'Eagle': Eagle
};
