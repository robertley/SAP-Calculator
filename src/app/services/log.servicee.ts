import { Injectable } from "@angular/core";
import { Log } from "../interfaces/log.interface";

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private logs: Log[] = [];
    constructor() {

    }

    createLog(log: Log) {
        if (log.tiger) {
            log.message += " (Tiger)"
        }
        if (log.puma) {
            log.message += " (Puma)"
        }
        if (log.pteranodon) {
            log.message += " (Pteranodon)"
        }
        this.logs.push(log);
    }

    getLogs() {
        return this.logs;
    }

    reset() {
        this.logs = [];
    }
}