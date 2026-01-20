import { IriomoteCat } from "../../../classes/pets/danger/tier-1/iriomote-cat.class";
import { IliPika } from "../../../classes/pets/danger/tier-1/ili-pika.class";
import { MalayTapir } from "../../../classes/pets/danger/tier-1/malay-tapir.class";
import { BombusDahlbomii } from "../../../classes/pets/danger/tier-1/bombus-dahlbomii.class";
import { EthiopianWolf } from "../../../classes/pets/danger/tier-1/ethiopian-wolf.class";
import { FanMussel } from "../../../classes/pets/danger/tier-1/fan-mussel.class";
import { TogianBabirusa } from "../../../classes/pets/danger/tier-1/togian-babirusa.class";
import { ToothBilledPigeon } from "../../../classes/pets/danger/tier-1/tooth-billed-pigeon.class";
import { VolcanoSnail } from "../../../classes/pets/danger/tier-1/volcano-snail.class";
import { AfricanWildDog } from "../../../classes/pets/danger/tier-1/african-wild-dog.class";
import { AraripeManakin } from "../../../classes/pets/danger/tier-2/araripe-manakin.class";
import { EuropeanMink } from "../../../classes/pets/danger/tier-2/european-mink.class";
import { ProboscisMonkey } from "../../../classes/pets/danger/tier-2/proboscis-monkey.class";
import { PygmyHog } from "../../../classes/pets/danger/tier-2/pygmy-hog.class";
import { Saola } from "../../../classes/pets/danger/tier-2/saola.class";
import { SakerFalcon } from "../../../classes/pets/danger/tier-2/saker-falcon.class";
import { TaitaShrew } from "../../../classes/pets/danger/tier-2/taita-shrew.class";
import { WhiteBelliedHeron } from "../../../classes/pets/danger/tier-2/white-bellied-heron.class";
import { DarwinsFox } from "../../../classes/pets/danger/tier-2/darwins-fox.class";
import { Takhi } from "../../../classes/pets/danger/tier-2/takhi.class";
import { BlueThroatedMacaw } from "../../../classes/pets/danger/tier-3/blue-throated-macaw.class";
import { Hirola } from "../../../classes/pets/danger/tier-3/hirola.class";
import { MonkeyFacedBat } from "../../../classes/pets/danger/tier-3/monkey-faced-bat.class";
import { PygmyHippo } from "../../../classes/pets/danger/tier-3/pygmy-hippo.class";
import { Takin } from "../../../classes/pets/danger/tier-3/takin.class";
import { Tucuxi } from "../../../classes/pets/danger/tier-3/tucuxi.class";
import { RolowayMonkey } from "../../../classes/pets/danger/tier-3/roloway-monkey.class";
import { SpoonBilledSandpiper } from "../../../classes/pets/danger/tier-3/spoon-billed-sandpiper.class";
import { AmamiRabbit } from "../../../classes/pets/danger/tier-3/amami-rabbit.class";
import { TreeKangaroo } from "../../../classes/pets/danger/tier-3/tree-kangaroo.class";
import { Angelshark } from "../../../classes/pets/danger/tier-4/angelshark.class";
import { Bonobo } from "../../../classes/pets/danger/tier-4/bonobo.class";
import { GiantTortoise } from "../../../classes/pets/danger/tier-4/giant-tortoise.class";
import { HumpheadWrasse } from "../../../classes/pets/danger/tier-4/humphead-wrasse.class";
import { GoldenTamarin } from "../../../classes/pets/danger/tier-4/golden-tamarin.class";
import { Kakapo } from "../../../classes/pets/danger/tier-4/kakapo.class";
import { LongcombSawfish } from "../../../classes/pets/danger/tier-4/longcomb-sawfish.class";
import { AmazonRiverDolphin } from "../../../classes/pets/danger/tier-4/amazon-river-dolphin.class";
import { TasmanianDevil } from "../../../classes/pets/danger/tier-4/tasmanian-devil.class";
import { GiantOtter } from "../../../classes/pets/danger/tier-4/giant-otter.class";
import { AyeAye } from "../../../classes/pets/danger/tier-5/aye-aye.class";
import { BanggaiCardinalfish } from "../../../classes/pets/danger/tier-5/banggai-cardinalfish.class";
import { GeometricTortoise } from "../../../classes/pets/danger/tier-5/geometric-tortoise.class";
import { GiantPangasius } from "../../../classes/pets/danger/tier-5/giant-pangasius.class";
import { HawaiianMonkSeal } from "../../../classes/pets/danger/tier-5/hawaiian-monk-seal.class";
import { MarineIguana } from "../../../classes/pets/danger/tier-5/marine-iguana.class";
import { RedPanda } from "../../../classes/pets/danger/tier-5/red-panda.class";
import { TaitaThrush } from "../../../classes/pets/danger/tier-5/taita-thrush.class";
import { PaintedTerrapin } from "../../../classes/pets/danger/tier-5/painted-terrapin.class";
import { SnowLeopard } from "../../../classes/pets/danger/tier-5/snow-leopard.class";
import { AmsterdamAlbatross } from "../../../classes/pets/danger/tier-6/amsterdam-albatross.class";
import { BayCat } from "../../../classes/pets/danger/tier-6/bay-cat.class";
import { BlackRhino } from "../../../classes/pets/danger/tier-6/black-rhino.class";
import { BlueWhale } from "../../../classes/pets/danger/tier-6/blue-whale.class";
import { CaliforniaCondor } from "../../../classes/pets/danger/tier-6/california-condor.class";
import { GreenSeaTurtle } from "../../../classes/pets/danger/tier-6/green-sea-turtle.class";
import { HelmetedHornbill } from "../../../classes/pets/danger/tier-6/helmeted-hornbill.class";
import { PhilippineEagle } from "../../../classes/pets/danger/tier-6/philippine-eagle.class";
import { SilkySifaka } from "../../../classes/pets/danger/tier-6/silky-sifaka.class";
import { SumatranTiger } from "../../../classes/pets/danger/tier-6/sumatran-tiger.class";

export const DANGER_PET_REGISTRY: { [key: string]: any } = {
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
  'Saola': Saola,
  'Saker Falcon': SakerFalcon,
  'Taita Shrew': TaitaShrew,
  'White-Bellied Heron': WhiteBelliedHeron,
  'Darwin\'s Fox': DarwinsFox,
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
  'Bay Cat': BayCat,
  'Bonobo': Bonobo,
  'California Condor': CaliforniaCondor,
  'Golden Tamarin': GoldenTamarin,
  'Roloway Monkey': RolowayMonkey,
  'Silky Sifaka': SilkySifaka,
  'Takhi': Takhi
};
