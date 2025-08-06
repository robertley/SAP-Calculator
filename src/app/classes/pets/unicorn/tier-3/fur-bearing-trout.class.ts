
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Dazed } from "../../../equipment/ailments/dazed.class";
import { shuffle } from "../../../../util/helper-functions";
import { Rambutan } from "../../../equipment/unicorn/rambutan.class";

export class FurBearingTrout extends Pet {
    name = "Fur-Bearing Trout";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        
        let targets = [];

        let tempPet: Pet = this;
        while (targets.length < this.level) {
            let target: Pet = tempPet.petBehind();

            if (target == null) {
                break;
            }

            if (target.equipment instanceof Rambutan) {
                tempPet = target;
                continue;
            }

            targets.push(target);
            tempPet = target;
        }

        if (targets.length === 0) {
            return;
        }

        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} a Rambutan.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
            })

            target.givePetEquipment(new Rambutan(this.logService));
        }

        this.superFaint(gameApi, tiger);
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