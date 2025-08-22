import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { DirtyRat } from "../../hidden/dirty-rat.class";

export class Rat extends Pet {
    name = "Rat";
    tier = 2;
    pack: Pack = 'Turtle';
    health = 6;
    attack = 3;
    afterFaint(gameApi: GameAPI, tiger, pteranodon?: boolean) {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        for (let i = 0; i < this.level; i++) {
            this.logService.createLog({
                message: `${this.name} Summoned Dirty Rat on Opponent`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            })
            let dirtyRat = new DirtyRat(this.logService, this.abilityService, opponent, null, null, 0, 0);

            let spawned = opponent.summonPet(dirtyRat, 0);
            if (spawned) {
                this.abilityService.triggerFriendSummonedEvents(dirtyRat);
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