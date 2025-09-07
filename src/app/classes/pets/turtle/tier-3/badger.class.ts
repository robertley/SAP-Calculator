import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Badger extends Pet {
    name = "Badger";
    tier = 3;
    pack: Pack = 'Turtle';
    health = 3;
    attack = 6;
    faint(gameApi, tiger, pteranodon?: boolean) {
        let opponent: Player;
        if (gameApi.player == this.parent) {
            opponent = gameApi.opponet;
        } else {
            opponent = gameApi.player;
        }

        let attackAmt = Math.floor(this.attack * (this.level * .5));
        
        // Target behind (friendly only)
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        if (targetsBehindResp.pets.length > 0) {
            let target = targetsBehindResp.pets[0];
            this.snipePet(target, attackAmt, targetsBehindResp.random, tiger, pteranodon);
        }
        
        // Target ahead (including opponents if no friendlies available)
        let targetsAheadResp = this.parent.nearestPetsAhead(1, this, undefined, true);
        if (targetsAheadResp.pets.length > 0) {
            let target = targetsAheadResp.pets[0];
            this.snipePet(target, attackAmt, targetsAheadResp.random, tiger, pteranodon);
        }

        super.superFaint(gameApi, tiger);
        this.done = true;
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