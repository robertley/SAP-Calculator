import { Toy } from 'app/domain/entities/toy.class';
import { Player } from 'app/domain/entities/player.class';
import { LogService } from '../log.service';
import { AbilityService } from '../ability/ability.service';
import { EquipmentService } from '../equipment/equipment.service';
import { PetService } from '../pet/pet.service';
import type { ToyService } from './toy.service';
import { GameService } from 'app/runtime/state/game.service';
import { Balloon } from 'app/domain/entities/catalog/toys/tier-1/balloon.class';
import { TennisBall } from 'app/domain/entities/catalog/toys/tier-1/tennis-ball.class';
import { Stick } from 'app/domain/entities/catalog/toys/tier-1/stick.class';
import { ActionFigure } from 'app/domain/entities/catalog/toys/tier-1/action-figure.class';
import { ChocolateBox } from 'app/domain/entities/catalog/toys/tier-1/chocolate-box.class';
import { DiceCup } from 'app/domain/entities/catalog/toys/tier-1/dice-cup.class';
import { Handkerchief } from 'app/domain/entities/catalog/toys/tier-1/handkerchief.class';
import { Kite } from 'app/domain/entities/catalog/toys/tier-1/kite.class';
import { Lamp } from 'app/domain/entities/catalog/toys/tier-1/lamp.class';
import { Lunchbox } from 'app/domain/entities/catalog/toys/tier-1/lunchbox.class';
import { Onesie } from 'app/domain/entities/catalog/toys/tier-1/onesie.class';
import { PaperShredder } from 'app/domain/entities/catalog/toys/tier-1/paper-shredder.class';
import { Pen } from 'app/domain/entities/catalog/toys/tier-1/pen.class';
import { PillBottle } from 'app/domain/entities/catalog/toys/tier-1/pill-bottle.class';
import { PogoStick } from 'app/domain/entities/catalog/toys/tier-1/pogo-stick.class';
import { RemoteCar } from 'app/domain/entities/catalog/toys/tier-1/remote-car.class';
import { RingPyramid } from 'app/domain/entities/catalog/toys/tier-1/ring-pyramid.class';
import { RubberDuck } from 'app/domain/entities/catalog/toys/tier-1/rubber-duck.class';
import { Scale } from 'app/domain/entities/catalog/toys/tier-1/scale.class';
import { SoccerBall } from 'app/domain/entities/catalog/toys/tier-1/soccer-ball.class';
import { StickyHand } from 'app/domain/entities/catalog/toys/tier-1/sticky-hand.class';
import { StuffedBear } from 'app/domain/entities/catalog/toys/tier-1/stuffed-bear.class';
import { ToyMouse } from 'app/domain/entities/catalog/toys/tier-1/toy-mouse.class';
import { Radio } from 'app/domain/entities/catalog/toys/tier-2/radio.class';
import { PlasticSaw } from 'app/domain/entities/catalog/toys/tier-2/plastic-saw.class';
import { ToiletPaper } from 'app/domain/entities/catalog/toys/tier-3/toilet-paper.class';
import { OvenMitts } from 'app/domain/entities/catalog/toys/tier-3/oven-mitts.class';
import { MelonHelmet } from 'app/domain/entities/catalog/toys/tier-4/melon-helmet.class';
import { FoamSword } from 'app/domain/entities/catalog/toys/tier-4/foam-sword.class';
import { ToyGun } from 'app/domain/entities/catalog/toys/tier-4/toy-gun.class';
import { CashRegister } from 'app/domain/entities/catalog/toys/tier-4/cash-register.class';
import { Camera } from 'app/domain/entities/catalog/toys/tier-5/camera.class';
import { Flashlight } from 'app/domain/entities/catalog/toys/tier-5/flashlight.class';
import { StinkySock } from 'app/domain/entities/catalog/toys/tier-5/stinky-sock.class';
import { Television } from 'app/domain/entities/catalog/toys/tier-6/television.class';
import { PeanutJar } from 'app/domain/entities/catalog/toys/tier-6/peanut-jar.class';
import { AirPalmTree } from 'app/domain/entities/catalog/toys/tier-6/air-palm-tree.class';
import { PandorasBox } from 'app/domain/entities/catalog/toys/tier-5/pandoras-box.class';
import { WitchBroom } from 'app/domain/entities/catalog/toys/tier-1/witch-broom.class';
import { MagicWand } from 'app/domain/entities/catalog/toys/tier-1/magic-wand.class';
import { CrystalBall } from 'app/domain/entities/catalog/toys/tier-1/crystal-ball.class';
import { TreasureMap } from 'app/domain/entities/catalog/toys/tier-3/treasure-map.class';
import { TreasureChest } from 'app/domain/entities/catalog/toys/tier-3/treasure-chest.class';
import { EvilBook } from 'app/domain/entities/catalog/toys/tier-5/evil-book.class';
import { MagicCarpet } from 'app/domain/entities/catalog/toys/tier-2/magic-carpet.class';
import { MagicLamp } from 'app/domain/entities/catalog/toys/tier-2/magic-lamp.class';
import { Candelabra } from 'app/domain/entities/catalog/toys/tier-4/candelabra.class';
import { GlassShoes } from 'app/domain/entities/catalog/toys/tier-4/glass-shoes.class';
import { GoldenHarp } from 'app/domain/entities/catalog/toys/tier-4/golden-harp.class';
import { LockOfHair } from 'app/domain/entities/catalog/toys/tier-4/lock-of-hair.class';
import { MagicMirror } from 'app/domain/entities/catalog/toys/tier-4/magic-mirror.class';
import { Pickaxe } from 'app/domain/entities/catalog/toys/tier-4/pickaxe.class';
import { RedCape } from 'app/domain/entities/catalog/toys/tier-4/red-cape.class';
import { Rosebud } from 'app/domain/entities/catalog/toys/tier-4/rosebud.class';
import { Excalibur } from 'app/domain/entities/catalog/toys/tier-6/excalibur.class';
import { HolyGrail } from 'app/domain/entities/catalog/toys/tier-6/holy-grail.class';
import { Nutcracker } from 'app/domain/entities/catalog/toys/tier-4/nutcracker.class';
import { TinderBox } from 'app/domain/entities/catalog/toys/tier-4/tinder-box.class';
import { MicrowaveOven } from 'app/domain/entities/catalog/toys/tier-2/microwave-oven.class';

export type ToyRuntimeService = ToyService;

export interface ToyRegistryDeps {
  logService: LogService;
  abilityService: AbilityService;
  toyService: ToyRuntimeService;
  parent: Player;
  level: number;
  petService?: PetService;
  equipmentService?: EquipmentService;
  gameService?: GameService;
}

type StandardToyConstructor = new (
  logService: LogService,
  toyService: ToyRuntimeService,
  parent: Player,
  level: number,
) => Toy;

type AbilityServiceToyConstructor = new (
  logService: LogService,
  toyService: ToyRuntimeService,
  abilityService: AbilityService,
  parent: Player,
  level: number,
) => Toy;

// Standard toys (logService, toyService, parent, level)
export const STANDARD_TOYS: Record<string, StandardToyConstructor> = {
  'Action Figure': ActionFigure,
  Balloon: Balloon,
  'Chocolate Box': ChocolateBox,
  'Dice Cup': DiceCup,
  Handkerchief: Handkerchief,
  Kite: Kite,
  Lamp: Lamp,
  Lunchbox: Lunchbox,
  'Tennis Ball': TennisBall,
  Onesie: Onesie,
  'Paper Shredder': PaperShredder,
  Pen: Pen,
  'Pill Bottle': PillBottle,
  'Pogo Stick': PogoStick,
  'Remote Car': RemoteCar,
  'Ring Pyramid': RingPyramid,
  Scale: Scale,
  'Soccer Ball': SoccerBall,
  'Sticky Hand': StickyHand,
  Radio: Radio,
  'Plastic Saw': PlasticSaw,
  'Toilet Paper': ToiletPaper,
  'Oven Mitts': OvenMitts,
  'Melon Helmet': MelonHelmet,
  'Foam Sword': FoamSword,
  'Toy Gun': ToyGun,
  'Toy Mouse': ToyMouse,
  'Cash Register': CashRegister,
  Camera: Camera,
  Flashlight: Flashlight,
  'Stinky Sock': StinkySock,
  Television: Television,
  'Peanut Jar': PeanutJar,
  'Air Palm Tree': AirPalmTree,
  'Witch Broom': WitchBroom,
  'Magic Wand': MagicWand,
  'Crystal Ball': CrystalBall,
  'Treasure Map': TreasureMap,
  'Treasure Chest': TreasureChest,
  'Magic Carpet': MagicCarpet,
  'Magic Lamp': MagicLamp,
  Candelabra: Candelabra,
  'Glass Shoes': GlassShoes,
  'Golden Harp': GoldenHarp,
  'Lock of Hair': LockOfHair,
  'Magic Mirror': MagicMirror,
  Pickaxe: Pickaxe,
  'Red Cape': RedCape,
  Rosebud: Rosebud,
  Excalibur: Excalibur,
  'Holy Grail': HolyGrail,
};

// Toys needing AbilityService (logService, toyService, abilityService, parent, level)
export const TOYS_NEEDING_ABILITY_SERVICE: Record<
  string,
  AbilityServiceToyConstructor
> = {
  'Evil Book': EvilBook,
  Nutcracker: Nutcracker,
  'Tinder Box': TinderBox,
};

export const SPECIAL_TOY_BUILDERS: {
  [key: string]: (deps: ToyRegistryDeps) => Toy;
} = {
  'Rubber Duck': (deps) =>
    new RubberDuck(
      deps.logService,
      deps.toyService,
      deps.petService,
      deps.parent,
      deps.level,
    ),
  Stick: (deps) =>
    new Stick(
      deps.logService,
      deps.toyService,
      deps.parent,
      deps.level,
      deps.petService,
    ),
  'Stuffed Bear': (deps) =>
    new StuffedBear(
      deps.logService,
      deps.toyService,
      deps.petService,
      deps.parent,
      deps.level,
    ),
  'Pandoras Box': (deps) =>
    new PandorasBox(
      deps.logService,
      deps.toyService,
      deps.parent,
      deps.level,
      deps.equipmentService,
    ),
  'Microwave Oven': (deps) =>
    new MicrowaveOven(
      deps.logService,
      deps.toyService,
      deps.parent,
      deps.level,
      deps.petService,
      deps.gameService,
    ),
};





