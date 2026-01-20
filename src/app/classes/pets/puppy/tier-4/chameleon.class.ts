import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability/ability.service";
import { LogService } from "../../../../services/log.service";
import { ToyService } from "../../../../services/toy/toy.service";
import { EquipmentService } from "../../../../services/equipment/equipment.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChameleonAbility } from "../../../abilities/pets/puppy/tier-4/chameleon-ability.class";

export class Chameleon extends Pet {
    name = "Chameleon";
    tier = 4;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 5;

    private toyService: ToyService;
    private equipmentService: EquipmentService;

    initAbilities(): void {
        this.addAbility(new ChameleonAbility(this, this.logService, this.abilityService, this.equipmentService));
        super.initAbilities();
    }


    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment,
        triggersConsumed?: number,
        toyService?: ToyService,
        equipmentService?: EquipmentService) {
        super(logService, abilityService, parent);
        this.toyService = toyService;
        this.equipmentService = equipmentService;
        this.initPet(exp, health, attack, mana, equipment, triggersConsumed);
    }
}