import { Equipment } from "../classes/equipment.class";
import { Garlic } from "../classes/equipment/turtle/garlic.class";
import { Cake } from "../classes/equipment/turtle/cake.class";
import { MeatBone } from "../classes/equipment/turtle/meat-bone.class";
import { Steak } from "../classes/equipment/turtle/steak.class";
import { Melon } from "../classes/equipment/turtle/melon.class";
import { Honey } from "../classes/equipment/turtle/honey.class";
import { Chili } from "../classes/equipment/turtle/chili.class";
import { Mushroom } from "../classes/equipment/turtle/mushroom.class";
import { Coconut } from "../classes/equipment/turtle/coconut.class";
import { Peanut } from "../classes/equipment/turtle/peanut.class";
import { Blackberry } from "../classes/equipment/puppy/blackberry.class";
import { Croissant } from "../classes/equipment/puppy/croissant.class";
import { Rice } from "../classes/equipment/puppy/rice.class";
import { Egg } from "../classes/equipment/puppy/egg.class";
import { Eucalyptus } from "../classes/equipment/puppy/eucalyptus.class";
import { Lime } from "../classes/equipment/puppy/lime.class";
import { Squash } from "../classes/equipment/puppy/squash.class";
import { Salt } from "../classes/equipment/puppy/salt.class";
import { Pie } from "../classes/equipment/puppy/pie.class";
import { Skewer } from "../classes/equipment/puppy/skewer.class";
import { Lemon } from "../classes/equipment/puppy/lemon.class";
import { Pancakes } from "../classes/equipment/puppy/pancakes.class";
import { MildChili } from "../classes/equipment/puppy/mild-chili.class";
import { Walnut } from "../classes/equipment/puppy/walnut.class";
import { Strawberry } from "../classes/equipment/star/strawberry.class";
import { Baguette } from "../classes/equipment/star/baguette.class";
import { Cucumber } from "../classes/equipment/star/cucumber.class";
import { Cheese } from "../classes/equipment/star/cheese.class";
import { Grapes } from "../classes/equipment/star/grapes.class";
import { Pepper } from "../classes/equipment/star/pepper.class";
import { Carrot } from "../classes/equipment/star/carrot.class";
import { Popcorn } from "../classes/equipment/star/popcorn.class";
import { Seaweed } from "../classes/equipment/star/seaweed.class";
import { Caramel } from "../classes/equipment/star/caramel.class";
import { Cherry } from "../classes/equipment/golden/cherry.class";
import { BokChoy } from "../classes/equipment/golden/bok-choy.class";
import { ChocolateCake } from "../classes/equipment/golden/chocolate-cake.class";
import { Eggplant } from "../classes/equipment/golden/eggplant.class";
import { Potato } from "../classes/equipment/golden/potato.class";
import { Banana } from "../classes/equipment/golden/banana.class";
import { Onion } from "../classes/equipment/golden/onion.class";
import { PitaBread } from "../classes/equipment/golden/pita-bread.class";
import { Tomato } from "../classes/equipment/golden/tomato.class";
import { Durian } from "../classes/equipment/golden/durian.class";
import { Fig } from "../classes/equipment/golden/fig.class";
import { HoneydewMelon } from "../classes/equipment/golden/honeydew-melon.class";
import { MapleSyrup } from "../classes/equipment/golden/maple-syrup.class";
import { CodRoe } from "../classes/equipment/danger/cod-roe.class";
import { SudduthTomato } from "../classes/equipment/danger/sudduth-tomato.class";
import { GrosMichelBanana } from "../classes/equipment/danger/gros-michel-banana.class";
import { CocoaBean } from "../classes/equipment/danger/cocoa-bean.class";
import { WhiteOkra } from "../classes/equipment/danger/white-okra.class";
import { WhiteTruffle } from "../classes/equipment/danger/white-truffle.class";
import { Unagi } from "../classes/equipment/custom/unagi.class";
import { Corncob } from "../classes/equipment/custom/corncob.class";
import { FortuneCookie } from "../classes/equipment/custom/fortune-cookie.class";
import { Blueberry } from "../classes/equipment/custom/blueberry.class";
import { Donut } from "../classes/equipment/custom/donut.class";
import { CashewNut } from "../classes/equipment/custom/cashew-nut.class";
import { Nachos } from "../classes/equipment/custom/nachos.class";
import { Pumpkin } from "../classes/equipment/custom/pumpkin.class";
import { Kiwifruit } from "../classes/equipment/custom/kiwifruit.class";
import { Pineapple } from "../classes/equipment/custom/pineapple.class";
import { Guava } from "../classes/equipment/custom/guava.class";
import { BrusselsSprout } from "../classes/equipment/custom/brussels-sprout.class";
import { Cauliflower } from "../classes/equipment/custom/cauliflower.class";
import { Churros } from "../classes/equipment/custom/churros.class";
import { Kiwano } from "../classes/equipment/custom/kiwano.class";
import { Macaron } from "../classes/equipment/custom/macaron.class";
import { ManaPotion } from "../classes/equipment/custom/mana-potion.class";
import { MelonSlice } from "../classes/equipment/custom/melon-slice.class";
import { OysterMushroom } from "../classes/equipment/custom/oyster-mushroom.class";
import { Radish } from "../classes/equipment/custom/radish.class";
import { SardinianCurrant } from "../classes/equipment/custom/sardinian-currant.class";
import { Sausage } from "../classes/equipment/custom/sausage.class";
import { Rambutan } from "../classes/equipment/unicorn/rambutan.class";
import { LovePotion } from "../classes/equipment/unicorn/love-potion.class";
import { FairyDust } from "../classes/equipment/unicorn/fairy-dust.class";
import { GingerbreadMan } from "../classes/equipment/unicorn/gingerbread-man.class";
import { EasterEgg } from "../classes/equipment/unicorn/easter-egg.class";
import { HealthPotion } from "../classes/equipment/unicorn/health-potion.class";
import { MagicBeans } from "../classes/equipment/unicorn/magic-beans.class";
import { GoldenEgg } from "../classes/equipment/unicorn/golden-egg.class";
import { YggdrasilFruit } from "../classes/equipment/unicorn/yggdrasil-fruit.class";
import { Ambrosia } from "../classes/equipment/unicorn/ambrosia.class";
import { FaintBread } from "../classes/equipment/unicorn/faint-bread.class";
import { PeanutButter } from "../classes/equipment/hidden/peanut-butter";
import { CakeSlice } from "../classes/equipment/hidden/cake-slice.class";
import { Raspberry } from "../classes/equipment/custom/raspberry.class";
import { Cold } from "../classes/equipment/ailments/cold.class";
import { Icky } from "../classes/equipment/ailments/icky.class";
import { Crisp } from "../classes/equipment/ailments/crisp.class";
import { Dazed } from "../classes/equipment/ailments/dazed.class";
import { Spooked } from "../classes/equipment/ailments/spooked.class";
import { Weak } from "../classes/equipment/ailments/weak.class";
import { Tasty } from "../classes/equipment/ailments/tasty.class";
import { Silly } from "../classes/equipment/ailments/silly.class";
import { Bloated } from "../classes/equipment/ailments/bloated.class";
import { Confused } from "../classes/equipment/ailments/confused.class";
import { Cursed } from "../classes/equipment/ailments/cursed.class";
import { Inked } from "../classes/equipment/ailments/inked.class";
import { Sad } from "../classes/equipment/ailments/sad.class";
import { Sleepy } from "../classes/equipment/ailments/sleepy.class";
import { Webbed } from "../classes/equipment/ailments/webbed.class";
import { LogService } from "./log.service";
import { AbilityService } from "./ability.service";
import { GameService } from "./game.service";
import { PetService } from "./pet.service";

export interface EquipmentRegistryDeps {
    logService: LogService;
    abilityService: AbilityService;
    gameService: GameService;
    petService: PetService | null;
}

// No-arg equipment
export const NO_ARG_EQUIPMENT: { [key: string]: any } = {
    'Garlic': Garlic,
    'Cake': Cake,
    'Meat Bone': MeatBone,
    'Steak': Steak,
    'Melon': Melon,
    'Coconut': Coconut,
    'Peanut': Peanut,
    'Peanut Butter': PeanutButter,
    'Cake Slice': CakeSlice,
    'Blackberry': Blackberry,
    'Croissant': Croissant,
    'Rice': Rice,
    'Eucalyptus': Eucalyptus,
    'Lime': Lime,
    'Salt': Salt,
    'Lemon': Lemon,
    'Cucumber': Cucumber,
    'Cheese': Cheese,
    'Grapes': Grapes,
    'Pepper': Pepper,
    'Carrot': Carrot,
    'Cherry': Cherry,
    'Bok Choy': BokChoy,
    'Potato': Potato,
    'Unagi': Unagi,
    'Corncob': Corncob,
    'Fortune Cookie': FortuneCookie,
    'Blueberry': Blueberry,
    'Donut': Donut,
    'Pumpkin': Pumpkin,
    'Kiwifruit': Kiwifruit,
    'Pineapple': Pineapple,
    'Guava': Guava,
    'Brussels Sprout': BrusselsSprout,
    'Cauliflower': Cauliflower,
    'Churros': Churros,
    'Kiwano': Kiwano,
    'Macaron': Macaron,
    'Mana Potion': ManaPotion,
    'Melon Slice': MelonSlice,
    'Oyster Mushroom': OysterMushroom,
    'Radish': Radish,
    'Sardinian Currant': SardinianCurrant,
    'Sausage': Sausage,
    'Walnut': Walnut,
    'Raspberry': Raspberry,
    'Honeydew Melon': HoneydewMelon,
    'Maple Syrup': MapleSyrup,
    'White Okra': WhiteOkra,
    'Ambrosia': Ambrosia,
    'Magic Beans': MagicBeans
};

// LogService-only equipment
export const LOG_ONLY_EQUIPMENT: { [key: string]: any } = {
    'Egg': Egg,
    'Squash': Squash,
    'Pie': Pie,
    'Skewer': Skewer,
    'Pancakes': Pancakes,
    'Strawberry': Strawberry,
    'Baguette': Baguette,
    'Eggplant': Eggplant,
    'Onion': Onion,
    'Pita Bread': PitaBread,
    'Tomato': Tomato,
    'Durian': Durian,
    'Sudduth Tomato': SudduthTomato,
    'Fig': Fig,
    'Cashew Nut': CashewNut,
    'Nachos': Nachos,
    'Caramel': Caramel,
    'Rambutan': Rambutan,
    'Love Potion': LovePotion,
    'Fairy Dust': FairyDust,
    'Gingerbread Man': GingerbreadMan,
    'Health Potion': HealthPotion,
    'Golden Egg': GoldenEgg,
    'White Truffle': WhiteTruffle
};

// LogService + AbilityService equipment
export const LOG_ABILITY_EQUIPMENT: { [key: string]: any } = {
    'Honey': Honey,
    'Chili': Chili,
    'Chocolate Cake': ChocolateCake,
    'Cod Roe': CodRoe,
    'Banana': Banana,
    'Gros Michel Banana': GrosMichelBanana,
    'Easter Egg': EasterEgg,
    'Yggdrasil Fruit': YggdrasilFruit,
    'Mild Chili': MildChili
};

// Ailments - mostly no args
export const NO_ARG_AILMENTS: { [key: string]: any } = {
    'Cold': Cold,
    'Crisp': Crisp,
    'Dazed': Dazed,
    'Icky': Icky,
    'Inked': Inked,
    'Spooked': Spooked,
    'Weak': Weak,
    'Silly': Silly,
    'Bloated': Bloated,
    'Confused': Confused,
    'Cursed': Cursed,
    'Sad': Sad,
    'Sleepy': Sleepy,
    'Webbed': Webbed
};

export const SPECIAL_EQUIPMENT_BUILDERS: { [key: string]: (deps: EquipmentRegistryDeps) => Equipment } = {
    'Mushroom': (deps) => new Mushroom(deps.logService, deps.petService),
    'Popcorn': (deps) => new Popcorn(deps.logService, deps.petService, deps.gameService),
    'Seaweed': (deps) => new Seaweed(deps.logService, deps.abilityService, deps.petService),
    'Cocoa Bean': (deps) => new CocoaBean(deps.logService, deps.petService),
    'Faint Bread': (deps) => new FaintBread(deps.logService, deps.petService)
};

export const SPECIAL_AILMENT_BUILDERS: { [key: string]: (deps: EquipmentRegistryDeps) => Equipment } = {
    'Tasty': (deps) => new Tasty(deps.logService)
};
