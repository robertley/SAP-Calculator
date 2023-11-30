import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Peanut } from "../../../equipment/turtle/peanut.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Walrus extends Pet {
    name = "Walrus";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 7;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = this.parent.getRandomPets(this.level, null, true, null);
        for (let target of targets) {
            target.givePetEquipment(new Peanut());
            this.logService.createLog({
                message: `${this.name} gave ${target.name} a Peanut.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: true
            })
        }
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}