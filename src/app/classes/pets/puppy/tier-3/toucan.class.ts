import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EquipmentService } from "../../../../services/equipment.service";
import { InjectorService } from "../../../../services/injector.service";

export class Toucan extends Pet {
    name = "Toucan";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 3;
    beforeAttack(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.timesAttacked >= 1) {
            return;
        }
        let newEquipmentInstance: Equipment;
        if (this.equipment == null || this.equipment.tier > 5) {
            newEquipmentInstance = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get('egg');
        } else {
            newEquipmentInstance = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get(this.equipment.name); 
        }

        let targetsResp = this.parent.nearestPetsBehind(this.level, this, newEquipmentInstance.name);
        let targets = targetsResp.pets;
        if (targets.length == 0) {
            return;
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${newEquipmentInstance.name}`,
                type: 'ability',
                player: this.parent,
                randomEvent: false,
                tiger: tiger,
                pteranodon: pteranodon
            })

            target.givePetEquipment(newEquipmentInstance);
        }
        this.superBeforeAttack(gameApi, tiger);
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