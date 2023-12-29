import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Egg } from "../../../equipment/puppy/egg.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Nest } from "../../hidden/nest.class";

export class Robin extends Pet {
    name = "Robin";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let nest = new Nest(this.logService, this.abilityService, this.parent, null, null, this.minExpForLevel, null);
        this.logService.createLog({
            message: `${this.name} summoned a Nest (level ${this.level}).`,
            type: 'ability',
            player: this.parent,
            randomEvent: false,
            tiger: tiger
        });

        if (this.parent.summonPet(nest, Math.max(0, this.position))) {
            this.abilityService.triggerSummonedEvents(nest);

            this.logService.createLog({
                message: `${this.name} gave Nest an Egg.`,
                type: 'ability',
                player: this.parent,
                randomEvent: false,
                tiger: tiger
            })

            nest.givePetEquipment(new Egg(this.logService, this.abilityService));
        }

        this.superStartOfBattle(gameApi, tiger);
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