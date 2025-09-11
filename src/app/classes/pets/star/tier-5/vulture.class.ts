import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Vulture extends Pet {
    name = "Vulture";
    tier = 5;
    pack: Pack = 'Star';
    attack = 4;
    health = 3;
    
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!this.alive) {
            return;
        } 
        if (!tiger) {
            this.abilityCounter++;
        }
        if (this.abilityCounter % 2 == 1) {
            return;
        }

        this.abilityService.setCounterEvent({
            callback: () => {
                let opponent = this.parent.opponent;
                let targetResp = opponent.getRandomPet([], false, true, false, this);
                if (targetResp.pet == null) {
                    return;
                }
                let power = this.level * 4;
                this.snipePet(targetResp.pet, power, targetResp.random, tiger);        
            },
            priority: this.attack,
            pet: this
        });
        this.superFriendFaints(gameApi, pet, tiger);
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