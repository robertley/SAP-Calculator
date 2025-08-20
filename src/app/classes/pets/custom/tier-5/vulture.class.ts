import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Vulture extends Pet {
    name = "Vulture";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    private attackCounter = 0;
    
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (!tiger) {
            this.attackCounter++;
        }
        if (this.attackCounter % 2 == 1) {
            return;
        }

        this.abilityService.setCounterEvent({
            callback: () => {
                let opponent = this.parent.opponent;
                let target = opponent.getRandomPet(null, null, true);
                if (target == null) {
                    return;
                }
                let power = this.level * 4;
                this.snipePet(target, power, true, tiger);        
            },
            priority: this.attack
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