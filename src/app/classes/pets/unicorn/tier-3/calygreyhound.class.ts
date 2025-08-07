import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Calygreyhound extends Pet {
    name = "Calygreyhound";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana == 0) {
            return;
        }

        let target1resp = this.parent.opponent.getHighestHealthPet();
        let target2resp = this.parent.opponent.getHighestHealthPet(target1resp.pet);
        let targets: Pet[] = [];
        if (target1resp.pet != null) {
            targets.push(target1resp.pet);
        }

        if (target2resp.pet != null) {
            targets.push(target2resp.pet);
        }

        let power = this.level * this.mana;

        for (let target of targets) {
            target.health = Math.max(1, target.health - power);
            this.logService.createLog({
                message: `${this.name} reduced ${target.name}'s health by ${power} (${target.health}).`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })

        }

        this.mana = 0;

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