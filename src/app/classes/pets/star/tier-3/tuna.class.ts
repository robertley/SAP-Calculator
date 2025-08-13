import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tuna extends Pet {
    name = "Tuna";
    tier = 3;
    pack: Pack = 'Star';
    attack = 3;
    health = 5;
    timesHurt = 0;


    hurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        // TO DO: make it so timesHurt is similar to Player Roll Amount, but it is for each pet on the team
        this.timesHurt++;
        this.superHurt(gameApi, pet, tiger);
    }

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.timesHurt > 0) {
            const target = this.parent.getRandomPet([this]);

            if (target == null) {
                return;
            }

            if (target) {
                for (let i = 0; i < this.timesHurt; i++) {
                    const buffAmount = this.level;

                    this.logService.createLog({
                        message: `${this.name} gave ${target.name} +${buffAmount} attack and +${buffAmount} health.`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    });

                    target.increaseAttack(buffAmount);
                    target.increaseHealth(buffAmount);
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.timesHurt = 0;
    }
}