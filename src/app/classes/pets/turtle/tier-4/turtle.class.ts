import { Melon } from "app/classes/equipment/turtle/melon.class";
import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Turtle extends Pet {
    name = "Turtle";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 5;
    faint(gameApi, tiger, pteranodon?: boolean) {
        let targetsBehindResp = this.parent.nearestPetsBehind(this.level, this, "Melon");
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        for (let targetPet of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${this.name} gave ${targetPet.name} Melon.`,
                type: 'ability',
                tiger: tiger,
                player: this.parent,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            })
            targetPet.givePetEquipment(new Melon());
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