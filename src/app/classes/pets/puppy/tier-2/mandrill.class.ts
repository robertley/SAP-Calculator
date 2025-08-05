import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FlyingSquirrel } from "../tier-3/flying-squirrel.class";

export class Mandrill extends Pet {
    name = "Mandrill";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let toyLevelMax = this.level * 2;
        if (this.parent.toy?.tier <= toyLevelMax) {
            // check if parent has instance of flying squirrel
            let hasFlyingSquirrel = false;
            for (let pet of this.parent.petArray) {
                if (pet instanceof FlyingSquirrel) {
                    hasFlyingSquirrel = true;
                    break;
                }
            }
            this.parent.breakToy(hasFlyingSquirrel);
            this.abilityService.triggerFriendlyToyBrokeEvents(this.parent);
        }
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