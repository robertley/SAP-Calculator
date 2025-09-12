import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { EquipmentService } from "../../../../services/equipment.service";
import { PetService } from "../../../../services/pet.service";
import { GameService } from "../../../../services/game.service";
import { InjectorService } from "../../../../services/injector.service";

export class Seagull extends Pet {
    name = "Seagull";
    tier = 4;
    pack: Pack = 'Custom';
    attack = 4;
    health = 3;
    abilityUses: number;
    friendSummoned(gameApi: GameAPI, pet: Pet, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        if (this.equipment == null) { 
            return;
        }

        pet.givePetEquipment(InjectorService.getInjector().get(EquipmentService).getInstanceOfAllEquipment().get(this.equipment.name));
        this.logService.createLog({
            message: `${this.name} gave ${pet.name} a ${this.equipment.name}`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.abilityUses++;
        this.superFriendSummoned(gameApi, pet, tiger);
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
        protected gameService: GameService,
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