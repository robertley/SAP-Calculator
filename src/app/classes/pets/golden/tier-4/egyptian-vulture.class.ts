import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class EgyptianVulture extends Pet {
    name = "Egyptian Vulture";
    tier = 5;
    pack: Pack = 'Golden';
    attack = 7;
    health = 4;
    knockOut(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        // Find all pets behind and filter for ones with faint abilities
        let targetsBehindResp = this.parent.nearestPetsBehind(5, this);
        let friendBehind = null;
        for (let petBehind of targetsBehindResp.pets) {
            if (petBehind.faint != null) {
                friendBehind = petBehind;
                break;
            }
        }
        if (friendBehind == null) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} activated ${friendBehind.name}'s ability.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetsBehindResp.random
        })
        friendBehind.faint(gameApi, false);
        this.abilityUses++;
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

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = this.level;
    }
}