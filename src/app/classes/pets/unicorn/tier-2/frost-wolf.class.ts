import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Cold } from "../../../equipment/ailments/cold.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class FrostWolf extends Pet {
    name = "Frost Wolf";
    tier = 2;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 3;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let opponetPets = this.parent.opponent.petArray;
        let targets = [];
        if (opponetPets[0]) {
            targets.push(opponetPets[0]);
        }

        for (let target of targets) {
            const power = -5 * this.level;

            const coldAilment = new Cold();
            coldAilment.power = power;
            coldAilment.originalPower = power;

            let effectMessage = ".";
            if (this.level === 2) {
                effectMessage = " twice for double effect.";
            } else if (this.level === 3) {
                effectMessage = " thrice for triple effect.";
            }

            this.logService.createLog({
                message: `${this.name} made ${target.name} Cold${effectMessage}`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });

            target.givePetEquipment(coldAilment);
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