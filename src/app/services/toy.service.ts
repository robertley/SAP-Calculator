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
        }
    }

    snipePet(pet: Pet, power: number, parent: Player, toyName: string, randomEvent=false) {
        let damageResp = this.calculateDamgae(pet, power);
        let defenseEquipment = damageResp.defenseEquipment;
        let damage = damageResp.damage;
        pet.health -= damage;

        let message = `${toyName} sniped ${pet.name} for ${damage}.`;
        if (defenseEquipment != null) {
            pet.useDefenseEquipment()
            message += ` (${defenseEquipment.name} -${defenseEquipment.power})`;
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
                player: pet.parent
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