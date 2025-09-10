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
        if (this.equipment == null) {
            return;
        }
        if (this.equipment.tier > 5) {
            return;
        }
        if (this.timesAttacked >= 1) {
            return;
        }
        let pets = this.parent.petArray;
        let targets: Pet[] = [];
        let foundSelf = false;
        for (let pet of pets) {
            if (pet == this) {
                foundSelf = true;
            }
            if (!foundSelf) {
                continue;
            }
            if (pet.equipment?.name == this.equipment.name) {
                continue;
            }
            targets.push(pet);
        }
        for (let i = 0; i < this.level; i++) {
            let target = targets[i];
            if (target == null) {
                break;
            }

            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${this.equipment.name}`,
                type: 'ability',
                player: this.parent,
                randomEvent: false,
                tiger: tiger,
                pteranodon: pteranodon
            })

            const newEquipmentInstance = InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get(this.equipment.name);
            if (newEquipmentInstance) {
                target.givePetEquipment(newEquipmentInstance);
            }
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