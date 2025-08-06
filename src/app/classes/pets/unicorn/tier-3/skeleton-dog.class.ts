import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SkeletonDog extends Pet {
    name = "Skeleton Dog";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 3;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targets = this.parent.getRandomPets(this.level, [this]);
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${1} attack and ${1} health to ${target.name}.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: true
            })

            target.increaseAttack(1);
            target.increaseHealth(1);
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