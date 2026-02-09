import { AbilityService } from 'app/integrations/ability/ability.service';
import { LogService } from 'app/integrations/log.service';
import { ToyService } from 'app/integrations/toy/toy.service';
import { EquipmentService } from 'app/integrations/equipment/equipment.service';
import { Equipment } from '../../../../equipment.class';
import { Pack, Pet } from '../../../../pet.class';
import { Player } from '../../../../player.class';
import { Ability, AbilityContext } from 'app/domain/entities/ability.class';
import { TennisBallAbility } from 'app/domain/entities/catalog/toys/tier-1/tennis-ball.class';
import { BalloonAbility } from 'app/domain/entities/catalog/toys/tier-1/balloon.class';
import { PlasticSawAbility } from 'app/domain/entities/catalog/toys/tier-2/plastic-saw.class';
import { RadioAbility } from 'app/domain/entities/catalog/toys/tier-2/radio.class';
import { OvenMittsAbility } from 'app/domain/entities/catalog/toys/tier-3/oven-mitts.class';
import { ToiletPaperAbility } from 'app/domain/entities/catalog/toys/tier-3/toilet-paper.class';
import { FoamSwordAbility } from 'app/domain/entities/catalog/toys/tier-4/foam-sword.class';
import { ToyGunAbility } from 'app/domain/entities/catalog/toys/tier-4/toy-gun.class';
import { MelonHelmetAbility } from 'app/domain/entities/catalog/toys/tier-4/melon-helmet.class';
import { StinkySockAbility } from 'app/domain/entities/catalog/toys/tier-5/stinky-sock.class';
import { FlashlightAbility } from 'app/domain/entities/catalog/toys/tier-5/flashlight.class';
import { PeanutJarAbility } from 'app/domain/entities/catalog/toys/tier-6/peanut-jar.class';
import { AirPalmTreeAbility } from 'app/domain/entities/catalog/toys/tier-6/air-palm-tree.class';
import { TelevisionAbility } from 'app/domain/entities/catalog/toys/tier-6/television.class';
import { CrystalBallAbility } from 'app/domain/entities/catalog/toys/tier-1/crystal-ball.class';
import { EvilBookAbility } from 'app/domain/entities/catalog/toys/tier-5/evil-book.class';
import { TreasureChestAbility } from 'app/domain/entities/catalog/toys/tier-3/treasure-chest.class';
import { WitchBroomAbility } from 'app/domain/entities/catalog/toys/tier-1/witch-broom.class';
import { TreasureMapAbility } from 'app/domain/entities/catalog/toys/tier-3/treasure-map.class';
import { PandorasBoxAbility } from 'app/domain/entities/catalog/toys/tier-5/pandoras-box.class';
import { StickAbility } from 'app/domain/entities/catalog/toys/tier-1/stick.class';
import { CashRegisterAbility } from 'app/domain/entities/catalog/toys/tier-4/cash-register.class';
import { MicrowaveOvenAbility } from 'app/domain/entities/catalog/toys/tier-2/microwave-oven.class';
import { CameraAbility } from 'app/domain/entities/catalog/toys/tier-5/camera.class';


export class Chameleon extends Pet {
  name = 'Chameleon';
  tier = 4;
  pack: Pack = 'Puppy';
  attack = 3;
  health = 5;

  private toyService: ToyService;
  private equipmentService: EquipmentService;

  initAbilities(): void {
    this.addAbility(
      new ChameleonAbility(
        this,
        this.logService,
        this.abilityService,
        this.equipmentService,
      ),
    );
    super.initAbilities();
  }

  constructor(
    protected logService: LogService,
    protected abilityService: AbilityService,
    parent: Player,
    health?: number,
    attack?: number,
    mana?: number,
    exp?: number,
    equipment?: Equipment,
    triggersConsumed?: number,
    toyService?: ToyService,
    equipmentService?: EquipmentService,
  ) {
    super(logService, abilityService, parent);
    this.toyService = toyService;
    this.equipmentService = equipmentService;
    this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
  }
}


// Import all toy ability classes
export class ChameleonAbility extends Ability {
  private logService: LogService;
  private abilityService: AbilityService;
  private equipmentService: EquipmentService;

  constructor(
    owner: Pet,
    logService: LogService,
    abilityService: AbilityService,
    equipmentService: EquipmentService,
  ) {
    super({
      name: 'ChameleonAbility',
      owner: owner,
      triggers: ['SpecialEndTurn'],
      abilityType: 'Pet',
      native: true,
      abilitylevel: owner.level,
      condition: (context: AbilityContext) => {
        const { triggerPet, tiger, pteranodon } = context;
        const owner = this.owner;
        return owner.parent.toy != null;
      },
      abilityFunction: (context) => {
        this.executeAbility(context);
      },
    });
    this.logService = logService;
    this.abilityService = abilityService;
    this.equipmentService = equipmentService;
  }

  private executeAbility(context: AbilityContext): void {
    const { gameApi, triggerPet, tiger, pteranodon } = context;
    const owner = this.owner;
    owner.removeAbility(this.name, 'Pet');
    this.addToyAbility(owner.parent.toy.name);
  }
  private addToyAbility(toyName: string): void {
    let owner = this.owner;
    const toyAbilityMap: { [key: string]: any } = {
      'Tennis Ball': () => new TennisBallAbility(owner, this.logService),
      Balloon: () => new BalloonAbility(owner, this.logService),
      'Plastic Saw': () => new PlasticSawAbility(owner, this.logService),
      Radio: () => new RadioAbility(owner, this.logService),
      'Oven Mitts': () => new OvenMittsAbility(owner, this.logService),
      'Toilet Paper': () => new ToiletPaperAbility(owner, this.logService),
      'Foam Sword': () => new FoamSwordAbility(owner, this.logService),
      'Toy Gun': () => new ToyGunAbility(owner, this.logService),
      'Melon Helmet': () => new MelonHelmetAbility(owner, this.logService),
      'Stinky Sock': () => new StinkySockAbility(owner, this.logService),
      Flashlight: () => new FlashlightAbility(owner, this.logService),
      'Peanut Jar': () => new PeanutJarAbility(owner, this.logService),
      'Air Palm Tree': () => new AirPalmTreeAbility(owner, this.logService),
      Television: () => new TelevisionAbility(owner, this.logService),
      'Crystal Ball': () => new CrystalBallAbility(owner, this.logService),
      //'Candelabra': () => new CandelabraAbility(owner, this.logService, this.abilityService),
      //'Excalibur': () => new ExcaliburAbility(owner, this.logService, this.abilityService),
      'Evil Book': () =>
        new EvilBookAbility(owner, this.logService, this.abilityService),
      //'Glass Shoes': () => new GlassShoesAbility(owner, this.logService, this.abilityService),
      //'Holy Grail': () => new HolyGrailAbility(owner, this.logService, this.abilityService),
      //'Golden Harp': () => new GoldenHarpAbility(owner, this.logService, this.abilityService),
      //'Lock of Hair': () => new LockOfHairAbility(owner, this.logService, this.abilityService),
      //'Magic Lamp': () => new MagicLampAbility(owner, this.logService, this.abilityService),
      //'Magic Carpet': () => new MagicCarpetAbility(owner, this.logService, this.abilityService),
      //'Magic Wand': () => new MagicWandAbility(owner, this.logService, this.abilityService),
      //'Magic Mirror': () => new MagicMirrorAbility(owner, this.logService, this.abilityService),
      //'Nutcracker': () => new NutcrackerAbility(owner, this.logService, this.abilityService),
      //'Pickaxe': () => new PickaxeAbility(owner, this.logService, this.abilityService),
      //'Rosebud': () => new RosebudAbility(owner, this.logService, this.abilityService),
      //'Red Cape': () => new RedCapeAbility(owner, this.logService, this.abilityService),
      'Treasure Chest': () => new TreasureChestAbility(owner, this.logService),
      // 'Tinder Box': () => new TinderBoxAbility(owner, this.logService, this.abilityService),
      'Witch Broom': () => new WitchBroomAbility(owner, this.logService),
      'Treasure Map': () => new TreasureMapAbility(owner, this.logService),
      'Pandoras Box': () =>
        new PandorasBoxAbility(
          owner,
          this.logService,
          this.abilityService,
          this.equipmentService,
        ),
      Stick: () => new StickAbility(owner, this.logService),
      'Cash Register': () => new CashRegisterAbility(owner, this.logService),
      'Microwave Oven': () =>
        new MicrowaveOvenAbility(owner, this.logService, this.equipmentService),
      Camera: () => new CameraAbility(owner, this.logService),
    };

    const abilityFactory = toyAbilityMap[toyName];
    if (abilityFactory) {
      try {
        const toyAbility = abilityFactory();
        toyAbility.abilityLevel = Math.min(owner.parent.toy.level, this.level);
        toyAbility.alwaysIgnorePetLevel = true;
        owner.addAbility(toyAbility);
        this.logService.createLog({
          message: `${this.name} gained ${toyName} ability!`,
          type: 'ability',
          player: owner.parent,
        });
      } catch (error) {
        console.warn(
          `Failed to add ${toyName} ability to ${this.name}:`,
          error,
        );
      }
    } else {
      this.logService.createLog({
        message: `Custom toy ability is currently not supported for Chameleon ability`,
        type: 'ability',
        player: owner.parent,
      });
    }
  }

  copy(newOwner: Pet): ChameleonAbility {
    return new ChameleonAbility(
      newOwner,
      this.logService,
      this.abilityService,
      this.equipmentService,
    );
  }
}






