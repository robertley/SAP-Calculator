import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Rock } from "../../hidden/rock.class";

export class Cockatrice extends Pet {
    name = "Cockatrice";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 5;
    health = 7;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targets = this.parent.opponent.petArray.reverse();
        let target = null;
        for (let pet of targets) {
            if (pet.level <= this.level) {
                target = pet;
                break;
            }
        }
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} transformed ${target.name} into a Rock.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });
        let rock = new Rock(this.logService, this.abilityService, target.parent, target.health, target.attack, target.mana, target.exp, target.equipment);
        let position = target.position;
        this.parent.opponent.setPet(position, rock, false);
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