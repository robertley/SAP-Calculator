import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Cassowary extends Pet {
    name = "Cassowary";
    tier = 3;
    pack: Pack = 'Star';
    attack = 5;
    health = 2;

    friendGainedPerk(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (pet.parent !== this.parent || pet.equipment?.name !== 'Strawberry') {
            this.superFriendGainedPerk(gameApi, pet, tiger);
            return;
        }

        const buffAmount = this.level;

        this.logService.createLog({
            message: `${this.name} gained +${buffAmount} permanent health and +${buffAmount} attack for this battle.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        });

        this.increaseHealth(buffAmount);
        
        this.increaseAttack(buffAmount);

        this.superFriendGainedPerk(gameApi, pet, tiger);
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