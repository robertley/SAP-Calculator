import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Tsuchinoko extends Pet {
    name = "Tsuchinoko";
    tier = 1;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 1;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return
        }
        this.parent.pushPetToFront(target, true);
        this.logService.createLog({
            message: `${this.name} pushed ${target.name} to the front and gained ${this.level} experience.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        let expTargetResp = this.parent.getThis(this);
        let expTarget = expTargetResp.pet;
        if (expTarget == null) {
            return
        }
        expTarget.increaseExp(this.level);
        this.logService.createLog({
            message: `${this.name} gave ${expTarget.name} +${this.level} experience.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.superStartOfBattle(gameApi, tiger);
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