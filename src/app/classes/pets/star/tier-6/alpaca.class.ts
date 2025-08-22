import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Alpaca extends Pet {
    name = "Alpaca";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 7;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (pet instanceof Alpaca) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        pet.increaseExp(3);
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} 3 exp.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
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