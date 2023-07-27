import { Injectable } from "@angular/core";
import { shuffle } from "lodash";
import { AbilityEvent } from "../interfaces/ability-event.interface";

@Injectable({
    providedIn: "root"
})
export class FaintService {

    private faintEvents: AbilityEvent[] = [];
    constructor() {}

    setFaintEvent(event: AbilityEvent) {
        this.faintEvents.push(event);
    }

    reset() {
        this.faintEvents = [];
    }

    executeEvents() {
        // shuffle, so that same priority events are in random order
        this.faintEvents = shuffle(this.faintEvents);

        this.faintEvents.sort((a, b) => { return a.priority > b.priority ? -1 : a.priority < b.priority ? 1 : 0});

        for (let event of this.faintEvents) {
            event.callback();
        }
        
        this.reset();
    }

}



// export interface FaintEvent {
//     priority: number;
//     callback: () => void;
// }