import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class GiantPangasius extends Pet {
    name = "Giant Pangasius";
    tier = 5;
    pack: Pack = 'Danger';
    attack = 4;
    health = 5;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (!gameApi) {
            return;
        }

        // Use the correct transformation amount based on which player this pet belongs to
        let transformations: number;
        if (this.parent === gameApi.player) {
            transformations = gameApi.playerTransformationAmount;
        } else {
            transformations = gameApi.opponentTransformationAmount;
        }
        
        let damage = this.level * 4; // 4/8/12 damage per level
        
        if (transformations > 0) {
            for (let i = 0; i < transformations; i++) {
                let target = this.parent.opponent.getRandomPet(null, null, true);
                if (target) {
                    this.snipePet(target, damage, true, tiger);
                }
            }
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