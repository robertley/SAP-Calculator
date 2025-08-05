import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class JerseyDevil extends Pet {
    name = "Jersey Devil";
    tier = 5;
    pack: Pack = 'Unicorn';
    attack = 5;
    health = 4;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        let isPlayer = this.parent === gameApi.player;
        let mult = isPlayer ? gameApi.playerLevel3Sold : gameApi.opponentLevel3Sold;
        mult = Math.min(mult, 5);
        let power = this.level * mult;

        this.logService.createLog({
            message: `${this.name} gave ${pet.name} ${power} attack and ${power} health`,
            type: "ability",
            player: this.parent,
            tiger: tiger
        });
        
        pet.increaseAttack(power);
        pet.increaseHealth(power);

        this.superFriendSummoned(gameApi, pet, tiger);
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