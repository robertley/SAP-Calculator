import { Ability, AbilityContext } from "../../../../ability.class";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { AbilityService } from "app/services/ability.service";
import { EquipmentService } from "app/services/equipment.service";

// Import all toy ability classes
import { TennisBallAbility } from "../../../../abilities/pets/toys/tennis-ball-ability.class";
import { BalloonAbility } from "../../../../abilities/pets/toys/balloon-ability.class";
import { PlasticSawAbility } from "../../../../abilities/pets/toys/plastic-saw-ability.class";
import { RadioAbility } from "../../../../abilities/pets/toys/radio-ability.class";
import { OvenMittsAbility } from "../../../../abilities/pets/toys/oven-mitts-ability.class";
import { ToiletPaperAbility } from "../../../../abilities/pets/toys/toilet-paper-ability.class";
import { FoamSwordAbility } from "../../../../abilities/pets/toys/foam-sword-ability.class";
import { ToyGunAbility } from "../../../../abilities/pets/toys/toy-gun-ability.class";
import { MelonHelmetAbility } from "../../../../abilities/pets/toys/melon-helmet-ability.class";
import { StinkySockAbility } from "../../../../abilities/pets/toys/stinky-sock-ability.class";
import { FlashlightAbility } from "../../../../abilities/pets/toys/flashlight-ability.class";
import { PeanutJarAbility } from "../../../../abilities/pets/toys/peanut-jar-ability.class";
import { AirPalmTreeAbility } from "../../../../abilities/pets/toys/air-palm-tree-ability.class";
import { TelevisionAbility } from "../../../../abilities/pets/toys/television-ability.class";
import { CrystalBallAbility } from "../../../../abilities/pets/toys/crystal-ball-ability.class";
import { EvilBookAbility } from "../../../../abilities/pets/toys/evil-book-ability.class";
import { GoldenHarpAbility } from "../../../../abilities/pets/toys/golden-harp-ability.class";
import { LockOfHairAbility } from "../../../../abilities/pets/toys/lock-of-hair-ability.class";
import { MagicLampAbility } from "../../../../abilities/pets/toys/magic-lamp-ability.class";
import { MagicCarpetAbility } from "../../../../abilities/pets/toys/magic-carpet-ability.class";
import { MagicWandAbility } from "../../../../abilities/pets/toys/magic-wand-ability.class";
import { MagicMirrorAbility } from "../../../../abilities/pets/toys/magic-mirror-ability.class";
import { NutcrackerAbility } from "../../../../abilities/pets/toys/nutcraker-ability.class";
import { PickaxeAbility } from "../../../../abilities/pets/toys/pickaxe-ability.class";
import { TreasureChestAbility } from "../../../../abilities/pets/toys/treasure-chest-ability.class";
import { TinderBoxAbility } from "../../../../abilities/pets/toys/tinder-box-ability.class";
import { WitchBroomAbility } from "../../../../abilities/pets/toys/witch-broom-ability.class";
import { TreasureMapAbility } from "../../../../abilities/pets/toys/treasure-map-ability.class";
import { PandorasBoxAbility } from "../../../../abilities/pets/toys/pandoras-box-ability.class";
import { StickAbility } from "../../../../abilities/pets/toys/stick-ability.class";
import { CashRegisterAbility } from "../../../../abilities/pets/toys/cash-register-ability.class";
import { MicrowaveOvenAbility } from "../../../../abilities/pets/toys/microwave-oven-ability.class";
import { CameraAbility } from "../../../../abilities/pets/toys/camera-ability.class";
export class ChameleonAbility extends Ability {
    private logService: LogService;
    private abilityService: AbilityService;
    private equipmentService: EquipmentService;

    constructor(owner: Pet, logService: LogService, abilityService: AbilityService, equipmentService: EquipmentService) {
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
            }
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
            'Balloon': () => new BalloonAbility(owner, this.logService),
            'Plastic Saw': () => new PlasticSawAbility(owner, this.logService),
            'Radio': () => new RadioAbility(owner, this.logService),
            'Oven Mitts': () => new OvenMittsAbility(owner, this.logService),
            'Toilet Paper': () => new ToiletPaperAbility(owner, this.logService),
            'Foam Sword': () => new FoamSwordAbility(owner, this.logService),
            'Toy Gun': () => new ToyGunAbility(owner, this.logService),
            'Melon Helmet': () => new MelonHelmetAbility(owner, this.logService),
            'Stinky Sock': () => new StinkySockAbility(owner, this.logService),
            'Flashlight': () => new FlashlightAbility(owner, this.logService),
            'Peanut Jar': () => new PeanutJarAbility(owner, this.logService),
            'Air Palm Tree': () => new AirPalmTreeAbility(owner, this.logService),
            'Television': () => new TelevisionAbility(owner, this.logService),
            'Crystal Ball': () => new CrystalBallAbility(owner, this.logService),
            //'Candelabra': () => new CandelabraAbility(owner, this.logService, this.abilityService),
            //'Excalibur': () => new ExcaliburAbility(owner, this.logService, this.abilityService),
            'Evil Book': () => new EvilBookAbility(owner, this.logService, this.abilityService),
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
            'Pandoras Box': () => new PandorasBoxAbility(owner, this.logService, this.abilityService, this.equipmentService),
            'Stick': () => new StickAbility(owner, this.logService),
            'Cash Register': () => new CashRegisterAbility(owner, this.logService),
            'Microwave Oven': () => new MicrowaveOvenAbility(owner, this.logService, this.equipmentService),
            'Camera': () => new CameraAbility(owner, this.logService)
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
                    player: owner.parent
                });
            } catch (error) {
                console.warn(`Failed to add ${toyName} ability to ${this.name}:`, error);
            }
        } else {
            this.logService.createLog({
                message: `Custom toy ability is currently not supported for Chameleon ability`,
                type: 'ability',
                player: owner.parent
            });
        }
    }

    copy(newOwner: Pet): ChameleonAbility {
        return new ChameleonAbility(newOwner, this.logService, this.abilityService, this.equipmentService);
    }
}
