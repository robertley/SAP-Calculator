import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Raccoon extends Pet {
    name = "Raccoon";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 2;
    stealCounter = 0;
    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        let opponent = getOpponent(gameApi, this.parent);
        let target = opponent.getPetAtPosition(0);
        if (target == null) {
            return;
        }
        if (target.equipment == null) {
            return;
        }
        if (this.stealCounter > this.level) {
            return;
        }
        this.givePetEquipment(target.equipment);
        target.equipment = null;
        this.logService.createLog({
            message: `${this.name} stole ${target.name}'s equipment. (${this.equipment.name})`,
            type: 'ability',
            player: this.parent
        })
        this.stealCounter++;
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, equipment);
    }
    resetPet(): void {
        this.stealCounter = 0;
        super.resetPet();
    }
}