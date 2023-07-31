import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Chick } from "../../hidden/chick.class";

export class Rooster extends Pet {
    name = "Rooster";
    tier = 5;
    pack: Pack = 'Turtle';
    attack = 6;
    health = 4;
    faint(gameApi?: GameAPI, tiger?: boolean): void {
        let attack = Math.floor(this.attack * .5);
        for (let i = 0; i < this.level; i++) {
            this.abilityService.setSpawnEvent({
                callback: () => {
                    this.logService.createLog({
                        message: `${this.name} summoned Chick (${attack}).`,
                        type: 'ability',
                        player: this.parent,
                        tiger: tiger
                    })
                    this.parent.summonPet(
                        new Chick(this.logService, this.abilityService, this.parent, 1, attack, this.minExpForLevel),
                        this.savedPosition
                    )
                },
                priority: this.attack,
                player: this.parent
            })
        }
        this.superFaint(gameApi, tiger);
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