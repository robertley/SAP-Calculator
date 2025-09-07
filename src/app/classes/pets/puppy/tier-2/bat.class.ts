import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Weak } from "../../../equipment/ailments/weak.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Bat extends Pet {
    name = "Bat";
    tier = 2;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 4;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        let opponent = getOpponent(gameApi, this.parent);
        let targetsResp = opponent.getRandomPet(null, null, true, null, this);
        let target = targetsResp.pet;
        if (target != null) {
            target.givePetEquipment(new Weak());
            this.logService.createLog({
                message: `${this.name} made ${target.name} weak.`,
                type: 'ability',
                player: this.parent,
                randomEvent: targetsResp.random,
                tiger: tiger
            })
        }
        this.abilityUses++;
        this.superBeforeAttack(gameApi, tiger);
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