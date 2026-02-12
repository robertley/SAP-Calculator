import { Equipment } from 'app/domain/entities/equipment.class';
import { Garlic } from 'app/domain/entities/catalog/equipment/turtle/garlic.class';
import { Cake } from 'app/domain/entities/catalog/equipment/turtle/cake.class';
import { MeatBone } from 'app/domain/entities/catalog/equipment/turtle/meat-bone.class';
import { Steak } from 'app/domain/entities/catalog/equipment/turtle/steak.class';
import { Melon } from 'app/domain/entities/catalog/equipment/turtle/melon.class';
import { Honey } from 'app/domain/entities/catalog/equipment/turtle/honey.class';
import { Chili } from 'app/domain/entities/catalog/equipment/turtle/chili.class';
import { Mushroom } from 'app/domain/entities/catalog/equipment/turtle/mushroom.class';
import { Coconut } from 'app/domain/entities/catalog/equipment/turtle/coconut.class';
import { Peanut } from 'app/domain/entities/catalog/equipment/turtle/peanut.class';
import { Blackberry } from 'app/domain/entities/catalog/equipment/puppy/blackberry.class';
import { Croissant } from 'app/domain/entities/catalog/equipment/puppy/croissant.class';
import { Rice } from 'app/domain/entities/catalog/equipment/puppy/rice.class';
import { Egg } from 'app/domain/entities/catalog/equipment/puppy/egg.class';
import { Eucalyptus } from 'app/domain/entities/catalog/equipment/puppy/eucalyptus.class';
import { Lime } from 'app/domain/entities/catalog/equipment/puppy/lime.class';
import { Squash } from 'app/domain/entities/catalog/equipment/puppy/squash.class';
import { Salt } from 'app/domain/entities/catalog/equipment/puppy/salt.class';
import { Pie } from 'app/domain/entities/catalog/equipment/puppy/pie.class';
import { Skewer } from 'app/domain/entities/catalog/equipment/puppy/skewer.class';
import { Lemon } from 'app/domain/entities/catalog/equipment/puppy/lemon.class';
import { Pancakes } from 'app/domain/entities/catalog/equipment/puppy/pancakes.class';
import { MildChili } from 'app/domain/entities/catalog/equipment/puppy/mild-chili.class';
import { Walnut } from 'app/domain/entities/catalog/equipment/puppy/walnut.class';
import { Strawberry } from 'app/domain/entities/catalog/equipment/star/strawberry.class';
import { Baguette } from 'app/domain/entities/catalog/equipment/star/baguette.class';
import { Cucumber } from 'app/domain/entities/catalog/equipment/star/cucumber.class';
import { Cheese } from 'app/domain/entities/catalog/equipment/star/cheese.class';
import { Grapes } from 'app/domain/entities/catalog/equipment/star/grapes.class';
import { Pepper } from 'app/domain/entities/catalog/equipment/star/pepper.class';
import { Carrot } from 'app/domain/entities/catalog/equipment/star/carrot.class';
import { Popcorn } from 'app/domain/entities/catalog/equipment/star/popcorn.class';
import { Seaweed } from 'app/domain/entities/catalog/equipment/star/seaweed.class';
import { Caramel } from 'app/domain/entities/catalog/equipment/star/caramel.class';
import { Cherry } from 'app/domain/entities/catalog/equipment/golden/cherry.class';
import { BokChoy } from 'app/domain/entities/catalog/equipment/golden/bok-choy.class';
import { ChocolateCake } from 'app/domain/entities/catalog/equipment/golden/chocolate-cake.class';
import { Eggplant } from 'app/domain/entities/catalog/equipment/golden/eggplant.class';
import { Potato } from 'app/domain/entities/catalog/equipment/golden/potato.class';
import { Banana } from 'app/domain/entities/catalog/equipment/golden/banana.class';
import { Onion } from 'app/domain/entities/catalog/equipment/golden/onion.class';
import { PitaBread } from 'app/domain/entities/catalog/equipment/golden/pita-bread.class';
import { Tomato } from 'app/domain/entities/catalog/equipment/golden/tomato.class';
import { Durian } from 'app/domain/entities/catalog/equipment/golden/durian.class';
import { Fig } from 'app/domain/entities/catalog/equipment/golden/fig.class';
import { HoneydewMelon } from 'app/domain/entities/catalog/equipment/golden/honeydew-melon.class';
import { MapleSyrup } from 'app/domain/entities/catalog/equipment/golden/maple-syrup.class';
import { CodRoe } from 'app/domain/entities/catalog/equipment/danger/cod-roe.class';
import { SudduthTomato } from 'app/domain/entities/catalog/equipment/danger/sudduth-tomato.class';
import { GrosMichelBanana } from 'app/domain/entities/catalog/equipment/danger/gros-michel-banana.class';
import { CocoaBean } from 'app/domain/entities/catalog/equipment/danger/cocoa-bean.class';
import { WhiteOkra } from 'app/domain/entities/catalog/equipment/danger/white-okra.class';
import { WhiteTruffle } from 'app/domain/entities/catalog/equipment/danger/white-truffle.class';
import { Unagi } from 'app/domain/entities/catalog/equipment/custom/unagi.class';
import { Corncob } from 'app/domain/entities/catalog/equipment/custom/corncob.class';
import { FortuneCookie } from 'app/domain/entities/catalog/equipment/custom/fortune-cookie.class';
import { Blueberry } from 'app/domain/entities/catalog/equipment/custom/blueberry.class';
import { Donut } from 'app/domain/entities/catalog/equipment/custom/donut.class';
import { CashewNut } from 'app/domain/entities/catalog/equipment/custom/cashew-nut.class';
import { Nachos } from 'app/domain/entities/catalog/equipment/custom/nachos.class';
import { Pumpkin } from 'app/domain/entities/catalog/equipment/custom/pumpkin.class';
import { Kiwifruit } from 'app/domain/entities/catalog/equipment/custom/kiwifruit.class';
import { Pineapple } from 'app/domain/entities/catalog/equipment/custom/pineapple.class';
import { Guava } from 'app/domain/entities/catalog/equipment/custom/guava.class';
import { BrusselsSprout } from 'app/domain/entities/catalog/equipment/custom/brussels-sprout.class';
import { Cauliflower } from 'app/domain/entities/catalog/equipment/custom/cauliflower.class';
import { Churros } from 'app/domain/entities/catalog/equipment/custom/churros.class';
import { Kiwano } from 'app/domain/entities/catalog/equipment/custom/kiwano.class';
import { Macaron } from 'app/domain/entities/catalog/equipment/custom/macaron.class';
import { MelonSlice } from 'app/domain/entities/catalog/equipment/custom/melon-slice.class';
import { OysterMushroom } from 'app/domain/entities/catalog/equipment/custom/oyster-mushroom.class';
import { Radish } from 'app/domain/entities/catalog/equipment/custom/radish.class';
import { SardinianCurrant } from 'app/domain/entities/catalog/equipment/custom/sardinian-currant.class';
import { Sausage } from 'app/domain/entities/catalog/equipment/custom/sausage.class';
import { Rambutan } from 'app/domain/entities/catalog/equipment/unicorn/rambutan.class';
import { LovePotion } from 'app/domain/entities/catalog/equipment/unicorn/love-potion.class';
import { FairyDust } from 'app/domain/entities/catalog/equipment/unicorn/fairy-dust.class';
import { GingerbreadMan } from 'app/domain/entities/catalog/equipment/unicorn/gingerbread-man.class';
import { EasterEgg } from 'app/domain/entities/catalog/equipment/unicorn/easter-egg.class';
import { HealthPotion } from 'app/domain/entities/catalog/equipment/unicorn/health-potion.class';
import { MagicBeans } from 'app/domain/entities/catalog/equipment/unicorn/magic-beans.class';
import { GoldenEgg } from 'app/domain/entities/catalog/equipment/unicorn/golden-egg.class';
import { YggdrasilFruit } from 'app/domain/entities/catalog/equipment/unicorn/yggdrasil-fruit.class';
import { Ambrosia } from 'app/domain/entities/catalog/equipment/unicorn/ambrosia.class';
import { FaintBread } from 'app/domain/entities/catalog/equipment/unicorn/faint-bread.class';
import { PeanutButter } from 'app/domain/entities/catalog/equipment/hidden/peanut-butter';
import { CakeSlice } from 'app/domain/entities/catalog/equipment/hidden/cake-slice.class';
import { Cold } from 'app/domain/entities/catalog/equipment/ailments/cold.class';
import { Icky } from 'app/domain/entities/catalog/equipment/ailments/icky.class';
import { Crisp } from 'app/domain/entities/catalog/equipment/ailments/crisp.class';
import { Dazed } from 'app/domain/entities/catalog/equipment/ailments/dazed.class';
import { Spooked } from 'app/domain/entities/catalog/equipment/ailments/spooked.class';
import { Weak } from 'app/domain/entities/catalog/equipment/ailments/weak.class';
import { Tasty } from 'app/domain/entities/catalog/equipment/ailments/tasty.class';
import { Silly } from 'app/domain/entities/catalog/equipment/ailments/silly.class';
import { Bloated } from 'app/domain/entities/catalog/equipment/ailments/bloated.class';
import { Confused } from 'app/domain/entities/catalog/equipment/ailments/confused.class';
import { Cursed } from 'app/domain/entities/catalog/equipment/ailments/cursed.class';
import { Inked } from 'app/domain/entities/catalog/equipment/ailments/inked.class';
import { Sad } from 'app/domain/entities/catalog/equipment/ailments/sad.class';
import { Sleepy } from 'app/domain/entities/catalog/equipment/ailments/sleepy.class';
import { Webbed } from 'app/domain/entities/catalog/equipment/ailments/webbed.class';
import { Toasty } from 'app/domain/entities/catalog/equipment/ailments/toasty.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { GameService } from 'app/runtime/state/game.service';
import { PetService } from '../pet/pet.service';

export interface EquipmentRegistryDeps {
  logService: LogService;
  abilityService: AbilityService;
  gameService: GameService;
  petService: PetService | null;
}

type NoArgEquipmentConstructor = new () => Equipment;
type LogOnlyEquipmentConstructor = new (logService: LogService) => Equipment;
type LogAbilityEquipmentConstructor = new (
  logService: LogService,
  abilityService: AbilityService,
) => Equipment;

// No-arg equipment
export const NO_ARG_EQUIPMENT: Record<string, NoArgEquipmentConstructor> = {
  Garlic: Garlic,
  'Meat Bone': MeatBone,
  Steak: Steak,
  Melon: Melon,
  Coconut: Coconut,
  Peanut: Peanut,
  'Peanut Butter': PeanutButter,
  'Cake Slice': CakeSlice,
  Blackberry: Blackberry,
  Croissant: Croissant,
  Rice: Rice,
  Eucalyptus: Eucalyptus,
  Lime: Lime,
  Salt: Salt,
  Lemon: Lemon,
  Cucumber: Cucumber,
  Cheese: Cheese,
  Grapes: Grapes,
  Pepper: Pepper,
  Carrot: Carrot,
  Cherry: Cherry,
  'Bok Choy': BokChoy,
  Potato: Potato,
  Unagi: Unagi,
  Corncob: Corncob,
  'Fortune Cookie': FortuneCookie,
  Blueberry: Blueberry,
  Donut: Donut,
  Pumpkin: Pumpkin,
  Kiwifruit: Kiwifruit,
  Pineapple: Pineapple,
  Guava: Guava,
  'Brussels Sprout': BrusselsSprout,
  Cauliflower: Cauliflower,
  Churros: Churros,
  Kiwano: Kiwano,
  Macaron: Macaron,
  'Melon Slice': MelonSlice,
  'Oyster Mushroom': OysterMushroom,
  'Sardinian Currant': SardinianCurrant,
  Sausage: Sausage,
  Walnut: Walnut,
  'Honeydew Melon': HoneydewMelon,
  'Maple Syrup': MapleSyrup,
  'White Okra': WhiteOkra,
  Ambrosia: Ambrosia,
  'Magic Beans': MagicBeans,
};

// LogService-only equipment
export const LOG_ONLY_EQUIPMENT: Record<string, LogOnlyEquipmentConstructor> = {
  Cake: Cake,
  Egg: Egg,
  Squash: Squash,
  Pie: Pie,
  Skewer: Skewer,
  Pancakes: Pancakes,
  Strawberry: Strawberry,
  Baguette: Baguette,
  Eggplant: Eggplant,
  Onion: Onion,
  'Pita Bread': PitaBread,
  Tomato: Tomato,
  Durian: Durian,
  'Sudduth Tomato': SudduthTomato,
  Fig: Fig,
  'Cashew Nut': CashewNut,
  Nachos: Nachos,
  Caramel: Caramel,
  Rambutan: Rambutan,
  'Love Potion': LovePotion,
  'Fairy Dust': FairyDust,
  'Gingerbread Man': GingerbreadMan,
  'Health Potion': HealthPotion,
  'Golden Egg': GoldenEgg,
  'White Truffle': WhiteTruffle,
};

// LogService + AbilityService equipment
export const LOG_ABILITY_EQUIPMENT: Record<
  string,
  LogAbilityEquipmentConstructor
> = {
  Honey: Honey,
  Chili: Chili,
  'Chocolate Cake': ChocolateCake,
  'Cod Roe': CodRoe,
  Banana: Banana,
  'Gros Michel Banana': GrosMichelBanana,
  'Easter Egg': EasterEgg,
  'Yggdrasil Fruit': YggdrasilFruit,
  'Mild Chili': MildChili,
};

// Ailments - mostly no args
export const NO_ARG_AILMENTS: Record<string, NoArgEquipmentConstructor> = {
  Cold: Cold,
  Crisp: Crisp,
  Dazed: Dazed,
  Icky: Icky,
  Inked: Inked,
  Toasty: Toasty,
  Spooked: Spooked,
  Weak: Weak,
  Silly: Silly,
  Bloated: Bloated,
  Confused: Confused,
  Cursed: Cursed,
  Sad: Sad,
  Sleepy: Sleepy,
  Webbed: Webbed,
};

export const SPECIAL_EQUIPMENT_BUILDERS: {
  [key: string]: (deps: EquipmentRegistryDeps) => Equipment;
} = {
  Mushroom: (deps) => new Mushroom(deps.logService, deps.petService),
  Popcorn: (deps) =>
    new Popcorn(deps.logService, deps.petService, deps.gameService),
  Seaweed: (deps) =>
    new Seaweed(deps.logService, deps.abilityService, deps.petService),
  'Cocoa Bean': (deps) => new CocoaBean(deps.logService, deps.petService),
  'Faint Bread': (deps) => new FaintBread(deps.logService, deps.petService),
  Radish: (deps) => new Radish(deps.logService),
};

export const SPECIAL_AILMENT_BUILDERS: {
  [key: string]: (deps: EquipmentRegistryDeps) => Equipment;
} = {
  Tasty: (deps) => new Tasty(deps.logService),
};


