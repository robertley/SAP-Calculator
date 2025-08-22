import { GameAPI } from "../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../services/ability.service";
import { LogService } from "../../../services/log.service";
import { Equipment } from "../../equipment.class";
import { Pack, Pet } from "../../pet.class";
import { Player } from "../../player.class";

export class MimicOctopus extends Pet {
    name = "Mimic Octopus";
    tier = 6;
    pack: Pack = 'Star';
    attack = 3;
    health = 6;

    afterAttack(gameApi?: GameAPI, tiger?: boolean): void {
        let targets = this.parent.opponent.getLowestHealthPets(this.level);
        
        for (let target of targets) {
            let damage = 4;
            this.snipePet(target, damage, true, tiger);
        }

        this.superAfterAttack(gameApi, tiger);
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