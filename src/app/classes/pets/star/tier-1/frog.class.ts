import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Frog extends Pet {
    name = "Frog";
    tier = 1;
    pack: Pack = 'Star';
    attack = 3;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        if (this.level > 1) {
            return;
        }
        
        // Get pets ahead and behind with Silly-aware targeting
        let targetsAheadResp = this.parent.nearestPetsAhead(1, this);
        let targetsBehindResp = this.parent.nearestPetsBehind(1, this);
        
        if (targetsAheadResp.pets.length === 0 || targetsBehindResp.pets.length === 0) {
            return;
        }
        
        let petInFront = targetsAheadResp.pets[0];
        let petInBack = targetsBehindResp.pets[0];
        
        let petInFrontAttack = petInFront.attack;
        let petInFrontHealth = petInFront.health;
        let petInBackAttack = petInBack.attack;
        let petInBackHealth = petInBack.health;
        
        petInFront.attack = petInBackAttack;
        petInFront.health = petInBackHealth;
        petInBack.attack = petInFrontAttack;
        petInBack.health = petInFrontHealth;
        
        let isRandom = targetsAheadResp.random || targetsBehindResp.random;
        this.logService.createLog({
            message: `${this.name} swapped the attack and health of ${petInFront.name} and ${petInBack.name}.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: isRandom
        });
        this.superStartOfBattle(gameApi, tiger);
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