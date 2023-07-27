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
        this.logs.push(log);
    }

    getLogs() {
        return this.logs;
    }

    reset() {
        this.logs = [];
    }
}