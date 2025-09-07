import { Strawberry } from "app/classes/equipment/star/strawberry.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Hummingbird extends Pet {
    name = "Hummingbird";
    tier = 1;
    pack: Pack = 'Star';
    attack = 2;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetsResp = this.parent.nearestPetsBehind(this.level, this, 'Strawberry');
        if (targetsResp.pets.length === 0) {
            return;
        }
        
        for (let target of targetsResp.pets) {
            target.givePetEquipment(new Strawberry(this.logService, this.abilityService));
            this.logService.createLog({
                message: `${this.name} gave ${target.name} strawberry.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsResp.random
            })
        }
        this.superStartOfBattle(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }
}