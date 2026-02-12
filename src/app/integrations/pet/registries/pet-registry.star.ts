import { PetRegistryMap } from '../pet-registry.types';
import { Pillbug } from 'app/domain/entities/catalog/pets/star/tier-1/pillbug.class';
import { Cockroach } from 'app/domain/entities/catalog/pets/star/tier-1/cockroach.class';
import { Frog } from 'app/domain/entities/catalog/pets/star/tier-1/frog.class';
import { Hummingbird } from 'app/domain/entities/catalog/pets/star/tier-1/hummingbird.class';
import { Marmoset } from 'app/domain/entities/catalog/pets/star/tier-1/marmoset.class';
import { Pheasant } from 'app/domain/entities/catalog/pets/star/tier-1/pheasant.class';
import { Kiwi } from 'app/domain/entities/catalog/pets/star/tier-1/kiwi.class';
import { Chihuahua } from 'app/domain/entities/catalog/pets/star/tier-1/chihuahua.class';
import { Firefly } from 'app/domain/entities/catalog/pets/star/tier-1/firefly.class';
import { Iguana } from 'app/domain/entities/catalog/pets/star/tier-2/iguana.class';
import { Koala } from 'app/domain/entities/catalog/pets/star/tier-2/koala.class';
import { DumboOctopus } from 'app/domain/entities/catalog/pets/star/tier-2/dumbo-octopus.class';
import { Salamander } from 'app/domain/entities/catalog/pets/star/tier-2/salamander.class';
import { GuineaPig } from 'app/domain/entities/catalog/pets/star/tier-2/guinea-pig.class';
import { Jellyfish } from 'app/domain/entities/catalog/pets/star/tier-2/jellyfish.class';
import { Dove } from 'app/domain/entities/catalog/pets/star/tier-2/dove.class';
import { Stork } from 'app/domain/entities/catalog/pets/star/tier-2/stork.class';
import { ShimaEnaga } from 'app/domain/entities/catalog/pets/star/tier-2/shima-enaga.class';
import { Bass } from 'app/domain/entities/catalog/pets/star/tier-2/bass.class';
import { Pug } from 'app/domain/entities/catalog/pets/star/tier-3/pug.class';
import { Cardinal } from 'app/domain/entities/catalog/pets/star/tier-3/cardinal.class';
import { Leech } from 'app/domain/entities/catalog/pets/star/tier-3/leech.class';
import { Tuna } from 'app/domain/entities/catalog/pets/star/tier-3/tuna.class';
import { Toad } from 'app/domain/entities/catalog/pets/star/tier-3/toad.class';
import { Capybara } from 'app/domain/entities/catalog/pets/star/tier-3/capybara.class';
import { Okapi } from 'app/domain/entities/catalog/pets/star/tier-3/okapi.class';
import { Cassowary } from 'app/domain/entities/catalog/pets/star/tier-3/cassowary.class';
import { Anteater } from 'app/domain/entities/catalog/pets/star/tier-3/anteater.class';
import { Orangutan } from 'app/domain/entities/catalog/pets/star/tier-3/orangutan.class';
import { Clownfish } from 'app/domain/entities/catalog/pets/star/tier-4/clownfish.class';
import { Siamese } from 'app/domain/entities/catalog/pets/star/tier-4/siamese.class';
import { Elk } from 'app/domain/entities/catalog/pets/star/tier-4/elk.class';
import { FairyArmadillo } from 'app/domain/entities/catalog/pets/star/tier-4/fairy-armadillo.class';
import { Fossa } from 'app/domain/entities/catalog/pets/star/tier-4/fossa.class';
import { Hawk } from 'app/domain/entities/catalog/pets/star/tier-4/hawk.class';
import { Platypus } from 'app/domain/entities/catalog/pets/star/tier-4/platypus.class';
import { PrayingMantis } from 'app/domain/entities/catalog/pets/star/tier-4/praying-mantis.class';
import { Donkey } from 'app/domain/entities/catalog/pets/star/tier-4/donkey.class';
import { Sparrow } from 'app/domain/entities/catalog/pets/star/tier-4/sparrow.class';
import { Blobfish } from 'app/domain/entities/catalog/pets/star/tier-5/blobfish.class';
import { Woodpecker } from 'app/domain/entities/catalog/pets/star/tier-5/woodpecker.class';
import { Starfish } from 'app/domain/entities/catalog/pets/star/tier-5/starfish.class';
import { Pelican } from 'app/domain/entities/catalog/pets/star/tier-5/pelican.class';
import { SwordFish } from 'app/domain/entities/catalog/pets/star/tier-5/sword-fish.class';
import { Triceratops } from 'app/domain/entities/catalog/pets/star/tier-5/triceratops.class';
import { Hamster } from 'app/domain/entities/catalog/pets/star/tier-5/hamster.class';
import { Shoebill } from 'app/domain/entities/catalog/pets/star/tier-5/shoebill.class';
import { Vulture } from 'app/domain/entities/catalog/pets/star/tier-5/vulture.class';
import { Ibex } from 'app/domain/entities/catalog/pets/star/tier-5/ibex.class';
import { Ostrich } from 'app/domain/entities/catalog/pets/star/tier-6/ostrich.class';
import { Reindeer } from 'app/domain/entities/catalog/pets/star/tier-6/reindeer.class';
import { Piranha } from 'app/domain/entities/catalog/pets/star/tier-6/piranha.class';
import { RealVelociraptor } from 'app/domain/entities/catalog/pets/star/tier-6/real-velociraptor.class';
import { SabertoothTiger } from 'app/domain/entities/catalog/pets/star/tier-6/sabertooth-tiger.class';
import { Orca } from 'app/domain/entities/catalog/pets/star/tier-6/orca.class';
import { Spinosaurus } from 'app/domain/entities/catalog/pets/star/tier-6/spinosaurus.class';
import { Alpaca } from 'app/domain/entities/catalog/pets/star/tier-6/alpaca.class';
import { Velociraptor } from 'app/domain/entities/catalog/pets/star/tier-6/velociraptor.class';
import { Ammonite } from 'app/domain/entities/catalog/pets/star/tier-6/ammonite.class';

export const STAR_PET_REGISTRY: PetRegistryMap = {
  Pillbug: Pillbug,
  Cockroach: Cockroach,
  Frog: Frog,
  Hummingbird: Hummingbird,
  Marmoset: Marmoset,
  Pheasant: Pheasant,
  Kiwi: Kiwi,
  Chihuahua: Chihuahua,
  Firefly: Firefly,
  Koala: Koala,
  Salamander: Salamander,
  'Guinea Pig': GuineaPig,
  Jellyfish: Jellyfish,
  Dove: Dove,
  'Dumbo Octopus': DumboOctopus,
  Bass: Bass,
  Leech: Leech,
  Woodpecker: Woodpecker,
  Toad: Toad,
  Starfish: Starfish,
  Clownfish: Clownfish,
  Blobfish: Blobfish,
  Capybara: Capybara,
  Okapi: Okapi,
  Cassowary: Cassowary,
  Anteater: Anteater,
  Orangutan: Orangutan,
  Hawk: Hawk,
  Platypus: Platypus,
  'Praying Mantis': PrayingMantis,
  Donkey: Donkey,
  'Fairy Armadillo': FairyArmadillo,
  Fossa: Fossa,
  Siamese: Siamese,
  Elk: Elk,
  Sparrow: Sparrow,
  Swordfish: SwordFish,
  Triceratops: Triceratops,
  Hamster: Hamster,
  Shoebill: Shoebill,
  Vulture: Vulture,
  Ibex: Ibex,
  Ostrich: Ostrich,
  Reindeer: Reindeer,
  Piranha: Piranha,
  'Real Velociraptor': RealVelociraptor,
  Spinosaurus: Spinosaurus,
  Alpaca: Alpaca,
  Velociraptor: Velociraptor,
  Ammonite: Ammonite,
  Cardinal: Cardinal,
  Orca: Orca,
  Pelican: Pelican,
  'Sabertooth Tiger': SabertoothTiger,
  'Shima Enaga': ShimaEnaga,
  Stork: Stork,
  Tuna: Tuna,
  Iguana: Iguana,
  Pug: Pug,
};




