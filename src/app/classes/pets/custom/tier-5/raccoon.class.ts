import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Raccoon extends Pet {
    name = "Raccoon";
    tier = 5;
    pack: Pack = 'Custom';
    attack = 4;
    health = 5;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let target = opponent.getPetAtPosition(0);
        if (target == null) {
            return;
        }
        if (target.equipment == null) {
            return;
        }
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        this.logService.createLog({
            message: `${this.name} stole ${target.name}'s equipment. (${target.equipment.name})`,
            type: 'ability',
            player: this.parent
        })
        this.givePetEquipment(target.equipment);
        target.removePerk();
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