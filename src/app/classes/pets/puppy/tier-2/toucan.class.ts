import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Toucan extends Pet {
    name = "Toucan";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.equipment == null) {
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

            // TODO
            // might need a new instance
            // deep copy might actually be correct.
            // lemon with one use will copy a one use lemon behind
            target.givePetEquipment(cloneDeep(this.equipment));
        }
        this.superFaint(gameApi, tiger);
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