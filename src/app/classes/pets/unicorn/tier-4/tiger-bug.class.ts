import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TigerBug extends Pet {
    name = "Tiger Bug";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 2;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        if (this.parent.pet0 != null) {
            return;
        }

        this.logService.createLog({
            message: `${this.name} pushed itself to the front.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.parent.pushPetToFront(this, true);

        let target1 = this.parent.opponent.furthestUpPet;
        let target2 = target1?.petBehind();
        let targets = [];

        if (target1) {
            targets.push(target1);
        }
        if (target2) {
            targets.push(target2);
        }

        let power = this.level * 3;
        for (let target of targets) {
            this.snipePet(target, power, false, tiger);
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