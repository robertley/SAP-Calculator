import { PetRegistryMap } from '../pet-registry.types';
import { Bulldog } from 'app/domain/entities/catalog/pets/golden/tier-1/bulldog.class';
import { Groundhog } from 'app/domain/entities/catalog/pets/golden/tier-1/groundhog.class';
import { ConeSnail } from 'app/domain/entities/catalog/pets/golden/tier-1/cone-snail.class';
import { Goose } from 'app/domain/entities/catalog/pets/golden/tier-1/goose.class';
import { PiedTamarin } from 'app/domain/entities/catalog/pets/golden/tier-1/pied-tamarin.class';
import { Silkmoth } from 'app/domain/entities/catalog/pets/golden/tier-1/silkmoth.class';
import { Lemming } from 'app/domain/entities/catalog/pets/golden/tier-1/lemming.class';
import { Magpie } from 'app/domain/entities/catalog/pets/golden/tier-1/magpie.class';
import { Opossum } from 'app/domain/entities/catalog/pets/golden/tier-1/opossum.class';
import { HerculesBeetle } from 'app/domain/entities/catalog/pets/golden/tier-2/hercules-beetle.class';
import { Stoat } from 'app/domain/entities/catalog/pets/golden/tier-2/stoat.class';
import { BlackNeckedStilt } from 'app/domain/entities/catalog/pets/golden/tier-2/black-necked-stilt.class';
import { Squid } from 'app/domain/entities/catalog/pets/golden/tier-2/squid.class';
import { SeaUrchin } from 'app/domain/entities/catalog/pets/golden/tier-2/sea-urchin.class';
import { DoorHeadAnt } from 'app/domain/entities/catalog/pets/golden/tier-2/door-head-ant.class';
import { Lizard } from 'app/domain/entities/catalog/pets/golden/tier-2/lizard.class';
import { SeaTurtle } from 'app/domain/entities/catalog/pets/golden/tier-2/sea-turtle.class';
import { AfricanPenguin } from 'app/domain/entities/catalog/pets/golden/tier-2/african-penguin.class';
import { Meerkat } from 'app/domain/entities/catalog/pets/golden/tier-2/meerkat.class';
import { MuskOx } from 'app/domain/entities/catalog/pets/golden/tier-3/musk-ox.class';
import { Flea } from 'app/domain/entities/catalog/pets/golden/tier-3/flea.class';
import { RoyalFlycatcher } from 'app/domain/entities/catalog/pets/golden/tier-3/royal-flycatcher.class';
import { SurgeonFish } from 'app/domain/entities/catalog/pets/golden/tier-3/surgeon-fish.class';
import { Weasel } from 'app/domain/entities/catalog/pets/golden/tier-3/weasel.class';
import { Guineafowl } from 'app/domain/entities/catalog/pets/golden/tier-3/guineafowl.class';
import { BettaFish } from 'app/domain/entities/catalog/pets/golden/tier-3/betta-fish.class';
import { FlyingFish } from 'app/domain/entities/catalog/pets/golden/tier-3/flying-fish.class';
import { Baboon } from 'app/domain/entities/catalog/pets/golden/tier-3/baboon.class';
import { Osprey } from 'app/domain/entities/catalog/pets/golden/tier-3/osprey.class';
import { Manatee } from 'app/domain/entities/catalog/pets/golden/tier-4/manatee.class';
import { Cuttlefish } from 'app/domain/entities/catalog/pets/golden/tier-4/cuttlefish.class';
import { EgyptianVulture } from 'app/domain/entities/catalog/pets/golden/tier-4/egyptian-vulture.class';
import { SaigaAntelope } from 'app/domain/entities/catalog/pets/golden/tier-4/saiga-antelope.class';
import { Sealion } from 'app/domain/entities/catalog/pets/golden/tier-4/sealion.class';
import { Vaquita } from 'app/domain/entities/catalog/pets/golden/tier-4/vaquita.class';
import { Slug } from 'app/domain/entities/catalog/pets/golden/tier-4/slug.class';
import { PoisonDartFrog } from 'app/domain/entities/catalog/pets/golden/tier-4/poison-dart-frog.class';
import { Falcon } from 'app/domain/entities/catalog/pets/golden/tier-4/falcon.class';
import { MantaRay } from 'app/domain/entities/catalog/pets/golden/tier-4/manta-ray.class';
import { Cockatoo } from 'app/domain/entities/catalog/pets/golden/tier-4/cockatoo.class';
import { SecretaryBird } from 'app/domain/entities/catalog/pets/golden/tier-5/secretary-bird.class';
import { Macaque } from 'app/domain/entities/catalog/pets/golden/tier-5/macaque.class';
import { Nyala } from 'app/domain/entities/catalog/pets/golden/tier-5/nyala.class';
import { NurseShark } from 'app/domain/entities/catalog/pets/golden/tier-5/nurse-shark.class';
import { BelugaWhale } from 'app/domain/entities/catalog/pets/golden/tier-5/beluga-whale.class';
import { Wolf } from 'app/domain/entities/catalog/pets/golden/tier-5/wolf.class';
import { FireAnt } from 'app/domain/entities/catalog/pets/golden/tier-5/fire-ant.class';
import { BlueRingedOctopus } from 'app/domain/entities/catalog/pets/golden/tier-5/blue-ringed-octopus.class';
import { Crane } from 'app/domain/entities/catalog/pets/golden/tier-5/crane.class';
import { Emu } from 'app/domain/entities/catalog/pets/golden/tier-5/emu.class';
import { Wildebeest } from 'app/domain/entities/catalog/pets/golden/tier-6/wildebeest.class';
import { HighlandCow } from 'app/domain/entities/catalog/pets/golden/tier-6/highland-cow.class';
import { Catfish } from 'app/domain/entities/catalog/pets/golden/tier-6/catfish.class';
import { Pteranodon } from 'app/domain/entities/catalog/pets/golden/tier-6/pteranodon.class';
import { Warthog } from 'app/domain/entities/catalog/pets/golden/tier-6/warthog.class';
import { Cobra } from 'app/domain/entities/catalog/pets/golden/tier-6/cobra.class';
import { GrizzlyBear } from 'app/domain/entities/catalog/pets/golden/tier-6/grizzly-bear.class';
import { GermanShepherd } from 'app/domain/entities/catalog/pets/golden/tier-6/german-shepherd.class';
import { BirdOfParadise } from 'app/domain/entities/catalog/pets/golden/tier-6/bird-of-paradise.class';
import { Oyster } from 'app/domain/entities/catalog/pets/golden/tier-6/oyster.class';

export const GOLDEN_PET_REGISTRY: PetRegistryMap = {
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




