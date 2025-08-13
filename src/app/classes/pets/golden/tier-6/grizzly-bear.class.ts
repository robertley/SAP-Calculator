import { cloneDeep, shuffle } from "lodash";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Coconut } from "../../../equipment/turtle/coconut.class";

export class GrizzlyBear extends Pet {
    name = "Grizzly Bear";
    tier = 6;
    pack: Pack = 'Golden';
    attack = 6;
    health = 8;
    friendAttacks(gameApi: GameAPI, tiger?: boolean): void {
        if (!tiger) {
            this.abilityUses++;
            // this.logService.createLog({
            //     message: `Grizzly Bear ${this.abilityUses % 5}/5`,
            //     type: 'ability',
            //     player: this.parent

            // })
        }

        if (this.abilityUses % 5 != 0) {
            return
        }
        this.abilityService.setCounterEvent({
            callback: () => {
                let targets = shuffle(this.parent.opponent.petArray);
                let power = this.level * 6;
                for (let i = 0; i < 2; i++) {
                    let target = targets[i];
                    if (target == null) {
                        break;
                    }
                    this.snipePet(target, power, true, tiger);
                }        
            },
            priority: this.attack
        });
        this.superFriendAttacks(gameApi, tiger);
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