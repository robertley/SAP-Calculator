import { Injectable } from "@angular/core";
import { LogService } from "./log.servicee";
import { Player } from "../classes/player.class";
import { Pet } from "../classes/pet.class";
import { Equipment } from "../classes/equipment.class";
import { AbilityService } from "./ability.service";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { shuffle } from "lodash";
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

@Injectable({
    providedIn: 'root'
})
export class ToyService {

    toys: Map<number, string[]> = new Map();

    startOfBattleEvents: AbilityEvent[] = [];

    constructor(private logService: LogService, private abilityService: AbilityService, private gameService: GameService) {
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
    // setToyEvent(event: AbilityEvent) {
    //     this.toyEvents.push(event);
    // }

    // resetToyEvents() {
    //     this.toyEvents = [];
    // }

    // executeToyEvents() {
    //     // shuffle, so that same priority events are in random order
    //     this.toyEvents = shuffle(this.toyEvents);

    //     this.toyEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

    //     for (let event of this.toyEvents) {
    //         event.callback(this.gameService.gameApi);
    //     }
        
    //     this.resetToyEvents();
    // }

}