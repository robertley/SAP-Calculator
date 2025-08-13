import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Rice } from "../../../equipment/puppy/rice.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Dolphin } from "../../turtle/tier-3/dolphin.class";

// TODO - bring into lab to determine behavior with spawn and other pet abilities
export class BelugaSturgeon extends Pet {
    name = "Beluga Sturgeon";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        for (let i = 0; i < this.level; i++) {
            let dolphin = new Dolphin(this.logService, this.abilityService, this.parent, 3, 2, 0, 0, new Rice());
            this.logService.createLog({
                message: `${this.name} summoned a 2/3 Dolphin with Rice in the back.`,
                type: 'ability',
                player: this.parent,
                randomEvent: false,
                tiger: tiger,
                pteranodon: pteranodon
            })
            if (this.parent.summonPet(dolphin, 4)) {
                this.abilityService.triggerSummonedEvents(dolphin);
            }
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
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