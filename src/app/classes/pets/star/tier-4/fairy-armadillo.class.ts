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
            this.increaseHealth(healthGain);

            this.logService.createLog({
                message: `${this.name} gains ${healthGain} permanent health and transforms into a protected ball!`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });

            const fairyBall = new FairyBall(this.logService, this.abilityService, this.parent, this.health, this.attack, this.mana, this.exp, this.equipment);
            
            this.parent.transformPet(this, fairyBall);
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