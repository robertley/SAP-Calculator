import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class TigerBug extends Pet {
    name = "Tiger Bug";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 4;
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

        let target1Resp = this.parent.opponent.getFurthestUpPet(this);
        let target1 = target1Resp.pet;
        let targets = [];
        let isRandom = target1Resp.random;

        if (target1) {
            targets.push(target1);
        }

        // Get second target
        let target2: Pet = null;
        if (isRandom) {
            // If Silly, get new random target for second hit
            let target2Resp = this.parent.opponent.getFurthestUpPet(this);
            target2 = target2Resp.pet;
        } else {
            // Normal behavior - target behind first target
            target2 = target1?.petBehind();
        }

        if (target2) {
            targets.push(target2);
        }

        let power = this.level * 3;
        for (let target of targets) {
            if (target != null) {
                this.snipePet(target, power, isRandom, tiger);
            }
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