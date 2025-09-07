import { cloneDeep } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { FairyBall } from "../../hidden/fairy-ball.class";

export class FairyArmadillo extends Pet {
    name = "Fairy Armadillo";
    tier = 4;
    pack: Pack = 'Star';
    attack = 2;
    health = 6;

    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.alive) {
            const healthGain = this.level * 2;
            const targetResp = this.parent.getThis(this);
            const target = targetResp.pet
            if (target == null) {
                return
            }
            target.increaseHealth(healthGain);
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${healthGain} permanent health and transforms into a protected ball!`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            const transformTargetResp = this.parent.getThis(this);
            const transformTarget = transformTargetResp.pet
            if (transformTarget == null) {
                return
            }
            const fairyBall = new FairyBall(this.logService, this.abilityService, transformTarget.parent, transformTarget.health, transformTarget.attack, transformTarget.mana, transformTarget.exp, transformTarget.equipment);
            this.logService.createLog({
                message: `${this.name} transformed ${transformTarget.name} into a protected ball!`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: transformTargetResp.random
            });
            transformTarget.parent.transformPet(transformTarget, fairyBall);
        }
        this.superHurt(gameApi, pet, tiger);
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