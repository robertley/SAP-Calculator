import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Ammonite extends Pet {
    name = "Ammonite";
    tier = 6;
    pack: Pack = 'Star';
    attack = 5;
    health = 3;

    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        let friendBehind = targetsBehindResp.pets[0];
        let rolls = this.parent === gameApi.player ? gameApi.playerRollAmount : gameApi.opponentRollAmount;
        let expToGive = Math.floor(rolls / 2) * this.level;
        
        let mimicOctopus = this.petService.createPet({
            name: "Mimic Octopus",
            attack: friendBehind.attack,
            health: friendBehind.health,
            equipment: friendBehind.equipment,
            mana: friendBehind.mana,
            exp: friendBehind.exp
        }, this.parent);

        this.logService.createLog({
            message: `${this.name} transformed ${friendBehind.name} into ${mimicOctopus.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: targetsBehindResp.random
        });
        this.parent.transformPet(friendBehind, mimicOctopus);

        let expTargetResp = this.parent.getThis(mimicOctopus);
        let target = expTargetResp.pet
        if (target == null) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${expToGive} experience.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            pteranodon: pteranodon,
            randomEvent: expTargetResp.random
        });

        target.increaseExp(expToGive);

        this.superFaint(gameApi, tiger);
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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