import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Skewer } from "../../../equipment/puppy/skewer.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SnappingTurtle extends Pet {
    name = "Snapping Turtle";
    tier = 5;
    pack: Pack = 'Puppy';
    attack = 4;
    health = 5;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let excludePets = this.parent.getPetsWithEquipment("Skewer");
        let targetsBehindResp = this.parent.nearestPetsBehind(this.level, this, excludePets);
        if (targetsBehindResp.pets.length === 0) {
            return;
        }
        for (let pet of targetsBehindResp.pets) {
            this.logService.createLog({
                message: `${this.name} gave ${pet.name} Skewer.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: targetsBehindResp.random
            })
            pet.givePetEquipment(new Skewer(this.logService));
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