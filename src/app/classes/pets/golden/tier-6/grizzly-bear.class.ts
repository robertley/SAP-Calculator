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
    
    friendAttacks(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!tiger) {
            this.abilityCounter++;
            // this.logService.createLog({
            //     message: `Grizzly Bear ${this.abilityCounter % 5}/5`,
            //     type: 'ability',
            //     player: this.parent

            // })
        }

        if (this.abilityCounter % 5 != 0) {
            return
        }
        this.abilityService.setCounterEvent({
            callback: () => {
                let targetResp = this.parent.opponent.getRandomPets(2, [], true, false, this);
                let targets = targetResp.pets;
                let power = this.level * 6;
                for (let target of targets) {
                    this.snipePet(target, power, targetResp.random, tiger);
                }        
            },
            priority: this.attack,
            pet: this
        });
        this.superFriendAttacks(gameApi, pet, tiger);
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