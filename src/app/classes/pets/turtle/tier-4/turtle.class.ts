import { Melon } from "app/classes/equipment/turtle/melon.class";
import { getOpponent } from "app/util/helper-functions";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Turtle extends Pet {
    name = "Turtle";
    tier = 4;
    pack: Pack = 'Turtle';
    attack = 2;
    health = 5;
    faint(gameApi, tiger, pteranodon?: boolean) {
        for (let i = 0; i < this.level; i++) {
            let targetPet = this.petBehind();
            while(targetPet) {
                if (targetPet.equipment instanceof Melon) {
                    targetPet = targetPet.petBehind();
                    continue;
                }
                break;
            }
            if (targetPet == null) {
                return;
            }
            targetPet.givePetEquipment(new Melon());
            this.logService.createLog({
                message: `${this.name} gave ${targetPet.name} Melon.`,
                type: 'ability',
                tiger: tiger,
                player: this.parent,
                pteranodon: pteranodon
            })
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