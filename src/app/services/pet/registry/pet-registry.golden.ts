import { Bulldog } from '../../../classes/pets/golden/tier-1/bulldog.class';
import { Groundhog } from '../../../classes/pets/golden/tier-1/groundhog.class';
import { ConeSnail } from '../../../classes/pets/golden/tier-1/cone-snail.class';
import { Goose } from '../../../classes/pets/golden/tier-1/goose.class';
import { PiedTamarin } from '../../../classes/pets/golden/tier-1/pied-tamarin.class';
import { Silkmoth } from '../../../classes/pets/golden/tier-1/silkmoth.class';
import { Lemming } from '../../../classes/pets/golden/tier-1/lemming.class';
import { Magpie } from '../../../classes/pets/golden/tier-1/magpie.class';
import { Opossum } from '../../../classes/pets/golden/tier-1/opossum.class';
import { HerculesBeetle } from '../../../classes/pets/golden/tier-2/hercules-beetle.class';
import { Stoat } from '../../../classes/pets/golden/tier-2/stoat.class';
import { BlackNeckedStilt } from '../../../classes/pets/golden/tier-2/black-necked-stilt.class';
import { Squid } from '../../../classes/pets/golden/tier-2/squid.class';
import { SeaUrchin } from '../../../classes/pets/golden/tier-2/sea-urchin.class';
import { DoorHeadAnt } from '../../../classes/pets/golden/tier-2/door-head-ant.class';
import { Lizard } from '../../../classes/pets/golden/tier-2/lizard.class';
import { SeaTurtle } from '../../../classes/pets/golden/tier-2/sea-turtle.class';
import { AfricanPenguin } from '../../../classes/pets/golden/tier-2/african-penguin.class';
import { Meerkat } from '../../../classes/pets/golden/tier-2/meerkat.class';
import { MuskOx } from '../../../classes/pets/golden/tier-3/musk-ox.class';
import { Flea } from '../../../classes/pets/golden/tier-3/flea.class';
import { RoyalFlycatcher } from '../../../classes/pets/golden/tier-3/royal-flycatcher.class';
import { SurgeonFish } from '../../../classes/pets/golden/tier-3/surgeon-fish.class';
import { Weasel } from '../../../classes/pets/golden/tier-3/weasel.class';
import { Guineafowl } from '../../../classes/pets/golden/tier-3/guineafowl.class';
import { BettaFish } from '../../../classes/pets/golden/tier-3/betta-fish.class';
import { FlyingFish } from '../../../classes/pets/golden/tier-3/flying-fish.class';
import { Baboon } from '../../../classes/pets/golden/tier-3/baboon.class';
import { Osprey } from '../../../classes/pets/golden/tier-3/osprey.class';
import { Manatee } from '../../../classes/pets/golden/tier-4/manatee.class';
import { Cuttlefish } from '../../../classes/pets/golden/tier-4/cuttlefish.class';
import { EgyptianVulture } from '../../../classes/pets/golden/tier-4/egyptian-vulture.class';
import { SaigaAntelope } from '../../../classes/pets/golden/tier-4/saiga-antelope.class';
import { Sealion } from '../../../classes/pets/golden/tier-4/sealion.class';
import { Vaquita } from '../../../classes/pets/golden/tier-4/vaquita.class';
import { Slug } from '../../../classes/pets/golden/tier-4/slug.class';
import { PoisonDartFrog } from '../../../classes/pets/golden/tier-4/poison-dart-frog.class';
import { Falcon } from '../../../classes/pets/golden/tier-4/falcon.class';
import { MantaRay } from '../../../classes/pets/golden/tier-4/manta-ray.class';
import { Cockatoo } from '../../../classes/pets/golden/tier-4/cockatoo.class';
import { SecretaryBird } from '../../../classes/pets/golden/tier-5/secretary-bird.class';
import { Macaque } from '../../../classes/pets/golden/tier-5/macaque.class';
import { Nyala } from '../../../classes/pets/golden/tier-5/nyala.class';
import { NurseShark } from '../../../classes/pets/golden/tier-5/nurse-shark.class';
import { BelugaWhale } from '../../../classes/pets/golden/tier-5/beluga-whale.class';
import { Wolf } from '../../../classes/pets/golden/tier-5/wolf.class';
import { FireAnt } from '../../../classes/pets/golden/tier-5/fire-ant.class';
import { BlueRingedOctopus } from '../../../classes/pets/golden/tier-5/blue-ringed-octopus.class';
import { Crane } from '../../../classes/pets/golden/tier-5/crane.class';
import { Emu } from '../../../classes/pets/golden/tier-5/emu.class';
import { Wildebeest } from '../../../classes/pets/golden/tier-6/wildebeest.class';
import { HighlandCow } from '../../../classes/pets/golden/tier-6/highland-cow.class';
import { Catfish } from '../../../classes/pets/golden/tier-6/catfish.class';
import { Pteranodon } from '../../../classes/pets/golden/tier-6/pteranodon.class';
import { Warthog } from '../../../classes/pets/golden/tier-6/warthog.class';
import { Cobra } from '../../../classes/pets/golden/tier-6/cobra.class';
import { GrizzlyBear } from '../../../classes/pets/golden/tier-6/grizzly-bear.class';
import { GermanShepherd } from '../../../classes/pets/golden/tier-6/german-shepherd.class';
import { BirdOfParadise } from '../../../classes/pets/golden/tier-6/bird-of-paradise.class';
import { Oyster } from '../../../classes/pets/golden/tier-6/oyster.class';

export const GOLDEN_PET_REGISTRY: { [key: string]: any } = {
  Bulldog: Bulldog,
  Groundhog: Groundhog,
  'Cone Snail': ConeSnail,
  Goose: Goose,
  Lemming: Lemming,
  'Pied Tamarin': PiedTamarin,
  Opossum: Opossum,
  Silkmoth: Silkmoth,
  Magpie: Magpie,
  'Hercules Beetle': HerculesBeetle,
  Stoat: Stoat,
  'Black Necked Stilt': BlackNeckedStilt,
  Squid: Squid,
  'Sea Urchin': SeaUrchin,
  'Door Head Ant': DoorHeadAnt,
  Lizard: Lizard,
  'Sea Turtle': SeaTurtle,
  'African Penguin': AfricanPenguin,
  'Musk Ox': MuskOx,
  Flea: Flea,
  'Royal Flycatcher': RoyalFlycatcher,
  'Surgeon Fish': SurgeonFish,
  Weasel: Weasel,
  Guineafowl: Guineafowl,
  'Betta Fish': BettaFish,
  Meerkat: Meerkat,
  'Flying Fish': FlyingFish,
  Baboon: Baboon,
  Osprey: Osprey,
  Manatee: Manatee,
  Cuttlefish: Cuttlefish,
  'Egyptian Vulture': EgyptianVulture,
  'Saiga Antelope': SaigaAntelope,
  Sealion: Sealion,
  Vaquita: Vaquita,
  Slug: Slug,
  'Poison Dart Frog': PoisonDartFrog,
  'Secretary Bird': SecretaryBird,
  'Manta Ray': MantaRay,
  Macaque: Macaque,
  Nyala: Nyala,
  'Nurse Shark': NurseShark,
  'Fire Ant': FireAnt,
  Cockatoo: Cockatoo,
  'Blue Ringed Octopus': BlueRingedOctopus,
  Crane: Crane,
  Emu: Emu,
  Wildebeest: Wildebeest,
  'Highland Cow': HighlandCow,
  Catfish: Catfish,
  Warthog: Warthog,
  Cobra: Cobra,
  'Grizzly Bear': GrizzlyBear,
  'German Shepherd': GermanShepherd,
  'Bird of Paradise': BirdOfParadise,
  Oyster: Oyster,
  'Beluga Whale': BelugaWhale,
  Falcon: Falcon,
  Pteranodon: Pteranodon,
  Wolf: Wolf,
};
