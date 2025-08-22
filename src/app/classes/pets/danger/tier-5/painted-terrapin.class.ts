import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { EquipmentService } from "../../../../services/equipment.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { WhiteOkra } from "../../../equipment/danger/white-okra.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class PaintedTerrapin extends Pet {
    name = "Painted Terrapin";
    tier = 5;
    pack: Pack = 'Danger';
    health = 6;
    attack = 4;

    faint(gameApi, tiger, pteranodon?: boolean) {
        for (let i = 0; i < this.level; i++) {
            let targetPet = this.petBehind();
            while(targetPet) {
                if (targetPet.equipment instanceof WhiteOkra) {
                    targetPet = targetPet.petBehind();
                    continue;
                }
                break;
            }
            if (targetPet == null) {
                return;
            }
            this.logService.createLog({
                message: `${this.name} gave ${targetPet.name} White Okra perk`,
                type: 'ability',
                tiger: tiger,
                player: this.parent,
                pteranodon: pteranodon
            })
            targetPet.givePetEquipment(new WhiteOkra());
        }

        this.superFaint(gameApi, tiger);
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