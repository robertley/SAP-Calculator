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
import { EquipmentService } from "./equipment.service";
import { ToyFactoryService } from "./toy-factory.service";
import { Toy } from "../classes/toy.class";

@Injectable({
    providedIn: 'root'
})
export class ToyService {

    toys: Map<number, string[]> = new Map();

    startOfBattleEvents: AbilityEvent[] = [];
    emptyFrontSpaceEvents: AbilityEvent[] = [];
    friendSummonedEvents: AbilityEvent[] = [];

    constructor(private logService: LogService,
        private abilityService: AbilityService,
        private gameService: GameService,
        private equipmentService: EquipmentService,
        private petService: PetService,
        private toyFactory: ToyFactoryService) {
        this.setToys();
    }

    setToys() {
        this.toys.set(1, [
            'Balloon',
            'Stick'
        ])
        this.toys.set(2, [
            'Radio',
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
            'Candelabra',
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
        return this.toyFactory.createToy(toyName, parent, level, this, this.petService, this.equipmentService, this.gameService);
    }

    snipePet(pet: Pet, power: number, parent: Player, toyName: string, randomEvent = false, puma = false) {
        let damageResp = this.calculateDamage(pet, this.getManticoreMult(parent), power);
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

    calculateDamage(pet: Pet, manticoreMult: number[], power?: number): {
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
