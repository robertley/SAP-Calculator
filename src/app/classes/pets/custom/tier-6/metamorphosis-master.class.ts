import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class MetamorphosisMaster extends Pet {
    name = "Metamorphosis Master";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 4;
    health = 4;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (!this.alive) {
            this.superFaint(gameApi, tiger);
            return;
        }

        // Deal 4 damage to one random enemy for each friendly transformation this turn
        // Get transformation count from app component plus user-input amount for this player
        let transformCount = 0;
        
        // Get battle transformation count
        if (gameApi?.player?.parent) {
            transformCount = gameApi.player.parent.getTransformationCount();
        }
        
        // Add user-input transformation amount
        if (gameApi?.playerTransformationAmount) {
            transformCount += gameApi.playerTransformationAmount;
        }

        if (transformCount > 0) {
                    for (let i = 0; i < transformCount; i++) {
                        let target = this.parent.opponent.getRandomPet([], false, true);
                        if (target) {
                            let damage = 4 * this.level;
                            this.snipePet(target, damage, true, tiger);
                        }
                    }
                    this.logService.createLog({
                        message: `${this.name} dealt damage based on ${transformCount} transformations`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    });

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