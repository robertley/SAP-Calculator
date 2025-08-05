import { Injectable } from "@angular/core";
import { LogService } from "./log.servicee";
import { Player } from "../classes/player.class";
import { Pet } from "../classes/pet.class";
import { Equipment } from "../classes/equipment.class";
import { AbilityService } from "./ability.service";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { cloneDeep, shuffle } from "lodash";
import { GameService } from "./game.service";
import { Balloon } from "../classes/toys/tier-1/balloon.class";
import { TennisBall } from "../classes/toys/tier-1/tennis-ball.class";
import { Radio } from "../classes/toys/tier-2/radio.class";
import { GarlicPress } from "../classes/toys/tier-2/garlic-press.class";
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

@Injectable({
    providedIn: 'root'
})
export class ToyService {

    toys: Map<number, string[]> = new Map();

    startOfBattleEvents: AbilityEvent[] = [];
    emptyFrontSpaceEvents: AbilityEvent[] = [];
    friendSummonedEvents: AbilityEvent[] = [];

    constructor(private logService: LogService, private abilityService: AbilityService, private gameService: GameService, private equipmentService: EquipmentService) {
        this.setToys();
    }

    setToys() {
        this.toys.set(1, [
            'Ballon',
            'Tennis Ball'
        ])
        this.toys.set(2, [
            'Radio',
            'Garlic Press'
        ])
        this.toys.set(3, [
            'Toilet Paper',
            'Oven Mitts'
        ])
        this.toys.set(4, [
            'Melon Helmet',
            'Foam Sword',
            'Toy Gun'
        ])
        this.toys.set(5, [
            'Flashlight',
            'Stinky Sock'
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
        switch(toyName) {
            case 'Ballon':
                return new Balloon(this.logService, this, parent, level);
            case 'Tennis Ball':
                return new TennisBall(this.logService, this, parent, level);
            case 'Radio':
                return new Radio(this.logService, this, parent, level);
            case 'Garlic Press':
                return new GarlicPress(this.logService, this, parent, level);
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
        }
    }

    snipePet(pet: Pet, power: number, parent: Player, toyName: string, randomEvent=false, puma=false) {
        let damageResp = this.calculateDamgae(pet, power);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;
        pet.health -= damage;

        let message = `${toyName} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment()
            message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
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
        
        // hurt ability
        if (pet.hurt != null) {
            this.abilityService.setHurtEvent({
                callback: pet.hurt.bind(pet),
                priority: pet.attack,
                player: pet.parent,
            })
        }
    }

    calculateDamgae(pet: Pet, power?: number): {defenseEquipment: Equipment, damage: number} {
        let defenseEquipment: Equipment = pet.equipment?.equipmentClass == 'defense' 
        || pet.equipment?.equipmentClass == 'shield' ? pet.equipment : null;

        let defenseAmt = defenseEquipment?.power ?? 0;
        let min = defenseEquipment?.equipmentClass == 'shield' ? 0 : 1;
        let damage = Math.max(min, power - defenseAmt);
        return {
            defenseEquipment: defenseEquipment,
            damage: damage
        }
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

        this.startOfBattleEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.startOfBattleEvents) {
            event.callback(this.gameService.gameApi);
        }
        
        this.resetStartOfBattleEvents();
    }


}