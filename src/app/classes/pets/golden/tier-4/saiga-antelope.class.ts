import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SaigaAntelope extends Pet {
    name = "Saiga Antelope";
    tier = 4;
    pack: Pack = 'Golden';
    attack = 4;
    health = 3;
    private attackCounter = 0;
    
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet == this) {
            return
        }
        if (!this.alive) {
            return;
        } 
        if (!tiger) {
            this.attackCounter++;
        }
        if (this.attackCounter % 2 != 0) {
            return;
        }
        this.abilityService.setCounterEvent({
            callback: () => {
                this.parent.gainTrumpets(this.level * 3, this);
            },
            priority: this.attack,
            pet: this
        });
        
        super.superFriendFaints(gameApi, pet, tiger);
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