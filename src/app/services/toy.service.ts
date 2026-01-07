import { Injectable } from "@angular/core";
import { LogService } from "./log.service";
import { Player } from "../classes/player.class";
import { Pet } from "../classes/pet.class";
import { Equipment } from "../classes/equipment.class";
import { AbilityService } from "./ability.service";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { PetService } from "./pet.service";
import { Balloon } from "../classes/toys/tier-1/balloon.class";
import { TennisBall } from "../classes/toys/tier-1/tennis-ball.class";
import { Radio } from "../classes/toys/tier-2/radio.class";
import { GarlicPress } from "../classes/toys/tier-2/garlic-press.class";
import { PlasticSaw } from "../classes/toys/tier-2/plastic-saw.class";
import { ToiletPaper } from "../classes/toys/tier-3/toilet-paper.class";
import { OvenMitts } from "../classes/toys/tier-3/oven-mitts.class";
import { MelonHelmet } from "../classes/toys/tier-4/melon-helmet.class";
import { FoamSword } from "../classes/toys/tier-4/foam-sword.class";
import { ToyGun } from "../classes/toys/tier-4/toy-gun.class";
import { Flashlight } from "../classes/toys/tier-5/flashlight.class";
import { StrinkySock } from "../classes/toys/tier-5/stinky-sock.class";
import { Television } from "../classes/toys/tier-6/television.class";
import { PeanutJar } from "../classes/toys/tier-6/peanut-jar.class";
import { AirPalmTree } from "../classes/toys/tier-6/air-palm-tree.class";
import { Stick } from "../classes/toys/tier-1/stick.class";
import { CashRegister } from "../classes/toys/tier-4/cash-register.class";
import { Camera } from "../classes/toys/tier-5/camera.class";
import { PandorasBox } from "../classes/toys/unicorn/pandoras-box.class";
import { EquipmentService } from "./equipment.service";
import { WitchBroom } from "../classes/toys/unicorn/witch-broom.class";
import { MagicWand } from "../classes/toys/unicorn/magic-wand.class";
import { CrystalBall } from "../classes/toys/unicorn/crystal-ball.class";
import { TreasureMap } from "../classes/toys/unicorn/treasure-map.class";
import { TreasureChest } from "../classes/toys/unicorn/treasure-chest.class";
import { EvilBook } from "../classes/toys/unicorn/evil-book.class";
import { Puma } from "../classes/pets/puppy/tier-6/puma.class";
import { MagicCarpet } from "../classes/toys/unicorn/magic-carpet.class";
import { MagicLamp } from "../classes/toys/unicorn/magic-lamp.class";
import { Candleabra } from "../classes/toys/unicorn/candelabra.class";
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

@Injectable({
    providedIn: 'root'
})
export class ToyService {

    toys: Map<number, string[]> = new Map();

    startOfBattleEvents: AbilityEvent[] = [];
    emptyFrontSpaceEvents: AbilityEvent[] = [];
    friendSummonedEvents: AbilityEvent[] = [];

    constructor(private logService: LogService, private abilityService: AbilityService, private gameService: GameService, private equipmentService: EquipmentService, private petService: PetService) {
        this.setToys();
    }

    setToys() {
        this.toys.set(1, [
            'Ballon',
            'Stick'
        ])
        this.toys.set(2, [
            'Radio',
            'Garlic Press',
            'Plastic Saw',
            'Microwave Oven',
            'Tennis Ball'
        ])
        this.toys.set(3, [
            'Foam Sword',
            'Melon Helmet',
            'Toy Gun'
        ])
        this.toys.set(4, [
            'Oven Mitts',
            'Toilet Paper',
            'Cash Register'
        ])
        this.toys.set(5, [
            'Flashlight',
            'Stinky Sock',
            'Camera'
        ])
        this.toys.set(6, [
            'Television',
            'Peanut Jar',
            'Air Palm Tree'
        ])

        this.toys.set(7, [
            'Witch Broom',
            'Pandoras Box',
            'Magic Wand',
            'Crystal Ball',
            'Treasure Map',
            'Treasure Chest',
            'Evil Book',
            'Magic Carpet',
            'Magic Lamp',
            'Nutcracker',
            'Tinder Box',
            'Candleabra',
            'Glass Shoes',
            'Golden Harp',
            'Lock of Hair',
            'Magic Mirror',
            'Pickaxe',
            'Red Cape',
            'Rose Bud',
            'Excalibur',
            'Holy Grail'
        ])
    }

    createToy(toyName: string, parent: Player, level: number = 1) {
        switch (toyName) {
            case 'Ballon':
                return new Balloon(this.logService, this, parent, level);
            case 'Tennis Ball':
                return new TennisBall(this.logService, this, parent, level);
            case 'Radio':
                return new Radio(this.logService, this, parent, level);
            case 'Garlic Press':
                return new GarlicPress(this.logService, this, parent, level);
            case 'Plastic Saw':
                return new PlasticSaw(this.logService, this, parent, level);
            case 'Toilet Paper':
                return new ToiletPaper(this.logService, this, parent, level);
            case 'Oven Mitts':
                return new OvenMitts(this.logService, this, parent, level);
            case 'Melon Helmet':
                return new MelonHelmet(this.logService, this, parent, level);
            case 'Foam Sword':
                return new FoamSword(this.logService, this, parent, level);
            case 'Toy Gun':
                return new ToyGun(this.logService, this, parent, level);
            case 'Stick':
                return new Stick(this.logService, this, parent, level, this.petService);
            case 'Cash Register':
                return new CashRegister(this.logService, this, parent, level);
            case 'Camera':
                return new Camera(this.logService, this, parent, level);
            case 'Flashlight':
                return new Flashlight(this.logService, this, parent, level);
            case 'Stinky Sock':
                return new StrinkySock(this.logService, this, parent, level);
            case 'Television':
                return new Television(this.logService, this, parent, level);
            case 'Peanut Jar':
                return new PeanutJar(this.logService, this, parent, level);
            case 'Air Palm Tree':
                return new AirPalmTree(this.logService, this, parent, level);

            case 'Pandoras Box':
                return new PandorasBox(this.logService, this, parent, level, this.equipmentService);
            case 'Witch Broom':
                return new WitchBroom(this.logService, this, parent, level);
            case 'Magic Wand':
                return new MagicWand(this.logService, this, parent, level);
            case 'Crystal Ball':
                return new CrystalBall(this.logService, this, parent, level);
            case 'Treasure Map':
                return new TreasureMap(this.logService, this, parent, level);
            case 'Treasure Chest':
                return new TreasureChest(this.logService, this, parent, level);
            case 'Evil Book':
                return new EvilBook(this.logService, this, this.abilityService, parent, level);
            case 'Magic Carpet':
                return new MagicCarpet(this.logService, this, parent, level);
            case 'Magic Lamp':
                return new MagicLamp(this.logService, this, parent, level);
            case 'Nutcracker':
                return new Nutcracker(this.logService, this, this.abilityService, parent, level);
            case 'Tinder Box':
                return new TinderBox(this.logService, this, this.abilityService, parent, level);
            case 'Candleabra':
                return new Candleabra(this.logService, this, parent, level);
            case 'Glass Shoes':
                return new GlassShoes(this.logService, this, parent, level);
            case 'Golden Harp':
                return new GoldenHarp(this.logService, this, parent, level);
            case 'Lock of Hair':
                return new LockOfHair(this.logService, this, parent, level);
            case 'Magic Mirror':
                return new MagicMirror(this.logService, this, parent, level);
            case 'Pickaxe':
                return new Pickaxe(this.logService, this, parent, level);
            case 'Red Cape':
                return new RedCape(this.logService, this, parent, level);
            case 'Rose Bud':
                return new Rosebud(this.logService, this, parent, level);
            case 'Excalibur':
                return new Excalibur(this.logService, this, parent, level);
            case 'Holy Grail':
                return new HolyGrail(this.logService, this, parent, level);
            case 'Microwave Oven':
                return new MicrowaveOven(this.logService, this, parent, level, this.petService, this.gameService);
        }
    }

    snipePet(pet: Pet, power: number, parent: Player, toyName: string, randomEvent = false, puma = false) {
        let damageResp = this.calculateDamgae(pet, this.getManticoreMult(parent), power);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;

        this.dealDamage(pet, damage, parent);

        let message = `${toyName} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment(true)
            let power = Math.abs(defenseEquipment.power);
            let sign = '-';
            if (defenseEquipment.power < 0) {
                sign = '+';
            }
            if (defenseEquipment.name === 'Strawberry') {
                let sparrowLevel = pet.getSparrowLevel();
                if (sparrowLevel > 0) {
                    power = sparrowLevel * 5;
                    message += ` (Strawberry -${power} (Sparrow))`;
                }
            } else {
                message += ` (${defenseEquipment.name} ${sign}${power})`;
            }
            message += defenseEquipment.multiplierMessage;
        }
        if (pet.equipment?.name == 'Icky') {
            message += 'x2 (Icky)';
            if (pet.equipment.multiplier > 1) {
                message += pet.equipment.multiplierMessage;
            }
        }
        let manticoreMult = this.getManticoreMult(parent);
        let manticoreAilments = [
            'Weak',
            'Cold',
            'Icky',
            'Spooked'
        ]
        let hasAilment = manticoreAilments.includes(pet.equipment?.name);
        if (manticoreMult.length > 0 && hasAilment) {
            for (let mult of manticoreMult) {
                message += ` x${mult + 1} (Manticore)`;
            }
        }

        if (damageResp.nurikabe > 0) {
            message += ` -${damageResp.nurikabe} (Nurikabe)`
        }
        if (damageResp.fairyBallReduction > 0) {
            message += ` -${damageResp.fairyBallReduction} (Fairy Ball)`
        }
        if (damageResp.fanMusselReduction > 0) {
            message += ` -${damageResp.fanMusselReduction} (Fan Mussel)`
        }
        if (damageResp.ghostKittenReduction > 0) {
            message += ` -${damageResp.ghostKittenReduction} (Ghost Kitten)`
        }
        if (puma) {
            message += ` (Puma)`;
        }
        this.logService.createLog({
            message: message,
            type: "attack",
            randomEvent: randomEvent,
            player: parent
        });
        return damage;
    }

    calculateDamgae(pet: Pet, manticoreMult: number[], power?: number): {
        defenseEquipment: Equipment,
        damage: number
        nurikabe: number,
        fairyBallReduction?: number,
        fanMusselReduction?: number,
        ghostKittenReduction?: number,
    } {
        let defenseMultiplier = pet.equipment?.multiplier;
        const manticoreDefenseAilments = [
            'Cold',
            'Weak',
            'Spooked'
        ];

        const manticoreAttackAilments = [
            'Ink'
        ];

        const manticoreOtherAilments = [
            'Icky'
        ]
        const isGuavaDefense = pet.equipment?.name === 'Guava';
        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense'
            || pet.equipment?.equipmentClass == 'shield'
            || pet.equipment?.equipmentClass == 'ailment-defense'
            || pet.equipment?.equipmentClass == 'shield-snipe' ? pet.equipment : null;
        if (defenseEquipment == null && isGuavaDefense) {
            defenseEquipment = pet.equipment;
        }

        if (defenseEquipment != null) {
            if (defenseEquipment.name == "Maple Syrup") {
                defenseEquipment = null;
            }
            if (manticoreDefenseAilments.includes(defenseEquipment?.name)) {
                for (let mult of manticoreMult) {
                    defenseMultiplier += mult;
                }
            }
            defenseEquipment.power = defenseEquipment.originalPower * defenseMultiplier;
        }

        let defenseAmt = defenseEquipment?.power ? defenseEquipment.power : 0;
        let sparrowLevel = pet.getSparrowLevel();
        if (pet.equipment?.name === 'Strawberry' && sparrowLevel > 0) {
            defenseAmt += sparrowLevel * 5;
        }

        if (pet.equipment?.name == "Icky") {
            let totalMultiplier = 2; // Base icky multiplier
            for (let mult of manticoreMult) {
                totalMultiplier += mult; // Add manticore multipliers
            }
            totalMultiplier += pet.equipment.multiplier - 1; // Add pandora's box multiplier
            power *= totalMultiplier;
        }
        let min = defenseEquipment?.equipmentClass == 'shield' || defenseEquipment?.equipmentClass == 'shield-snipe' ? 0 : 1;
        //check garlic
        if (defenseEquipment?.minimumDamage !== undefined) {
            min = defenseEquipment.minimumDamage;
        }
        let damage: number;
        if (power <= min && defenseAmt > 0) {
            damage = Math.max(power, 0);
        } else {
            damage = Math.max(min, power - defenseAmt);
        }
        let fairyBallReduction = 0;
        if (pet.hasTrigger(undefined, 'Pet', 'FairyAbility') && damage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'FairyAbility') {
                    fairyBallReduction += ability.level * 2;
                    damage = Math.max(0, damage - ability.level * 2);
                }
            }
        }

        let nurikabe = 0;
        if (pet.hasTrigger(undefined, 'Pet', 'NurikabeAbility') && damage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'NurikabeAbility') {
                    nurikabe += ability.level * 4;
                    damage = Math.max(0, damage - nurikabe);
                    ability.currentUses++;
                }
            }
        }

        let fanMusselReduction = 0;
        if (pet.hasTrigger(undefined, 'Pet', 'FanMusselAbility') && damage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'FanMusselAbility') {
                    fanMusselReduction += ability.level * 1;
                    damage = Math.max(0, damage - fanMusselReduction);
                    ability.currentUses++;
                }
            }
        }

        let ghostKittenReduction = 0;
        if (pet.hasTrigger(undefined, 'Pet', 'GhostKittenAbility') && damage > 0) {
            for (let ability of pet.abilityList) {
                if (ability.name == 'GhostKittenAbility') {
                    ghostKittenReduction += ability.level * 3;
                    damage = Math.max(0, damage - ghostKittenReduction);
                }
            }
        }

        return {
            defenseEquipment: defenseEquipment,
            damage: damage,
            nurikabe: nurikabe,
            fairyBallReduction: fairyBallReduction,
            fanMusselReduction: fanMusselReduction,
            ghostKittenReduction: ghostKittenReduction,
        }
    }
    dealDamage(pet: Pet, damage: number, ToyParent: Player) {
        pet.health -= damage;

        // hurt ability
        if (damage > 0) {
            this.abilityService.triggerHurtEvents(pet);
        }
    }
    getManticoreMult(parent: Player): number[] {
        let mult = [];
        for (let pet of parent.petArray) {
            // if (!pet.alive) {
            //     continue;
            // }
            if (pet.name == 'Manticore') {
                mult.push(pet.level);
            }
        }

        return mult;
    }

    getSparrowLevel(parent: Player): number {
        let highestLevel = 0;
        for (let pet of parent.petArray) {
            if (pet.name == 'Sparrow') {
                highestLevel = Math.max(highestLevel, pet.level);
            }
        }
        return highestLevel;
    }

    setStartOfBattleEvent(event: AbilityEvent) {
        this.startOfBattleEvents.push(event);
    }

    private resetStartOfBattleEvents() {
        this.startOfBattleEvents = [];
    }

    executeStartOfBattleEvents() {
        // shuffle, so that same priority events are in random order
        this.startOfBattleEvents = shuffle(this.startOfBattleEvents);

        this.startOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0 });

        for (let event of this.startOfBattleEvents) {
            event.callback(this.gameService.gameApi);
        }

        this.resetStartOfBattleEvents();
    }


}
