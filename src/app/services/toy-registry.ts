import { Toy } from "../classes/toy.class";
import { Player } from "../classes/player.class";
import { LogService } from "./log.service";
import { AbilityService } from "./ability.service";
import { EquipmentService } from "./equipment.service";
import { PetService } from "./pet.service";
import { GameService } from "./game.service";
import { Balloon } from "../classes/toys/tier-1/balloon.class";
import { TennisBall } from "../classes/toys/tier-1/tennis-ball.class";
import { Stick } from "../classes/toys/tier-1/stick.class";
import { Radio } from "../classes/toys/tier-2/radio.class";
import { PlasticSaw } from "../classes/toys/tier-2/plastic-saw.class";
import { ToiletPaper } from "../classes/toys/tier-3/toilet-paper.class";
import { OvenMitts } from "../classes/toys/tier-3/oven-mitts.class";
import { MelonHelmet } from "../classes/toys/tier-4/melon-helmet.class";
import { FoamSword } from "../classes/toys/tier-4/foam-sword.class";
import { ToyGun } from "../classes/toys/tier-4/toy-gun.class";
import { CashRegister } from "../classes/toys/tier-4/cash-register.class";
import { Camera } from "../classes/toys/tier-5/camera.class";
import { Flashlight } from "../classes/toys/tier-5/flashlight.class";
import { StinkySock } from "../classes/toys/tier-5/stinky-sock.class";
import { Television } from "../classes/toys/tier-6/television.class";
import { PeanutJar } from "../classes/toys/tier-6/peanut-jar.class";
import { AirPalmTree } from "../classes/toys/tier-6/air-palm-tree.class";
import { PandorasBox } from "../classes/toys/unicorn/pandoras-box.class";
import { WitchBroom } from "../classes/toys/unicorn/witch-broom.class";
import { MagicWand } from "../classes/toys/unicorn/magic-wand.class";
import { CrystalBall } from "../classes/toys/unicorn/crystal-ball.class";
import { TreasureMap } from "../classes/toys/unicorn/treasure-map.class";
import { TreasureChest } from "../classes/toys/unicorn/treasure-chest.class";
import { EvilBook } from "../classes/toys/unicorn/evil-book.class";
import { MagicCarpet } from "../classes/toys/unicorn/magic-carpet.class";
import { MagicLamp } from "../classes/toys/unicorn/magic-lamp.class";
import { Candelabra } from "../classes/toys/unicorn/candelabra.class";
import { GlassShoes } from "../classes/toys/unicorn/glass-shoes.class";
import { GoldenHarp } from "../classes/toys/unicorn/golden-harp.class";
import { LockOfHair } from "../classes/toys/unicorn/lock-of-hair.class";
import { MagicMirror } from "../classes/toys/unicorn/magic-mirror.class";
import { Pickaxe } from "../classes/toys/unicorn/pickaxe.class";
import { RedCape } from "../classes/toys/unicorn/red-cape.class";
import { Rosebud } from "../classes/toys/unicorn/rosebud.class";
import { Excalibur } from "../classes/toys/unicorn/excalibur.class";
import { HolyGrail } from "../classes/toys/unicorn/holy-grail.class";
import { Nutcracker } from "../classes/toys/unicorn/nutcraker.class";
import { TinderBox } from "../classes/toys/unicorn/tinder-box.class";
import { MicrowaveOven } from "../classes/toys/f2p/microwave-oven.class";

export interface ToyRegistryDeps {
    logService: LogService;
    abilityService: AbilityService;
    toyService: any;
    parent: Player;
    level: number;
    petService?: PetService;
    equipmentService?: EquipmentService;
    gameService?: GameService;
}

// Standard toys (logService, toyService, parent, level)
export const STANDARD_TOYS: { [key: string]: any } = {
    'Balloon': Balloon,
    'Tennis Ball': TennisBall,
    'Radio': Radio,
    'Plastic Saw': PlasticSaw,
    'Toilet Paper': ToiletPaper,
    'Oven Mitts': OvenMitts,
    'Melon Helmet': MelonHelmet,
    'Foam Sword': FoamSword,
    'Toy Gun': ToyGun,
    'Cash Register': CashRegister,
    'Camera': Camera,
    'Flashlight': Flashlight,
    'Stinky Sock': StinkySock,
    'Television': Television,
    'Peanut Jar': PeanutJar,
    'Air Palm Tree': AirPalmTree,
    'Witch Broom': WitchBroom,
    'Magic Wand': MagicWand,
    'Crystal Ball': CrystalBall,
    'Treasure Map': TreasureMap,
    'Treasure Chest': TreasureChest,
    'Magic Carpet': MagicCarpet,
    'Magic Lamp': MagicLamp,
    'Candelabra': Candelabra,
    'Glass Shoes': GlassShoes,
    'Golden Harp': GoldenHarp,
    'Lock of Hair': LockOfHair,
    'Magic Mirror': MagicMirror,
    'Pickaxe': Pickaxe,
    'Red Cape': RedCape,
    'Rose Bud': Rosebud,
    'Excalibur': Excalibur,
    'Holy Grail': HolyGrail
};

// Toys needing AbilityService (logService, toyService, abilityService, parent, level)
export const TOYS_NEEDING_ABILITY_SERVICE: { [key: string]: any } = {
    'Evil Book': EvilBook,
    'Nutcracker': Nutcracker,
    'Tinder Box': TinderBox
};

export const SPECIAL_TOY_BUILDERS: { [key: string]: (deps: ToyRegistryDeps) => Toy } = {
    'Stick': (deps) => new Stick(deps.logService, deps.toyService, deps.parent, deps.level, deps.petService),
    'Pandoras Box': (deps) => new PandorasBox(deps.logService, deps.toyService, deps.parent, deps.level, deps.equipmentService),
    'Microwave Oven': (deps) => new MicrowaveOven(deps.logService, deps.toyService, deps.parent, deps.level, deps.petService, deps.gameService)
};
