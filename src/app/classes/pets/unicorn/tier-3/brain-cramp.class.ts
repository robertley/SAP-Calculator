import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Melon } from "../../../equipment/turtle/melon.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class BrainCramp extends Pet {
    name = "Brain Cramp";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 1;
    health = 2;
    emptyFrontSpace(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 2;

        this.logService.createLog({
            message: `${this.name} pushed itself to the front, gained ${power} attack and gained Melon.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })

        this.parent.pushPetToFront(this, true);
        this.increaseAttack(power);
        this.givePetEquipment(new Melon());

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