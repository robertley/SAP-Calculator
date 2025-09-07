import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class EuropeanMink extends Pet {
    name = "European Mink";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 4;
    health = 3;

    adjacentAttacked(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        let power = this.level;
        
        // Target ahead with Silly-aware targeting
        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        if (targetsAheadResp.pets.length > 0) {
            let targetAhead = targetsAheadResp.pets[0];
            targetAhead.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${targetAhead.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsAheadResp.random
            });
        }

        // Target behind with Silly-aware targeting
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        if (targetsBehindResp.pets.length > 0) {
            let targetBehind = targetsBehindResp.pets[0];
            targetBehind.increaseAttack(power);
            this.logService.createLog({
                message: `${this.name} gave ${targetBehind.name} ${power} attack.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetsBehindResp.random
            });
        }

        this.abilityUses++;
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3;
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