import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Donkey extends Pet {
    name = "Donkey";
    tier = 4;
    pack: Pack = 'Star';
    attack = 4;
    health = 6;
    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let opponent = this.parent.opponent;
        let target = opponent.getLastPet();
        if (target == null) {
            return;
        }
        this.parent.pushPet(target, target.position);
        this.logService.createLog({
            message: `${this.name} pushed ${target.name} to the front.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendFaints(gameApi, pet, tiger);
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