import { PetRegistryMap } from '../pet-registry.types';
import { Baku } from 'app/domain/entities/catalog/pets/unicorn/tier-1/baku.class';
import { QuestionMarks } from 'app/domain/entities/catalog/pets/unicorn/tier-1/question-marks.class';
import { Barghest } from 'app/domain/entities/catalog/pets/unicorn/tier-1/barghest.class';
import { Tsuchinoko } from 'app/domain/entities/catalog/pets/unicorn/tier-1/tsuchinoko.class';
import { Murmel } from 'app/domain/entities/catalog/pets/unicorn/tier-1/murmel.class';
import { Alchemedes } from 'app/domain/entities/catalog/pets/unicorn/tier-1/alchemedes.class';
import { Pengobble } from 'app/domain/entities/catalog/pets/unicorn/tier-1/pengobble.class';
import { Bunyip } from 'app/domain/entities/catalog/pets/unicorn/tier-1/bunyip.class';
import { SneakyEgg } from 'app/domain/entities/catalog/pets/unicorn/tier-1/sneaky-egg.class';
import { CuddleToad } from 'app/domain/entities/catalog/pets/unicorn/tier-1/cuddle-toad.class';
import { GhostKitten } from 'app/domain/entities/catalog/pets/unicorn/tier-2/ghost-kitten.class';
import { FrostWolf } from 'app/domain/entities/catalog/pets/unicorn/tier-2/frost-wolf.class';
import { Mothman } from 'app/domain/entities/catalog/pets/unicorn/tier-2/mothman.class';
import { DropBear } from 'app/domain/entities/catalog/pets/unicorn/tier-2/drop-bear.class';
import { Jackalope } from 'app/domain/entities/catalog/pets/unicorn/tier-2/jackalope.class';
import { Ogopogo } from 'app/domain/entities/catalog/pets/unicorn/tier-2/ogopogo.class';
import { Thunderbird } from 'app/domain/entities/catalog/pets/unicorn/tier-2/thunderbird.class';
import { Gargoyle } from 'app/domain/entities/catalog/pets/unicorn/tier-2/gargoyle.class';
import { Bigfoot } from 'app/domain/entities/catalog/pets/unicorn/tier-2/bigfoot.class';
import { Wyvern } from 'app/domain/entities/catalog/pets/unicorn/tier-2/wyvern.class';
import { LuckyCat } from 'app/domain/entities/catalog/pets/unicorn/tier-3/lucky-cat.class';
import { SkeletonDog } from 'app/domain/entities/catalog/pets/unicorn/tier-3/skeleton-dog.class';
import { Mandrake } from 'app/domain/entities/catalog/pets/unicorn/tier-3/mandrake.class';
import { FurBearingTrout } from 'app/domain/entities/catalog/pets/unicorn/tier-3/fur-bearing-trout.class';
import { ManaHound } from 'app/domain/entities/catalog/pets/unicorn/tier-3/mana-hound.class';
import { Calygreyhound } from 'app/domain/entities/catalog/pets/unicorn/tier-3/calygreyhound.class';
import { BrainCramp } from 'app/domain/entities/catalog/pets/unicorn/tier-3/brain-cramp.class';
import { Ouroboros } from 'app/domain/entities/catalog/pets/unicorn/tier-3/ouroboros.class';
import { Griffin } from 'app/domain/entities/catalog/pets/unicorn/tier-3/griffin.class';
import { Tatzelwurm } from 'app/domain/entities/catalog/pets/unicorn/tier-3/tatzelwurm.class';
import { Minotaur } from 'app/domain/entities/catalog/pets/unicorn/tier-4/minotaur.class';
import { Kraken } from 'app/domain/entities/catalog/pets/unicorn/tier-4/kraken.class';
import { Visitor } from 'app/domain/entities/catalog/pets/unicorn/tier-4/visitor.class';
import { TigerBug } from 'app/domain/entities/catalog/pets/unicorn/tier-4/tiger-bug.class';
import { Cyclops } from 'app/domain/entities/catalog/pets/unicorn/tier-4/cyclops.class';
import { Chimera } from 'app/domain/entities/catalog/pets/unicorn/tier-4/chimera.class';
import { Roc } from 'app/domain/entities/catalog/pets/unicorn/tier-4/roc.class';
import { WormOfSand } from 'app/domain/entities/catalog/pets/unicorn/tier-4/worm-of-sand.class';
import { Abomination } from 'app/domain/entities/catalog/pets/unicorn/tier-4/abomination.class';
import { Unicorn } from 'app/domain/entities/catalog/pets/unicorn/tier-4/unicorn.class';
import { VampireBat } from 'app/domain/entities/catalog/pets/unicorn/tier-5/vampire-bat.class';
import { RedDragon } from 'app/domain/entities/catalog/pets/unicorn/tier-5/red-dragon.class';
import { LovelandFrogman } from 'app/domain/entities/catalog/pets/unicorn/tier-5/loveland-frogman.class';
import { SalmonOfKnowledge } from 'app/domain/entities/catalog/pets/unicorn/tier-5/salmon-of-knowledge.class';
import { JerseyDevil } from 'app/domain/entities/catalog/pets/unicorn/tier-5/jersey-devil.class';
import { Pixiu } from 'app/domain/entities/catalog/pets/unicorn/tier-5/pixiu.class';
import { Kitsune } from 'app/domain/entities/catalog/pets/unicorn/tier-5/kitsune.class';
import { Nessie } from 'app/domain/entities/catalog/pets/unicorn/tier-5/nessie.class';
import { BadDog } from 'app/domain/entities/catalog/pets/unicorn/tier-5/bad-dog.class';
import { Werewolf } from 'app/domain/entities/catalog/pets/unicorn/tier-5/werewolf.class';
import { Amalgamation } from 'app/domain/entities/catalog/pets/unicorn/tier-5/amalgamation.class';
import { Manticore } from 'app/domain/entities/catalog/pets/unicorn/tier-6/manticore.class';
import { Phoenix } from 'app/domain/entities/catalog/pets/unicorn/tier-6/phoenix.class';
import { Quetzalcoatl } from 'app/domain/entities/catalog/pets/unicorn/tier-6/quetzalcoatl.class';
import { TeamSpirit } from 'app/domain/entities/catalog/pets/unicorn/tier-6/team-spirit.class';
import { Sleipnir } from 'app/domain/entities/catalog/pets/unicorn/tier-6/sleipnir.class';
import { SeaSerpent } from 'app/domain/entities/catalog/pets/unicorn/tier-6/sea-serpent.class';
import { Yeti } from 'app/domain/entities/catalog/pets/unicorn/tier-6/yeti.class';
import { Cerberus } from 'app/domain/entities/catalog/pets/unicorn/tier-6/cerberus.class';
import { Hydra } from 'app/domain/entities/catalog/pets/unicorn/tier-6/hydra.class';
import { Behemoth } from 'app/domain/entities/catalog/pets/unicorn/tier-6/behemoth.class';

export const UNICORN_PET_REGISTRY: PetRegistryMap = {
  Baku: Baku,
  Barghest: Barghest,
  Tsuchinoko: Tsuchinoko,
  Murmel: Murmel,
  Alchemedes: Alchemedes,
  Pengobble: Pengobble,
  Bunyip: Bunyip,
  'Sneaky Egg': SneakyEgg,
  'Cuddle Toad': CuddleToad,
  '???': QuestionMarks,
  'Ghost Kitten': GhostKitten,
  'Frost Wolf': FrostWolf,
  Mothman: Mothman,
  'Drop Bear': DropBear,
  Jackalope: Jackalope,
  Ogopogo: Ogopogo,
  Thunderbird: Thunderbird,
  Gargoyle: Gargoyle,
  Bigfoot: Bigfoot,
  'Lucky Cat': LuckyCat,
  'Skeleton Dog': SkeletonDog,
  Mandrake: Mandrake,
  'Fur-Bearing Trout': FurBearingTrout,
  'Mana Hound': ManaHound,
  Calygreyhound: Calygreyhound,
  'Brain Cramp': BrainCramp,
  Minotaur: Minotaur,
  Wyvern: Wyvern,
  Ouroboros: Ouroboros,
  Griffin: Griffin,
  Kraken: Kraken,
  Visitor: Visitor,
  'Vampire Bat': VampireBat,
  'Tiger Bug': TigerBug,
  Tatzelwurm: Tatzelwurm,
  Cyclops: Cyclops,
  Chimera: Chimera,
  Roc: Roc,
  'Worm of Sand': WormOfSand,
  'Red Dragon': RedDragon,
  Unicorn: Unicorn,
  'Loveland Frogman': LovelandFrogman,
  'Salmon of Knowledge': SalmonOfKnowledge,
  'Jersey Devil': JerseyDevil,
  Pixiu: Pixiu,
  Kitsune: Kitsune,
  Nessie: Nessie,
  'Bad Dog': BadDog,
  Werewolf: Werewolf,
  Amalgamation: Amalgamation,
  Manticore: Manticore,
  Phoenix: Phoenix,
  Quetzalcoatl: Quetzalcoatl,
  'Team Spirit': TeamSpirit,
  Sleipnir: Sleipnir,
  'Sea Serpent': SeaSerpent,
  Yeti: Yeti,
  Cerberus: Cerberus,
  Hydra: Hydra,
  Behemoth: Behemoth,
  Abomination: Abomination,
};




