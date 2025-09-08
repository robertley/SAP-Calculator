import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { GameAPI } from "../../../../interfaces/gameAPI.interface";

export class Wolverine extends Pet {
    name = "Wolverine";
    tier = 6;
    pack: Pack = 'Turtle';
    attack = 5;
    health = 7;
    private attackCounter = 0;
    
    friendHurt(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet == this) {
            return;
        }
        if (!tiger) {
            this.attackCounter++
            this.logService.createLog({
                message: `${this.name} increased counter: (${this.attackCounter % 4}/4)}`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            });  

        }
        if (this.attackCounter % 4 != 0) {
            return
        }
        this.abilityService.setCounterEvent({
            callback: () => {
                let targetResp = this.parent.opponent.getAll(false, this);
                let targets = targetResp.pets
                if (targets.length == 0) {
                    return;
                }      
                for (let targetPet of targets) {
                    let power = -3 * this.level;
                    targetPet.increaseHealth(power);
                    this.logService.createLog({
                        message: `${this.name} reduced ${targetPet.name} health by ${Math.abs(power)}`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger,
                        randomEvent: targetResp.random
                    });  
                }         
            },
            priority: this.attack,
            pet: this
        });
        this.superFriendHurt(gameApi, pet, tiger);
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