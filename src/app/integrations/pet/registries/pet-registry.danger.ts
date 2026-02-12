import { PetRegistryMap } from '../pet-registry.types';
import { IriomoteCat } from 'app/domain/entities/catalog/pets/danger/tier-1/iriomote-cat.class';
import { IliPika } from 'app/domain/entities/catalog/pets/danger/tier-1/ili-pika.class';
import { MalayTapir } from 'app/domain/entities/catalog/pets/danger/tier-1/malay-tapir.class';
import { BombusDahlbomii } from 'app/domain/entities/catalog/pets/danger/tier-1/bombus-dahlbomii.class';
import { EthiopianWolf } from 'app/domain/entities/catalog/pets/danger/tier-1/ethiopian-wolf.class';
import { FanMussel } from 'app/domain/entities/catalog/pets/danger/tier-1/fan-mussel.class';
import { TogianBabirusa } from 'app/domain/entities/catalog/pets/danger/tier-1/togian-babirusa.class';
import { ToothBilledPigeon } from 'app/domain/entities/catalog/pets/danger/tier-1/tooth-billed-pigeon.class';
import { VolcanoSnail } from 'app/domain/entities/catalog/pets/danger/tier-1/volcano-snail.class';
import { AfricanWildDog } from 'app/domain/entities/catalog/pets/danger/tier-1/african-wild-dog.class';
import { AraripeManakin } from 'app/domain/entities/catalog/pets/danger/tier-2/araripe-manakin.class';
import { EuropeanMink } from 'app/domain/entities/catalog/pets/danger/tier-2/european-mink.class';
import { ProboscisMonkey } from 'app/domain/entities/catalog/pets/danger/tier-2/proboscis-monkey.class';
import { PygmyHog } from 'app/domain/entities/catalog/pets/danger/tier-2/pygmy-hog.class';
import { Saola } from 'app/domain/entities/catalog/pets/danger/tier-2/saola.class';
import { SakerFalcon } from 'app/domain/entities/catalog/pets/danger/tier-2/saker-falcon.class';
import { TaitaShrew } from 'app/domain/entities/catalog/pets/danger/tier-2/taita-shrew.class';
import { WhiteBelliedHeron } from 'app/domain/entities/catalog/pets/danger/tier-2/white-bellied-heron.class';
import { DarwinsFox } from 'app/domain/entities/catalog/pets/danger/tier-2/darwins-fox.class';
import { Takhi } from 'app/domain/entities/catalog/pets/danger/tier-2/takhi.class';
import { BlueThroatedMacaw } from 'app/domain/entities/catalog/pets/danger/tier-3/blue-throated-macaw.class';
import { Hirola } from 'app/domain/entities/catalog/pets/danger/tier-3/hirola.class';
import { MonkeyFacedBat } from 'app/domain/entities/catalog/pets/danger/tier-3/monkey-faced-bat.class';
import { PygmyHippo } from 'app/domain/entities/catalog/pets/danger/tier-3/pygmy-hippo.class';
import { Takin } from 'app/domain/entities/catalog/pets/danger/tier-3/takin.class';
import { Tucuxi } from 'app/domain/entities/catalog/pets/danger/tier-3/tucuxi.class';
import { RolowayMonkey } from 'app/domain/entities/catalog/pets/danger/tier-3/roloway-monkey.class';
import { SpoonBilledSandpiper } from 'app/domain/entities/catalog/pets/danger/tier-3/spoon-billed-sandpiper.class';
import { AmamiRabbit } from 'app/domain/entities/catalog/pets/danger/tier-3/amami-rabbit.class';
import { TreeKangaroo } from 'app/domain/entities/catalog/pets/danger/tier-3/tree-kangaroo.class';
import { Angelshark } from 'app/domain/entities/catalog/pets/danger/tier-4/angelshark.class';
import { Bonobo } from 'app/domain/entities/catalog/pets/danger/tier-4/bonobo.class';
import { GiantTortoise } from 'app/domain/entities/catalog/pets/danger/tier-4/giant-tortoise.class';
import { HumpheadWrasse } from 'app/domain/entities/catalog/pets/danger/tier-4/humphead-wrasse.class';
import { GoldenTamarin } from 'app/domain/entities/catalog/pets/danger/tier-4/golden-tamarin.class';
import { Kakapo } from 'app/domain/entities/catalog/pets/danger/tier-4/kakapo.class';
import { LongcombSawfish } from 'app/domain/entities/catalog/pets/danger/tier-4/longcomb-sawfish.class';
import { AmazonRiverDolphin } from 'app/domain/entities/catalog/pets/danger/tier-4/amazon-river-dolphin.class';
import { TasmanianDevil } from 'app/domain/entities/catalog/pets/danger/tier-4/tasmanian-devil.class';
import { GiantOtter } from 'app/domain/entities/catalog/pets/danger/tier-4/giant-otter.class';
import { AyeAye } from 'app/domain/entities/catalog/pets/danger/tier-5/aye-aye.class';
import { BanggaiCardinalfish } from 'app/domain/entities/catalog/pets/danger/tier-5/banggai-cardinalfish.class';
import { GeometricTortoise } from 'app/domain/entities/catalog/pets/danger/tier-5/geometric-tortoise.class';
import { GiantPangasius } from 'app/domain/entities/catalog/pets/danger/tier-5/giant-pangasius.class';
import { HawaiianMonkSeal } from 'app/domain/entities/catalog/pets/danger/tier-5/hawaiian-monk-seal.class';
import { MarineIguana } from 'app/domain/entities/catalog/pets/danger/tier-5/marine-iguana.class';
import { RedPanda } from 'app/domain/entities/catalog/pets/danger/tier-5/red-panda.class';
import { TaitaThrush } from 'app/domain/entities/catalog/pets/danger/tier-5/taita-thrush.class';
import { PaintedTerrapin } from 'app/domain/entities/catalog/pets/danger/tier-5/painted-terrapin.class';
import { SnowLeopard } from 'app/domain/entities/catalog/pets/danger/tier-5/snow-leopard.class';
import { AmsterdamAlbatross } from 'app/domain/entities/catalog/pets/danger/tier-6/amsterdam-albatross.class';
import { BayCat } from 'app/domain/entities/catalog/pets/danger/tier-6/bay-cat.class';
import { BlackRhino } from 'app/domain/entities/catalog/pets/danger/tier-6/black-rhino.class';
import { BlueWhale } from 'app/domain/entities/catalog/pets/danger/tier-6/blue-whale.class';
import { CaliforniaCondor } from 'app/domain/entities/catalog/pets/danger/tier-6/california-condor.class';
import { GreenSeaTurtle } from 'app/domain/entities/catalog/pets/danger/tier-6/green-sea-turtle.class';
import { HelmetedHornbill } from 'app/domain/entities/catalog/pets/danger/tier-6/helmeted-hornbill.class';
import { PhilippineEagle } from 'app/domain/entities/catalog/pets/danger/tier-6/philippine-eagle.class';
import { SilkySifaka } from 'app/domain/entities/catalog/pets/danger/tier-6/silky-sifaka.class';
import { SumatranTiger } from 'app/domain/entities/catalog/pets/danger/tier-6/sumatran-tiger.class';

export const DANGER_PET_REGISTRY: PetRegistryMap = {
  'Iriomote Cat': IriomoteCat,
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
  Saola: Saola,
  'Saker Falcon': SakerFalcon,
  'Taita Shrew': TaitaShrew,
  'White-Bellied Heron': WhiteBelliedHeron,
  "Darwin's Fox": DarwinsFox,
  'Amami Rabbit': AmamiRabbit,
  'Tree Kangaroo': TreeKangaroo,
  'Blue-Throated Macaw': BlueThroatedMacaw,
  Hirola: Hirola,
  'Monkey-Faced Bat': MonkeyFacedBat,
  Takin: Takin,
  Tucuxi: Tucuxi,
  'Pygmy Hippo': PygmyHippo,
  'Spoon-Billed Sandpiper': SpoonBilledSandpiper,
  Angelshark: Angelshark,
  'Giant Otter': GiantOtter,
  'Giant Tortoise': GiantTortoise,
  'Humphead Wrasse': HumpheadWrasse,
  Kakapo: Kakapo,
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
  'Bay Cat': BayCat,
  Bonobo: Bonobo,
  'California Condor': CaliforniaCondor,
  'Golden Tamarin': GoldenTamarin,
  'Roloway Monkey': RolowayMonkey,
  'Silky Sifaka': SilkySifaka,
  Takhi: Takhi,
};




