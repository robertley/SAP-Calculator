import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class WhiteTiger extends Pet {
    name = "White Tiger";
    tier = 6;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let targets: Pet[] = [];
        let target = this.petBehind();
        while (target && targets.length < this.level) {
            targets.push(target);
            target = target.petBehind();
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} +3 experience.`,
                type: "ability",
                player: this.parent,
                tiger: tiger
            })
            target.increaseExp(3);
        }
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