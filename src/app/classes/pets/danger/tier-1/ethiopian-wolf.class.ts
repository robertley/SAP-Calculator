import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class EthiopianWolf extends Pet {
    name = "Ethiopian Wolf";
    tier = 1;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        const targets = this.parent.opponent.petArray.slice(0, this.level);
        
        for (const target of targets) {
            if (target?.alive) {
                target.increaseAttack(-1);
                this.logService.createLog({
                    message: `${this.name} removed 1 attack from ${target.name}.`,
                    type: 'ability',
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon
                });
            }
        }
        
        this.superFaint(gameApi, tiger);
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