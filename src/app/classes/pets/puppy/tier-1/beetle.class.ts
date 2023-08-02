import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Garlic } from "../../../equipment/garlic.class";
import { Honey } from "../../../equipment/honey.class";
import { MeatBone } from "../../../equipment/meat-bone.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Beetle extends Pet {
    name = "Beetle";
    tier = 1;
    pack: Pack = 'Puppy';
    attack = 1;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let equipment;
        switch (this.level) {
            case 1:
                equipment = new Honey(this.logService, this.abilityService);
                break;
            case 2:
                equipment = new MeatBone();
                break;
            case 3:
                equipment = new Garlic();
                break;
        }
        this.equipment = equipment;
        this.logService.createLog({
            message: `${this.name} gained ${equipment.name} perk.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityService.triggerFriendGainedPerkEvents(this);
        super.superStartOfBattle(gameApi, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
}