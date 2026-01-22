import { Pillbug } from '../../../classes/pets/star/tier-1/pillbug.class';
import { Cockroach } from '../../../classes/pets/star/tier-1/cockroach.class';
import { Frog } from '../../../classes/pets/star/tier-1/frog.class';
import { Hummingbird } from '../../../classes/pets/star/tier-1/hummingbird.class';
import { Marmoset } from '../../../classes/pets/star/tier-1/marmoset.class';
import { Pheasant } from '../../../classes/pets/star/tier-1/pheasant.class';
import { Kiwi } from '../../../classes/pets/star/tier-1/kiwi.class';
import { Chihuahua } from '../../../classes/pets/star/tier-1/chihuahua.class';
import { Firefly } from '../../../classes/pets/star/tier-1/firefly.class';
import { Iguana } from '../../../classes/pets/star/tier-2/iguana.class';
import { Koala } from '../../../classes/pets/star/tier-2/koala.class';
import { DumboOctopus } from '../../../classes/pets/star/tier-2/dumbo-octopus.class';
import { Salamander } from '../../../classes/pets/star/tier-2/salamander.class';
import { GuineaPig } from '../../../classes/pets/star/tier-2/guinea-pig.class';
import { Jellyfish } from '../../../classes/pets/star/tier-2/jellyfish.class';
import { Dove } from '../../../classes/pets/star/tier-2/dove.class';
import { Stork } from '../../../classes/pets/star/tier-2/stork.class';
import { ShimaEnaga } from '../../../classes/pets/star/tier-2/shima-enaga.class';
import { Bass } from '../../../classes/pets/star/tier-2/bass.class';
import { Pug } from '../../../classes/pets/star/tier-3/pug.class';
import { Cardinal } from '../../../classes/pets/star/tier-3/cardinal.class';
import { Leech } from '../../../classes/pets/star/tier-3/leech.class';
import { Tuna } from '../../../classes/pets/star/tier-3/tuna.class';
import { Toad } from '../../../classes/pets/star/tier-3/toad.class';
import { Capybara } from '../../../classes/pets/star/tier-3/capybara.class';
import { Okapi } from '../../../classes/pets/star/tier-3/okapi.class';
import { Cassowary } from '../../../classes/pets/star/tier-3/cassowary.class';
import { Anteater } from '../../../classes/pets/star/tier-3/anteater.class';
import { Orangutan } from '../../../classes/pets/star/tier-3/orangutan.class';
import { Clownfish } from '../../../classes/pets/star/tier-4/clownfish.class';
import { Siamese } from '../../../classes/pets/star/tier-4/siamese.class';
import { Elk } from '../../../classes/pets/star/tier-4/elk.class';
import { FairyArmadillo } from '../../../classes/pets/star/tier-4/fairy-armadillo.class';
import { Fossa } from '../../../classes/pets/star/tier-4/fossa.class';
import { Hawk } from '../../../classes/pets/star/tier-4/hawk.class';
import { Platypus } from '../../../classes/pets/star/tier-4/platypus.class';
import { PrayingMantis } from '../../../classes/pets/star/tier-4/praying-mantis.class';
import { Donkey } from '../../../classes/pets/star/tier-4/donkey.class';
import { Sparrow } from '../../../classes/pets/star/tier-4/sparrow.class';
import { Blobfish } from '../../../classes/pets/star/tier-5/blobfish.class';
import { Woodpecker } from '../../../classes/pets/star/tier-5/woodpecker.class';
import { Starfish } from '../../../classes/pets/star/tier-5/starfish.class';
import { Pelican } from '../../../classes/pets/star/tier-5/pelican.class';
import { SwordFish } from '../../../classes/pets/star/tier-5/sword-fish.class';
import { Triceratops } from '../../../classes/pets/star/tier-5/triceratops.class';
import { Hamster } from '../../../classes/pets/star/tier-5/hamster.class';
import { Shoebill } from '../../../classes/pets/star/tier-5/shoebill.class';
import { Vulture } from '../../../classes/pets/star/tier-5/vulture.class';
import { Ibex } from '../../../classes/pets/star/tier-5/ibex.class';
import { Ostrich } from '../../../classes/pets/star/tier-6/ostrich.class';
import { Reindeer } from '../../../classes/pets/star/tier-6/reindeer.class';
import { Piranha } from '../../../classes/pets/star/tier-6/piranha.class';
import { RealVelociraptor } from '../../../classes/pets/star/tier-6/real-velociraptor.class';
import { SabertoothTiger } from '../../../classes/pets/star/tier-6/sabertooth-tiger.class';
import { Orca } from '../../../classes/pets/star/tier-6/orca.class';
import { Spinosaurus } from '../../../classes/pets/star/tier-6/spinosaurus.class';
import { Alpaca } from '../../../classes/pets/star/tier-6/alpaca.class';
import { Velociraptor } from '../../../classes/pets/star/tier-6/velociraptor.class';
import { Ammonite } from '../../../classes/pets/star/tier-6/ammonite.class';

export const STAR_PET_REGISTRY: { [key: string]: any } = {
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
