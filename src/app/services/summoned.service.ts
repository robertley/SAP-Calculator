import { Injectable } from "@angular/core";
import { AbilityEvent } from "../interfaces/ability-event.interface";
import { shuffle } from "lodash";
import { Pet } from "../classes/pet.class";

@Injectable({
    providedIn: "root"
})
export class SummonedService {
    private summonedEvents: AbilityEvent[] = [];

    constructor() {}

    triggerSummonedEvents(summonedPet: Pet) {
        for (let pet of summonedPet.parent.petArray) {
            // this works because summoned pets will never have a 'summoned' ability
            if (pet.friendSummoned != null) {
                this.setSummonedEvent({
                    callback: () => { pet.friendSummoned(summonedPet) },
                    priority: pet.attack
                })
            }
        }
    }

    setSummonedEvent(event: AbilityEvent) {
        this.summonedEvents.push(event);
    }

    reset() {
        this.summonedEvents = [];
    }

    executeEvents() {
        // shuffle, so that same priority events are in random order
        this.summonedEvents = shuffle(this.summonedEvents);

        this.summonedEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.summonedEvents) {
            event.callback();
        }
        
        this.reset();
    }

}